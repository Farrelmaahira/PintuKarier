package postgres

import (
	"context"
	"errors"
	"os"
	"testing"
	"time"

	"pintukarier-backend/internal/domain"
	"pintukarier-backend/internal/usecase"
)

// testStore database sementara per tes; butuh PINTUKARIER_TEST_DATABASE_URL ke server Postgres.
func testStore(t *testing.T) *Store {
	t.Helper()
	base := os.Getenv("PINTUKARIER_TEST_DATABASE_URL")
	if base == "" {
		t.Skip("PINTUKARIER_TEST_DATABASE_URL tidak di-set")
	}
	s, drop, err := OpenTemp(context.Background(), base)
	if err != nil {
		t.Fatal(err)
	}
	t.Cleanup(drop)
	return s
}

func TestStoreFlow(t *testing.T) {
	s := testStore(t)
	ctx := context.Background()
	now := time.Now()

	hr := domain.User{ID: usecase.NewID("u-"), Email: usecase.NewID("hr") + "@t.id", PasswordHash: "x", Role: domain.RoleHRD, Name: "HR", Institution: "PT Uji", CreatedAt: now}
	if _, err := s.CreateUser(ctx, hr); err != nil {
		t.Fatal(err)
	}
	if _, err := s.CreateUser(ctx, hr); !errors.Is(err, usecase.ErrConflict) {
		t.Fatalf("duplicate email err = %v, want ErrConflict", err)
	}
	mhs := domain.User{ID: usecase.NewID("u-"), Email: usecase.NewID("m") + "@t.id", PasswordHash: "x", Role: domain.RoleMahasiswa, Name: "Mhs", Institution: "Prodi Uji " + hr.ID, Semester: 7, CreatedAt: now}
	if _, err := s.CreateUser(ctx, mhs); err != nil {
		t.Fatal(err)
	}

	v, _ := usecase.CreateVacancy(domain.Vacancy{Title: "FE Intern", Company: "PT Uji", Position: "Software Developer", Type: "Magang", CreatedBy: hr.ID, Required: []string{"React"}, Deadline: now.AddDate(0, 0, 7)})
	if err := s.CreateVacancy(ctx, v); err != nil {
		t.Fatal(err)
	}

	a, _ := usecase.Apply(v.ID, mhs.ID)
	a, err := s.CreateApplication(ctx, a)
	if err != nil {
		t.Fatal(err)
	}
	again, _ := usecase.Apply(v.ID, mhs.ID)
	if again, _ = s.CreateApplication(ctx, again); again.ID != a.ID {
		t.Fatalf("apply twice made new lamaran %s != %s", again.ID, a.ID)
	}
	if got, _ := s.Vacancy(ctx, v.ID); got.Applicants != 1 || len(got.Prescreen) != 3 {
		t.Fatalf("vacancy = %+v", got)
	}

	a.Stage, a.Prescreen = domain.StageInterview, []domain.QA{{Tanya: "q", Jawab: "a"}}
	if err := s.SaveApplication(ctx, a); err != nil {
		t.Fatal(err)
	}
	if err := s.SaveAnswer(ctx, a.ID, domain.Answer{Nomor: 1, Question: "q1", AudioKey: "k", Seconds: 30}); err != nil {
		t.Fatal(err)
	}
	if ids, _ := s.PendingScoring(ctx, v.ID); len(ids) != 1 || ids[0] != a.ID {
		t.Fatalf("pending = %v", ids)
	}

	score, _ := usecase.BuildScore(a.ID, [5]float64{80, 80, 80, 80, 80}, []domain.Evidence{
		{Requirement: "React", Mandatory: true, Status: domain.EvidenceTidakDitemukan},
	})
	if err := s.SaveResult(ctx, domain.Result{ApplicationID: a.ID, Score: score, Reason: "r", Draft: domain.Feedback{Ringkasan: "draf"}, ScoredAt: now}); err != nil {
		t.Fatal(err)
	}
	if err := s.SaveDecision(ctx, a.ID, domain.CategoryPengembangan, "alasan", usecase.KeputusanTidak); err != nil {
		t.Fatal(err)
	}
	r, err := s.Result(ctx, a.ID)
	if err != nil || r.Score.Total != 80 || r.Score.Category != domain.CategoryTidakMemenuhi || r.Draft.Ringkasan != "draf" || r.Feedback != nil || len(r.Score.Dimensions) != 5 {
		t.Fatalf("result = %+v err %v", r, err)
	}

	if err := s.SaveFeedback(ctx, a.ID, domain.Feedback{Ringkasan: "kirim"}, hr.ID); err != nil {
		t.Fatal(err)
	}
	fb, _ := s.FeedbackFor(ctx, mhs.ID)
	if len(fb) != 1 || fb[0].Result.Feedback == nil || fb[0].Result.Feedback.Ringkasan != "kirim" || fb[0].App.Stage != domain.StageDecided {
		t.Fatalf("feedback = %+v", fb)
	}
	cands, _ := s.Candidates(ctx, v.ID)
	if len(cands) != 1 || cands[0].Student.Name != "Mhs" || cands[0].Student.PasswordHash != "" || cands[0].Result.HRCategory != domain.CategoryPengembangan {
		t.Fatalf("candidates = %+v", cands)
	}
	rows, _ := s.RankRows(ctx, " prodi uji "+hr.ID)
	if len(rows) != 1 || rows[0].Position != "Software Developer" || rows[0].Evidences[0].Requirement != "React" {
		t.Fatalf("rank rows = %+v", rows)
	}
}

