package handlers

import (
	"bytes"
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"net/url"
	"os"
	"slices"
	"strings"
	"testing"
	"time"

	"pintukarier-backend/internal/adapter/postgres"
	"pintukarier-backend/internal/adapter/storage"
	"pintukarier-backend/internal/domain"
	"pintukarier-backend/internal/usecase"
)

const testSecret = "secret-test-1234567890"

// TestEveryRouteForbidsOtherRoles README 5.4: setiap endpoint punya tes kasus terlarang.
// RequireRole menolak sebelum handler jalan, jadi tidak butuh database.
func TestEveryRouteForbidsOtherRoles(t *testing.T) {
	mux := http.NewServeMux()
	RegisterRoutes(mux, &Deps{Secret: testSecret})
	for _, rt := range Routes {
		method, path, _ := strings.Cut(rt.Pattern, " ")
		path = strings.NewReplacer("{id}", "x", "{nomor}", "1").Replace(path)
		for _, role := range []domain.Role{domain.RoleMahasiswa, domain.RoleHRD, domain.RoleProdi, domain.RoleAdmin} {
			if slices.Contains(rt.Roles, role) {
				continue
			}
			tok, _ := usecase.Issue("u-x", role, testSecret, time.Hour)
			req := httptest.NewRequest(method, path, nil)
			req.Header.Set("Authorization", "Bearer "+tok)
			rec := httptest.NewRecorder()
			mux.ServeHTTP(rec, req)
			if rec.Code != http.StatusForbidden {
				t.Errorf("%s as %s: got %d, want 403", rt.Pattern, role, rec.Code)
			}
		}
		req := httptest.NewRequest(method, path, nil)
		rec := httptest.NewRecorder()
		mux.ServeHTTP(rec, req)
		if rec.Code != http.StatusUnauthorized {
			t.Errorf("%s tanpa token: got %d, want 401", rt.Pattern, rec.Code)
		}
	}
}

func TestCORSAllowsListedOriginsOnly(t *testing.T) {
	h := CORS("https://Pintu Karier.vercel.app, http://localhost:3000", http.NotFoundHandler())
	for origin, want := range map[string]string{"http://localhost:3000": "http://localhost:3000", "https://evil.example": ""} {
		req := httptest.NewRequest(http.MethodOptions, "/files/x.pdf", nil)
		req.Header.Set("Origin", origin)
		rec := httptest.NewRecorder()
		h.ServeHTTP(rec, req)
		if got := rec.Header().Get("Access-Control-Allow-Origin"); got != want || rec.Code != http.StatusNoContent {
			t.Errorf("origin %s: allow=%q code=%d", origin, got, rec.Code)
		}
	}
}

// fakeAI balasan tetap supaya alur end-to-end bisa dites tanpa AI Engine.
type fakeAI struct{}

func (fakeAI) ParseCV(context.Context, []byte, string) (usecase.ParsedCV, error) {
	return usecase.ParsedCV{
		Teks: "Membangun dashboard dengan React di proyek PBL.", Profil: domain.Profile{Ringkasan: "Frontend", Skill: []string{"React"}},
		Identitas: usecase.IdentitasCV{Kampus: "Polines", Semester: 6, IPK: 3.6},
	}, nil
}
func (fakeAI) Transcribe(context.Context, []byte, string) (usecase.Transcript, error) {
	return usecase.Transcript{Teks: "Saya pakai Git dengan pull request."}, nil
}
func (fakeAI) Questions(context.Context, usecase.QuestionsInput) (usecase.Questions, error) {
	return usecase.Questions{Prescreen: []string{"p1", "p2", "p3"}, Interview: []string{"i1", "i2", "i3"}}, nil
}
func (fakeAI) Score(_ context.Context, in usecase.ScoreInput) (usecase.ScoreResult, error) {
	q := "Membangun dashboard dengan React di proyek PBL."
	src := "CV"
	return usecase.ScoreResult{
		Dimensi: []float64{90, 80, 80, 80, 80},
		Bukti: []usecase.AIBukti{
			{Syarat: in.Wajib[0], Wajib: true, Status: "Terpenuhi", Kutipan: &q, Sumber: &src},
			{Syarat: in.Plus[0], Status: "Tidak ditemukan"},
		},
		Alasan: "Syarat wajib punya bukti.", Versi: "fake",
	}, nil
}
func (fakeAI) Benchmark(context.Context) ([]usecase.ModelBenchmark, error) {
	return []usecase.ModelBenchmark{{Fitur: "Ekstraksi CV", Nama: "Groq · model-uji"}}, nil
}
func (fakeAI) DraftFeedback(context.Context, usecase.FeedbackInput) (domain.Feedback, error) {
	return domain.Feedback{Ringkasan: "Draf AI", Kekuatan: []string{"React"}, Area: []domain.Area{{Kompetensi: "Testing otomatis", Kenapa: "belum ada", Saran: "latihan"}}}, nil
}

