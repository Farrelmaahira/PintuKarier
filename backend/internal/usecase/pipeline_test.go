package usecase

import (
	"context"
	"errors"
	"slices"
	"testing"

	"pintukarier-backend/internal/domain"
)

func TestLengkapiProfil(t *testing.T) {
	u := domain.User{Name: "Raka", Institution: "D4 TI", NIM: " ", Semester: 5, Skills: []string{"react"}}
	LengkapiProfil(&u, ParsedCV{
		Profil:    domain.Profile{Ringkasan: "Fokus frontend.", Skill: []string{"React", " Git ", ""}},
		Identitas: IdentitasCV{NIM: "4.33.22", Kampus: "Polines", Semester: 7, IPK: 3.8},
	})
	if u.Name != "Raka" || u.Institution != "D4 TI" || u.Semester != 5 {
		t.Errorf("isian mahasiswa tertimpa: %+v", u)
	}
	if u.NIM != "4.33.22" || u.Campus != "Polines" || u.IPK != 3.8 || u.Summary != "Fokus frontend." {
		t.Errorf("field kosong tidak terisi: %+v", u)
	}
	if !slices.Equal(u.Skills, []string{"react", "Git"}) {
		t.Errorf("skill = %v", u.Skills)
	}
	u = domain.User{}
	LengkapiProfil(&u, ParsedCV{Identitas: IdentitasCV{Semester: 20, IPK: 87}})
	if u.Semester != 0 || u.IPK != 0 {
		t.Errorf("angka di luar rentang ikut tersimpan: %+v", u)
	}
}

// fakeStore hanya mengisi method yang dipakai pipeline; sisanya panik bila terpanggil.
type fakeStore struct {
	Store
	apps    map[string]domain.Application
	answers map[string][]domain.Answer
	results map[string]domain.Result
}

func (f *fakeStore) Application(_ context.Context, id string) (domain.Application, error) {
	return f.apps[id], nil
}
func (f *fakeStore) SaveApplication(_ context.Context, a domain.Application) error {
	f.apps[a.ID] = a
	return nil
}
func (f *fakeStore) Vacancy(context.Context, string) (domain.Vacancy, error) {
	return domain.Vacancy{ID: "low-1", Title: "QA Intern", Required: []string{"Testing otomatis"}}, nil
}
func (f *fakeStore) Answers(_ context.Context, id string) ([]domain.Answer, error) {
	return f.answers[id], nil
}
func (f *fakeStore) PendingScoring(context.Context, string) ([]string, error) {
	var ids []string
	for id, a := range f.apps {
		if a.Stage == domain.StageInterview {
			ids = append(ids, id)
		}
	}
	return ids, nil
}
func (f *fakeStore) SaveResult(_ context.Context, r domain.Result) error {
	f.results[r.ApplicationID] = r
	return nil
}

type fakeAI struct {
	AIService
	scoreCalls int
	scoreErr   error
}

func (f *fakeAI) Score(context.Context, ScoreInput) (ScoreResult, error) {
	f.scoreCalls++
	return ScoreResult{
		Dimensi: []float64{40, 60, 60, 80, 50},
		Bukti:   []AIBukti{{Syarat: "Testing otomatis", Wajib: true, Status: "Tidak ditemukan"}},
		Alasan:  "Belum ada bukti testing otomatis.",
		Versi:   "score-v1/test",
	}, f.scoreErr
}

func (f *fakeAI) DraftFeedback(context.Context, FeedbackInput) (domain.Feedback, error) {
	return domain.Feedback{Ringkasan: "draf", Area: []domain.Area{{Kompetensi: "Testing otomatis"}}}, nil
}

func newFakes() (*fakeStore, *fakeAI) {
	return &fakeStore{
			apps: map[string]domain.Application{
				"lam-1": {ID: "lam-1", VacancyID: "low-1", Stage: domain.StageInterview, CVText: "CV"},
				"lam-2": {ID: "lam-2", VacancyID: "low-1", Stage: domain.StagePrescreening},
			},
			answers: map[string][]domain.Answer{"lam-1": {{Nomor: 1, Question: "q", Transcript: "jawab"}}},
			results: map[string]domain.Result{},
		},
		&fakeAI{}
}

func TestAnalisisScoresPendingOnceAndFillsMatkul(t *testing.T) {
	store, ai := newFakes()
	p := &Pipeline{Store: store, AI: ai, Concurrency: 2}
	job := domain.Job{Kind: KindAnalisis, RefID: "low-1"}
	if err := p.Run(context.Background(), job); err != nil {
		t.Fatal(err)
	}
	r := store.results["lam-1"]
	if r.Score.Category != domain.CategoryTidakMemenuhi || r.Score.Total != 54 {
		t.Fatalf("result = %+v", r.Score)
	}
	if r.Draft.Area[0].Matkul != "Pengujian Perangkat Lunak" {
		t.Fatalf("matkul = %q", r.Draft.Area[0].Matkul)
	}
	if store.apps["lam-1"].Stage != domain.StageScored || store.apps["lam-2"].Stage != domain.StagePrescreening {
		t.Fatal("hanya lamaran interview_done yang dinilai")
	}
	// Retry tidak boleh menilai dua kali.
	_ = p.Run(context.Background(), job)
	if ai.scoreCalls != 1 {
		t.Fatalf("score dipanggil %d kali, want 1", ai.scoreCalls)
	}
}

func TestAnalisisWaitsForTranscript(t *testing.T) {
	store, ai := newFakes()
	store.answers["lam-1"][0].Transcript = ""
	p := &Pipeline{Store: store, AI: ai}
	err := p.Run(context.Background(), domain.Job{Kind: KindAnalisis, RefID: "low-1"})
	if err == nil || errors.Is(err, ErrPermanent) || ai.scoreCalls != 0 {
		t.Fatalf("err = %v, want retryable tanpa memanggil AI", err)
	}
}

func TestAnalisisPermanentErrorNotRetried(t *testing.T) {
	store, ai := newFakes()
	ai.scoreErr = ErrPermanent
	p := &Pipeline{Store: store, AI: ai}
	if err := p.Run(context.Background(), domain.Job{Kind: KindAnalisis, RefID: "low-1"}); !errors.Is(err, ErrPermanent) {
		t.Fatalf("err = %v, want ErrPermanent", err)
	}
}
