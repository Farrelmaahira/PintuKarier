package postgres

import (
	"context"
	_ "embed"
	"encoding/json"
	"fmt"
	"slices"
	"strconv"
	"strings"
	"time"

	"pintukarier-backend/internal/domain"
	"pintukarier-backend/internal/usecase"
)

//go:embed seed_demo.json
var seedJSON []byte

type seedFixture struct {
	LowonganHRD struct {
		ID         string   `json:"id"`
		Perusahaan string   `json:"perusahaan"`
		Wajib      []string `json:"wajib"`
		Plus       []string `json:"plus"`
	} `json:"lowonganHrd"`
	PrescreenTanya []string `json:"prescreenTanya"`
	InterviewTanya []string `json:"interviewTanya"`
	Lowongan       []struct {
		ID         string   `json:"id"`
		Posisi     string   `json:"posisi"`
		Perusahaan string   `json:"perusahaan"`
		Lokasi     string   `json:"lokasi"`
		Tipe       string   `json:"tipe"`
		Deadline   string   `json:"deadline"`
		Tags       []string `json:"tags"`
	} `json:"lowongan"`
	Mahasiswa struct {
		NIM      string  `json:"nim"`
		Prodi    string  `json:"prodi"`
		Kampus   string  `json:"kampus"`
		Semester int     `json:"semester"`
		IPK      float64 `json:"ipk"`
	} `json:"mahasiswa"`
	Kandidat []seedKandidat `json:"kandidat"`
	Catatan  []struct {
		Kompetensi string `json:"kompetensi"`
		Matkul     string `json:"matkul"`
		Aksi       string `json:"aksi"`
		Status     string `json:"status"`
	} `json:"catatan"`
}

type seedKandidat struct {
	ID       string     `json:"id"`
	Nama     string     `json:"nama"`
	Prodi    string     `json:"prodi"`
	Angkatan int        `json:"angkatan"`
	IPK      float64    `json:"ipk"`
	Dimensi  [5]float64 `json:"dimensi"`
	Alasan   string     `json:"alasan"`
	Bukti    []struct {
		Syarat  string `json:"syarat"`
		Wajib   bool   `json:"wajib"`
		Status  string `json:"status"`
		Kutipan string `json:"kutipan"`
		Sumber  string `json:"sumber"`
	} `json:"bukti"`
	Prescreen  []string                         `json:"prescreen"`
	Transkrip  []struct{ Jawab, Durasi string } `json:"transkrip"`
	Peringatan string                           `json:"peringatan"`
	Keputusan  string                           `json:"keputusan"`
	Feedback   string                           `json:"feedback"`
}

var bidangDemo = map[string]string{
	"tumbuh-da": "Data & Analitik", "selaras-it": "Jaringan & Infrastruktur", "nusa-qa": "QA & Testing",
}

// Mahasiswa tambahan agar grup D4 TI di Dasbor Prodi melewati batas minimum 10.
var namaTambahan = []string{"Rizky Ananda", "Putri Maharani", "Galih Pratama", "Siti Nurhaliza Rahman", "Bagas Wicaksono", "Laras Ayuningtyas"}

// lockedPassword bukan format pbkdf2, jadi CheckPassword selalu gagal: kandidat
// fiktif hasil seed tidak bisa dipakai login.
const lockedPassword = "!"

// DemoAccount satu akun demo. Kredensial dibaca dari env, tidak pernah ditulis di kode.
type DemoAccount struct {
	Role     domain.Role
	Email    string
	Password string
	Nama     string
}