type client struct {
	t     *testing.T
	h     http.Handler
	token string
}

func (c *client) do(method, path string, body any, want int, out any) {
	c.t.Helper()
	var buf bytes.Buffer
	if body != nil {
		_ = json.NewEncoder(&buf).Encode(body)
	}
	req := httptest.NewRequest(method, path, &buf)
	if c.token != "" {
		req.Header.Set("Authorization", "Bearer "+c.token)
	}
	rec := httptest.NewRecorder()
	c.h.ServeHTTP(rec, req)
	if rec.Code != want {
		c.t.Fatalf("%s %s: got %d, want %d: %s", method, path, rec.Code, want, rec.Body.String())
	}
	if out != nil {
		if err := json.Unmarshal(rec.Body.Bytes(), out); err != nil {
			c.t.Fatalf("%s %s decode: %v", method, path, err)
		}
	}
}

func (c *client) upload(uploadURL string, body []byte, want int) {
	c.t.Helper()
	u, _ := url.Parse(uploadURL)
	req := httptest.NewRequest(http.MethodPut, u.RequestURI(), bytes.NewReader(body))
	rec := httptest.NewRecorder()
	c.h.ServeHTTP(rec, req)
	if rec.Code != want {
		c.t.Fatalf("PUT upload: got %d, want %d: %s", rec.Code, want, rec.Body.String())
	}
}

func register(t *testing.T, h http.Handler, peran, instansi string) *client {
	t.Helper()
	c := &client{t: t, h: h}
	var s SessionResponse
	email := usecase.NewID(peran) + "@uji.id"
	c.do("POST", "/auth/register", RegisterRequest{Nama: "Uji " + peran, Email: email, Password: "rahasia123", Peran: peran, Instansi: instansi}, 201, &s)
	c.do("POST", "/auth/login", LoginRequest{Email: email, Password: "salah12345"}, 401, nil)
	c.do("POST", "/auth/login", LoginRequest{Email: email, Password: "rahasia123"}, 200, &s)
	c.token = s.Token
	return c
}

// drain jalankan semua job antre seperti worker produksi.
func drain(t *testing.T, store *postgres.Store, p *usecase.Pipeline) {
	t.Helper()
	for range 50 {
		j, ok, err := store.ClaimJob(context.Background())
		if err != nil {
			t.Fatal(err)
		}
		if !ok {
			return
		}
		usecase.RunOne(context.Background(), store, p, j)
	}
}