func TestStoreJobs(t *testing.T) {
	s := testStore(t)
	ctx := context.Background()
	key := usecase.NewID("k-")
	j1, err := s.Enqueue(ctx, key, usecase.KindQuestions, "ref")
	if err != nil {
		t.Fatal(err)
	}
	if j2, _ := s.Enqueue(ctx, key, usecase.KindQuestions, "ref"); j2.ID != j1.ID {
		t.Fatal("enqueue must be idempotent per key")
	}
	// Ambil sampai ketemu job ini; job lain dari tes sebelumnya ditutup.
	for {
		j, ok, err := s.ClaimJob(ctx)
		if err != nil || !ok {
			t.Fatalf("claim ok=%v err=%v", ok, err)
		}
		if j.ID == j1.ID {
			if j.Attempts != 1 || j.Status != domain.JobRunning {
				t.Fatalf("claimed = %+v", j)
			}
			break
		}
		_ = s.FinishJob(ctx, j.ID, nil, 0)
	}
	if err := s.FinishJob(ctx, j1.ID, errors.New("sementara"), time.Hour); err != nil {
		t.Fatal(err)
	}
	if j, _ := s.Job(ctx, j1.ID); j.Status != domain.JobQueued || j.Error != "sementara" {
		t.Fatalf("retry job = %+v", j)
	}
	_ = s.FinishJob(ctx, j1.ID, errors.New("permanen"), 0)
	if j, _ := s.Job(ctx, j1.ID); j.Status != domain.JobFailed {
		t.Fatalf("failed job = %+v", j)
	}
}

func TestDemoAccountsFromEnvRequiresAll(t *testing.T) {
	env := map[string]string{"DEMO_MAHASISWA_EMAIL": "m@x.id", "DEMO_MAHASISWA_PASSWORD": "rahasia123", "DEMO_MAHASISWA_NAMA": "M"}
	if _, err := DemoAccountsFromEnv(func(k string) string { return env[k] }); err == nil {
		t.Fatal("akun hrd dan prodi kosong harus ditolak")
	}
	for _, r := range []string{"HRD", "PRODI"} {
		env["DEMO_"+r+"_EMAIL"], env["DEMO_"+r+"_PASSWORD"], env["DEMO_"+r+"_NAMA"] = r+"@x.id", "rahasia123", r
	}
	if acc, err := DemoAccountsFromEnv(func(k string) string { return env[k] }); err != nil || len(acc) != 3 {
		t.Fatalf("acc %+v err %v", acc, err)
	}
}

func TestSeedDemo(t *testing.T) {
	s := testStore(t)
	ctx := context.Background()
	suffix := usecase.NewID("")
	acc := []DemoAccount{
		{domain.RoleMahasiswa, "m" + suffix + "@x.id", "rahasia123", "Mhs Demo"},
		{domain.RoleHRD, "h" + suffix + "@x.id", "rahasia123", "HR Demo"},
		{domain.RoleProdi, "p" + suffix + "@x.id", "rahasia123", "Prodi Demo"},
	}
	if err := SeedDemo(ctx, s, acc); err != nil {
		t.Fatal(err)
	}
	if err := SeedDemo(ctx, s, acc); err != nil {
		t.Fatalf("seed kedua harus no-op: %v", err)
	}
	hr, err := s.UserByEmail(ctx, acc[1].Email)
	if err != nil || !usecase.CheckPassword(hr.PasswordHash, "rahasia123") {
		t.Fatalf("akun demo hrd: %+v %v", hr, err)
	}
	k, err := s.UserByEmail(ctx, "nadia-putri@kandidat.invalid")
	if err != nil || usecase.CheckPassword(k.PasswordHash, "rahasia123") || usecase.CheckPassword(k.PasswordHash, "") {
		t.Fatal("kandidat fiktif tidak boleh bisa login")
	}
	prodi, _ := s.UserByEmail(ctx, acc[2].Email)
	rows, _ := s.RankRows(ctx, prodi.Institution)
	ranking := usecase.FilterRanking(usecase.AggregateRanking(rows))
	if sd := ranking[domain.Periode(time.Now())]["Software Developer"]; sd.N < domain.MinKandidat || len(sd.Items) == 0 {
		t.Fatalf("grup demo harus terlihat di dasbor prodi: %+v", ranking)
	}
}

func TestStoreBenchmark(t *testing.T) {
	s := testStore(t)
	ctx := context.Background()
	rows, at, err := s.LatestBenchmark(ctx)
	if err != nil || rows == nil || len(rows) != 0 || !at.IsZero() {
		t.Fatalf("sebelum diukur: rows=%v at=%v err=%v, want daftar kosong non-nil dan waktu nol", rows, at, err)
	}
	detik := 3.7
	if err := s.SaveBenchmark(ctx, []usecase.ModelBenchmark{{Fitur: "Ekstraksi CV", Nama: "Groq", Detik: &detik}, {Fitur: "Ekstraksi CV", Nama: "Gemini"}}); err != nil {
		t.Fatal(err)
	}
	if err := s.SaveBenchmark(ctx, []usecase.ModelBenchmark{{Fitur: "Draft feedback", Nama: "Manual", Detik: &detik}}); err != nil {
		t.Fatal(err)
	}
	rows, at, err = s.LatestBenchmark(ctx)
	if err != nil || len(rows) != 1 || rows[0].Fitur != "Draft feedback" || rows[0].Detik == nil || *rows[0].Detik != 3.7 || time.Since(at) > time.Minute {
		t.Fatalf("setelah ditimpa: rows=%+v at=%v err=%v", rows, at, err)
	}
}