// DemoAccountsFromEnv baca DEMO_<PERAN>_EMAIL, DEMO_<PERAN>_PASSWORD, DEMO_<PERAN>_NAMA
// untuk mahasiswa, hrd, dan prodi. Tanpa nilai bawaan: env kosong berarti seed ditolak.
func DemoAccountsFromEnv(getenv func(string) string) ([]DemoAccount, error) {
	var out []DemoAccount
	var missing []string
	roles := []domain.Role{domain.RoleMahasiswa, domain.RoleHRD, domain.RoleProdi}
	if getenv("DEMO_ADMIN_EMAIL") != "" {
		roles = append(roles, domain.RoleAdmin)
	}
	for _, role := range roles {
		prefix := "DEMO_" + strings.ToUpper(string(role)) + "_"
		a := DemoAccount{Role: role, Email: strings.ToLower(strings.TrimSpace(getenv(prefix + "EMAIL"))), Password: getenv(prefix + "PASSWORD"), Nama: strings.TrimSpace(getenv(prefix + "NAMA"))}
		for key, v := range map[string]string{"EMAIL": a.Email, "PASSWORD": a.Password, "NAMA": a.Nama} {
			if v == "" {
				missing = append(missing, prefix+key)
			}
		}
		out = append(out, a)
	}
	if len(missing) > 0 {
		slices.Sort(missing)
		return nil, fmt.Errorf("env akun demo belum diisi: %s", strings.Join(missing, ", "))
	}
	return out, nil
}