func TestFullFlow(t *testing.T) {
	dbURL := os.Getenv("PINTUKARIER_TEST_DATABASE_URL")
	if dbURL == "" {
		t.Skip("PINTUKARIER_TEST_DATABASE_URL tidak di-set")
	}
	store, drop, err := postgres.OpenTemp(context.Background(), dbURL)
	if err != nil {
		t.Fatal(err)
	}
	defer drop()
	files := storage.NewLocal(t.TempDir(), domain.MaxUploadBytes)
	d := &Deps{Secret: testSecret, Store: store, Files: files, PublicURL: "http://api.test", WebOrigin: "http://web.test"}
	mux := http.NewServeMux()
	RegisterRoutes(mux, d)
	pipe := &usecase.Pipeline{Store: store, AI: fakeAI{}, Files: files, Concurrency: 2}
	drain(t, store, pipe)

	prodi := "Prodi Uji " + usecase.NewID("")
	hr := register(t, mux, "hrd", "PT Uji")
	hr2 := register(t, mux, "hrd", "PT Lain")
	mhs := register(t, mux, "mahasiswa", prodi)
	mhs2 := register(t, mux, "mahasiswa", prodi)
	kaprodi := register(t, mux, "prodi", prodi)
	(&client{t: t, h: mux}).do("POST", "/auth/register", RegisterRequest{Nama: "x", Email: "a@b.id", Password: "rahasia123", Peran: "admin", Instansi: "x"}, 400, nil)

	// CV di halaman profil hanya mengisi field kosong.
	var up UploadURLResponse
	var job JobResponse
	mhs.do("POST", "/me/cv", UploadRequest{Nama: "cv.pdf", Ukuran: 20}, 200, &up)
	mhs.upload(up.UploadURL, []byte("%PDF-1.4 isi cv"), 201)
	mhs2.do("POST", "/me/cv/selesai", UploadDoneRequest{Key: up.Key}, 400, nil)
	mhs.do("POST", "/me/cv/selesai", UploadDoneRequest{Key: up.Key}, 202, &job)
	drain(t, store, pipe)
	var akun ProfilMahasiswa
	mhs.do("GET", "/me/profil", nil, 200, &akun)
	if akun.Prodi != prodi || akun.Kampus != "Polines" || akun.Semester != 6 || akun.IPK != 3.6 || akun.Ringkasan != "Frontend" || len(akun.Skill) != 1 {
		t.Fatalf("profil akun dari CV = %+v", akun)
	}

	var low LowonganResponse
	hr.do("POST", "/lowongan", LowonganRequest{Posisi: "FE Intern", Bidang: "Software Developer", Tipe: "Magang", Deadline: time.Now().AddDate(0, 0, 7).Format(time.DateOnly), Wajib: []string{"React"}, Plus: []string{"Testing otomatis"}}, 201, &low)
	drain(t, store, pipe)
	mhs.do("GET", "/lowongan/"+low.ID, nil, 200, &low)
	if low.PrescreenTanya[0] != "p1" || low.Perusahaan != "PT Uji" {
		t.Fatalf("pertanyaan AI belum tersimpan: %+v", low)
	}

	var lam LamaranResponse
	mhs.do("POST", "/lamaran", ApplyRequest{LowonganID: low.ID}, 201, &lam)
	mhs2.do("GET", "/lamaran/"+lam.ID+"/profil", nil, 403, nil)
	mhs.do("POST", "/lamaran/"+lam.ID+"/prescreening", PrescreeningRequest{Jawaban: []string{"a", "b", "c"}}, 409, nil)

	mhs.do("POST", "/lamaran/"+lam.ID+"/cv", UploadRequest{Nama: "cv.pdf", Ukuran: 6 << 20}, 413, nil)
	mhs.do("POST", "/lamaran/"+lam.ID+"/cv", UploadRequest{Nama: "cv.exe", Ukuran: 10}, 400, nil)
	mhs.do("POST", "/lamaran/"+lam.ID+"/cv", UploadRequest{Nama: "cv.pdf", Ukuran: 20}, 200, &up)
	mhs.upload(strings.Replace(up.UploadURL, "sig=", "sig=0", 1), []byte("%PDF-1.4 isi cv"), 403)
	mhs.upload(up.UploadURL, []byte("bukan pdf sama sekali"), 415)
	mhs.upload(up.UploadURL, []byte("%PDF-1.4 isi cv"), 201)
	mhs.upload(up.UploadURL, []byte("%PDF-1.4 isi cv"), 409)
	mhs.do("POST", "/lamaran/"+lam.ID+"/cv/selesai", UploadDoneRequest{Key: up.Key}, 202, &job)
	drain(t, store, pipe)
	mhs.do("GET", "/jobs/"+job.ID, nil, 200, &job)
	if job.Status != "succeeded" {
		t.Fatalf("parse_cv job = %+v", job)
	}
	var profil domain.Profile
	mhs.do("GET", "/lamaran/"+lam.ID+"/profil", nil, 200, &profil)
	if profil.Skill[0] != "React" {
		t.Fatalf("profil = %+v", profil)
	}
	mhs.do("PUT", "/lamaran/"+lam.ID+"/profil", profil, 200, nil)
	mhs.do("POST", "/lamaran/"+lam.ID+"/interview/1", UploadRequest{Nama: "j.webm", Ukuran: 10}, 409, nil)
	mhs.do("POST", "/lamaran/"+lam.ID+"/prescreening", PrescreeningRequest{Jawaban: []string{"November", "Oke", "github.com/uji"}}, 200, nil)

	webm := append([]byte{0x1A, 0x45, 0xDF, 0xA3}, []byte("webm audio")...)
	// Rekaman Safari: MP4 dengan brand iso5 yang tidak dikenali http.DetectContentType.
	safari := append([]byte{0, 0, 0, 0x18}, []byte("ftypiso5\x00\x00\x02\x00iso5mp41")...)
	for n := 1; n <= 3; n++ {
		p := "/lamaran/" + lam.ID + "/interview/" + string(rune('0'+n))
		nama, isi := "j.webm", webm
		if n == 1 {
			nama, isi = "j.mp4", safari
		}
		mhs.do("POST", p, UploadRequest{Nama: nama, Ukuran: int64(len(isi))}, 200, &up)
		mhs.upload(up.UploadURL, isi, 201)
		mhs.do("POST", p+"/selesai", UploadDoneRequest{Key: up.Key, Durasi: 75}, 202, nil)
	}
	mhs.do("GET", "/lamaran", nil, 200, &[]LamaranResponse{})
	drain(t, store, pipe)

	hr2.do("POST", "/lowongan/"+low.ID+"/analisis", nil, 403, nil)
	hr.do("POST", "/lowongan/"+low.ID+"/analisis", nil, 202, &job)
	var again JobResponse
	hr.do("POST", "/lowongan/"+low.ID+"/analisis", nil, 202, &again)
	if again.ID != job.ID {
		t.Fatal("klik ganda analisis harus mengembalikan job yang sama")
	}
	drain(t, store, pipe)

	var list []KandidatResponse
	hr.do("GET", "/lowongan/"+low.ID+"/kandidat", nil, 200, &list)
	if len(list) != 1 || list[0].Kategori != string(domain.CategoryMemenuhi) || list[0].Bukti[0].Sumber != "CV" {
		t.Fatalf("kandidat = %+v", list)
	}
	var k KandidatResponse
	hr2.do("GET", "/kandidat/"+lam.ID, nil, 403, nil)
	hr.do("GET", "/kandidat/"+lam.ID, nil, 200, &k)
	if len(k.Transkrip) != 3 || k.Transkrip[0].Durasi != "1:15" || k.Feedback != "Draf AI" || k.Prescreen[0] != "November" {
		t.Fatalf("detail = %+v", k)
	}
	hr.do("POST", "/kandidat/"+lam.ID+"/feedback", FeedbackRequest{Isi: "Feedback cukup panjang untuk dikirim.", Reviewed: true}, 409, nil)
	hr.do("PATCH", "/kandidat/"+lam.ID+"/keputusan", KeputusanRequest{Kategori: "Perlu Dipertimbangkan", Keputusan: "Belum lolos"}, 400, nil)
	hr.do("PATCH", "/kandidat/"+lam.ID+"/keputusan", KeputusanRequest{Kategori: "Perlu Dipertimbangkan", Alasan: "Testing belum ada", Keputusan: "Belum lolos"}, 200, &k)
	if k.Kategori != "Perlu Dipertimbangkan" || k.KategoriAI != string(domain.CategoryMemenuhi) {
		t.Fatalf("koreksi = %+v", k)
	}
	hr.do("POST", "/kandidat/"+lam.ID+"/feedback", FeedbackRequest{Isi: "Feedback cukup panjang untuk dikirim.", Reviewed: true}, 200, nil)

	// Benchmark publik tanpa token: kosong sebelum diukur, terisi setelah penyegaran dari AI Engine.
	var bench []usecase.ModelBenchmark
	(&client{t: t, h: mux}).do("GET", "/benchmark", nil, 200, &bench)
	if len(bench) != 0 {
		t.Fatalf("benchmark sebelum diukur = %+v", bench)
	}
	if err := usecase.RefreshBenchmark(context.Background(), store, fakeAI{}, time.Now()); err != nil {
		t.Fatal(err)
	}
	(&client{t: t, h: mux}).do("GET", "/benchmark", nil, 200, &bench)
	if len(bench) != 1 || bench[0].Nama != "Groq · model-uji" {
		t.Fatalf("benchmark setelah diukur = %+v", bench)
	}

	var fbs []FeedbackData
	mhs.do("GET", "/feedback", nil, 200, &fbs)
	if len(fbs) != 1 || fbs[0].Ringkasan != "Feedback cukup panjang untuk dikirim." || fbs[0].Area[0].Matkul != "Pengujian Perangkat Lunak" {
		t.Fatalf("feedback = %+v", fbs)
	}
	var lams []LamaranResponse
	mhs.do("GET", "/lamaran", nil, 200, &lams)
	if lams[0].Status != "Belum lolos" || lams[0].Tahap != 5 {
		t.Fatalf("lamaran = %+v", lams)
	}
	mhs2.do("GET", "/feedback", nil, 200, &fbs)
	if len(fbs) != 0 {
		t.Fatal("mahasiswa lain tidak boleh melihat feedback ini")
	}

	var me MeResponse
	kaprodi.do("GET", "/me", nil, 200, &me)
	var ranking map[string]map[string]RankingResponse
	kaprodi.do("GET", "/prodi/"+me.ProdiID+"/ranking", nil, 200, &ranking)
	if len(ranking) != 0 {
		t.Fatalf("grup 1 kandidat harus disembunyikan server: %+v", ranking)
	}
	kaprodi.do("GET", "/prodi/prodi-lain/ranking", nil, 403, nil)
	var note CatatanResponse
	kaprodi.do("POST", "/prodi/"+me.ProdiID+"/catatan", CatatanRequest{Kompetensi: "Testing otomatis", Aksi: "Tambah workshop testing"}, 201, &note)
	var notes []CatatanResponse
	kaprodi.do("GET", "/prodi/"+me.ProdiID+"/catatan", nil, 200, &notes)
	if len(notes) != 1 || notes[0].Oleh != "Uji prodi" {
		t.Fatalf("catatan = %+v", notes)
	}
}