// SeedDemo isi akun demo dan data fiktif sekali saja. Tidak pernah dipakai di produksi.
func SeedDemo(ctx context.Context, s *Store, accounts []DemoAccount) error {
	byRole := map[domain.Role]DemoAccount{}
	for _, a := range accounts {
		byRole[a.Role] = a
	}
	// Seed sekali: akun demo sudah ada berarti data demo sudah lengkap. Ganti akun = reset database.
	if _, err := s.UserByID(ctx, "u-demo-hrd"); err == nil {
		return nil
	}
	var fx seedFixture
	if err := json.Unmarshal(seedJSON, &fx); err != nil {
		return fmt.Errorf("seed: %w", err)
	}
	now := time.Now()
	prodi := fx.Mahasiswa.Prodi
	instansi := map[domain.Role]string{
		domain.RoleMahasiswa: prodi,
		domain.RoleHRD:       fx.LowonganHRD.Perusahaan,
		domain.RoleProdi:     prodi,
		domain.RoleAdmin:     "Pusat Karier PNJ",
	}
	for _, a := range accounts {
		hash, err := usecase.HashPassword(a.Password)
		if err != nil {
			return fmt.Errorf("seed akun demo %s: %w", a.Role, err)
		}
		u := domain.User{ID: "u-demo-" + string(a.Role), Email: a.Email, PasswordHash: hash, Role: a.Role, Name: a.Nama, Institution: instansi[a.Role], CreatedAt: now}
		if a.Role == domain.RoleMahasiswa {
			u.NIM, u.Campus, u.Semester, u.IPK = fx.Mahasiswa.NIM, fx.Mahasiswa.Kampus, fx.Mahasiswa.Semester, fx.Mahasiswa.IPK
		}
		if _, err := s.CreateUser(ctx, u); err != nil {
			return fmt.Errorf("seed akun demo %s: %w", a.Role, err)
		}
	}

	for i, l := range fx.Lowongan {
		v := domain.Vacancy{
			ID: l.ID, Title: l.Posisi, Company: l.Perusahaan, Position: "Software Developer", Location: l.Lokasi, Type: l.Tipe,
			Required: l.Tags, Preferred: []string{}, Prescreen: domain.DefaultPrescreen, Interview: domain.DefaultInterview,
			CreatedBy: "u-demo-hrd", CreatedAt: now, Deadline: now.AddDate(0, 0, 10+3*i),
		}
		if b, ok := bidangDemo[l.ID]; ok {
			v.Position = b
		}
		if l.Deadline == "Ditutup" {
			v.Deadline = now.AddDate(0, 0, -7)
		}
		if l.ID == fx.LowonganHRD.ID {
			v.Required, v.Preferred = fx.LowonganHRD.Wajib, fx.LowonganHRD.Plus
			v.Prescreen, v.Interview = fx.PrescreenTanya, fx.InterviewTanya
		}
		if err := s.CreateVacancy(ctx, v); err != nil {
			return fmt.Errorf("seed lowongan %s: %w", l.ID, err)
		}
	}

	kandidat := fx.Kandidat
	var ti []seedKandidat
	for _, k := range kandidat {
		if k.Prodi == prodi {
			ti = append(ti, k)
		}
	}
	for i, nama := range namaTambahan {
		k := ti[i%len(ti)]
		k.ID, k.Nama, k.Peringatan, k.Keputusan = fmt.Sprintf("tambahan-%d", i+1), nama, "", "Belum diputuskan"
		kandidat = append(kandidat, k)
	}
	for _, k := range kandidat {
		if err := seedKandidatRow(ctx, s, fx, k, now); err != nil {
			return fmt.Errorf("seed kandidat %s: %w", k.ID, err)
		}
	}

	for _, c := range fx.Catatan {
		n := domain.FollowUpNote{ID: usecase.NewID("cat-"), ProdiID: prodi, Kompetensi: c.Kompetensi, Matkul: c.Matkul, Aksi: c.Aksi, Oleh: byRole[domain.RoleProdi].Nama, Status: c.Status, CreatedAt: now.AddDate(0, -1, 0)}
		if err := s.CreateNote(ctx, n); err != nil {
			return err
		}
	}

	// Seed bukti klaim sertifikasi mahasiswa demo
	demoClaims := []domain.ClaimEvidence{
		{
			ID:                "claim-demo-1",
			ApplicationID:     "lam-k1",
			StudentID:         "u-demo-mahasiswa",
			ClaimType:         "sertifikasi",
			Title:             "AWS Certified Cloud Practitioner",
			Issuer:            "Amazon Web Services",
			Year:              "2023",
			Context:           "Memiliki sertifikasi AWS Cloud Practitioner untuk arsitektur cloud dasar dan manajemen IAM.",
			FileKey:           "demo-aws-cert.pdf",
			FileName:          "AWS_Cloud_Practitioner_Certificate.pdf",
			Status:            domain.ClaimVerified,
			MatchConfidence:   0.94,
			VerificationNotes: "Kredensial AWS tervalidasi via digital credential verification. Nama dan tahun sesuai dengan CV.",
			CreatedAt:         now,
			UpdatedAt:         now,
		},
		{
			ID:                "claim-demo-2",
			ApplicationID:     "lam-k1",
			StudentID:         "u-demo-mahasiswa",
			ClaimType:         "sertifikasi",
			Title:             "Sertifikasi Kompetensi BNSP Junior Web Developer",
			Issuer:            "Badan Nasional Sertifikasi Profesi (BNSP)",
			Year:              "2024",
			Context:           "Lulus uji kompetensi okupasi Junior Web Developer LSP Teknologi Informasi.",
			FileKey:           "demo-bnsp-cert.pdf",
			FileName:          "Sertifikat_Kompetensi_BNSP_Web.pdf",
			Status:            domain.ClaimVerified,
			MatchConfidence:   0.98,
			VerificationNotes: "Nomor registrasi MET.000.004928 2024 terverifikasi cocok dengan data profil vokasi.",
			CreatedAt:         now,
			UpdatedAt:         now,
		},
		{
			ID:                "claim-demo-3",
			ApplicationID:     "lam-k1",
			StudentID:         "u-demo-mahasiswa",
			ClaimType:         "sertifikasi",
			Title:             "Oracle Certified Associate, Java SE 8 Programmer",
			Issuer:            "Oracle University",
			Year:              "2023",
			Context:           "Sertifikasi pemrograman Java standar industri untuk logika berorientasi objek.",
			FileKey:           "demo-oracle-cert.jpg",
			FileName:          "Oracle_Associate_Java.jpg",
			Status:            domain.ClaimNeedsManualReview,
			MatchConfidence:   0.72,
			VerificationNotes: "Format gambar scan miring, nama terkonfirmasi tapi nomor lisensi butuh konfirmasi manual admin prodi.",
			CreatedAt:         now,
			UpdatedAt:         now,
		},
		{
			ID:                "claim-demo-4",
			ApplicationID:     "lam-k1",
			StudentID:         "u-demo-mahasiswa",
			ClaimType:         "sertifikasi",
			Title:             "Docker Certified Associate (DCA)",
			Issuer:            "Docker Inc.",
			Year:              "2024",
			Context:           "Spesialisasi containerization multi-stage dan deployment Docker Swarm.",
			FileKey:           "",
			FileName:          "",
			Status:            domain.ClaimPendingUpload,
			MatchConfidence:   0.0,
			VerificationNotes: "Tercantum di ringkasan CV, menunggu mahasiswa mengunggah dokumen bukti sertifikat.",
			CreatedAt:         now,
			UpdatedAt:         now,
		},
	}
	_ = s.SaveClaims(ctx, demoClaims)

	return nil
}

func seedKandidatRow(ctx context.Context, s *Store, fx seedFixture, k seedKandidat, now time.Time) error {
	semester := max(1, (domain.TahunAjaranMulai(now)-k.Angkatan)*2+1)
	u := domain.User{ID: "u-" + k.ID, Email: k.ID + "@kandidat.invalid", PasswordHash: lockedPassword, Role: domain.RoleMahasiswa,
		Name: k.Nama, Institution: k.Prodi, Campus: fx.Mahasiswa.Kampus, Semester: semester, IPK: k.IPK, CreatedAt: now}
	if _, err := s.CreateUser(ctx, u); err != nil {
		return err
	}
	a := domain.Application{ID: "lam-" + k.ID, VacancyID: fx.LowonganHRD.ID, StudentID: u.ID, Stage: domain.StageScored, CreatedAt: now, UpdatedAt: now}
	if _, err := s.CreateApplication(ctx, a); err != nil {
		return err
	}
	for i, j := range k.Prescreen {
		a.Prescreen = append(a.Prescreen, domain.QA{Tanya: fx.PrescreenTanya[i], Jawab: j})
	}
	a.CVText = "CV demo " + k.Nama
	if err := s.SaveApplication(ctx, a); err != nil {
		return err
	}
	for i, t := range k.Transkrip {
		menit, detik, _ := strings.Cut(t.Durasi, ":")
		m, _ := strconv.Atoi(menit)
		d, _ := strconv.Atoi(detik)
		ans := domain.Answer{Nomor: i + 1, Question: fx.InterviewTanya[i], AudioKey: "demo", Transcript: t.Jawab, Seconds: m*60 + d}
		if err := s.SaveAnswer(ctx, a.ID, ans); err != nil {
			return err
		}
	}
	ev := make([]domain.Evidence, len(k.Bukti))
	for i, b := range k.Bukti {
		ev[i] = domain.Evidence{Requirement: b.Syarat, Mandatory: b.Wajib, Status: domain.EvidenceStatus(b.Status), Quote: b.Kutipan, Source: domain.EvidenceSource(b.Sumber)}
	}
	score, err := usecase.BuildScore(a.ID, k.Dimensi, ev)
	if err != nil {
		return err
	}
	r := domain.Result{ApplicationID: a.ID, Score: score, Reason: k.Alasan, Warning: k.Peringatan, Version: "seed-demo",
		Draft: domain.Feedback{Ringkasan: k.Feedback}, ScoredAt: now}
	if err := s.SaveResult(ctx, r); err != nil {
		return err
	}
	if k.Keputusan != usecase.KeputusanBelum {
		return s.SaveDecision(ctx, a.ID, score.Category, "", k.Keputusan)
	}
	return nil
}
