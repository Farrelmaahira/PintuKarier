package usecase

import (
	"context"
	"errors"
	"io"
	"time"

	"pintukarier-backend/internal/domain"
)

var (
	ErrNotFound = errors.New("data tidak ditemukan")
	ErrConflict = errors.New("data sudah ada")
)

// Store port persistensi. Implementasi Postgres di adapter/postgres.
type Store interface {
	CreateUser(ctx context.Context, u domain.User) (domain.User, error)
	UserByEmail(ctx context.Context, email string) (domain.User, error)
	UserByID(ctx context.Context, id string) (domain.User, error)
	UpdateStudentProfile(ctx context.Context, u domain.User) error

	CreateVacancy(ctx context.Context, v domain.Vacancy) error
	// ListVacancies createdBy kosong berarti semua lowongan.
	ListVacancies(ctx context.Context, createdBy string) ([]domain.Vacancy, error)
	Vacancy(ctx context.Context, id string) (domain.Vacancy, error)
	SetVacancyQuestions(ctx context.Context, id string, prescreen, interview []string) error

	// CreateApplication kembalikan lamaran lama bila mahasiswa sudah melamar lowongan yang sama.
	CreateApplication(ctx context.Context, a domain.Application) (domain.Application, error)
	Application(ctx context.Context, id string) (domain.Application, error)
	ListApplications(ctx context.Context, studentID string) ([]domain.Application, error)
	SaveApplication(ctx context.Context, a domain.Application) error
	SaveAnswer(ctx context.Context, applicationID string, ans domain.Answer) error
	Answers(ctx context.Context, applicationID string) ([]domain.Answer, error)
	PendingScoring(ctx context.Context, vacancyID string) ([]string, error)

	// SaveResult upsert bagian AI saja; keputusan dan feedback HRD tidak tertimpa.
	SaveResult(ctx context.Context, r domain.Result) error
	Result(ctx context.Context, applicationID string) (domain.Result, error)
	SaveDecision(ctx context.Context, applicationID string, hrCategory domain.Category, reason, decision string) error
	SaveFeedback(ctx context.Context, applicationID string, fb domain.Feedback, by string) error
	Candidates(ctx context.Context, vacancyID string) ([]Candidate, error)
	FeedbackFor(ctx context.Context, studentID string) ([]Candidate, error)
	RankRows(ctx context.Context, prodi string) ([]RankRow, error)

	AdminOverview(ctx context.Context) (domain.AdminOverview, error)
	AdminJurusan(ctx context.Context) ([]domain.AdminJurusanSummary, error)
	AdminMitra(ctx context.Context) ([]domain.AdminMitraSummary, error)

	Enqueue(ctx context.Context, key, kind, refID string) (domain.Job, error)
	Job(ctx context.Context, id string) (domain.Job, error)
	// ClaimJob ambil satu job siap jalan dan tandai running.
	ClaimJob(ctx context.Context) (domain.Job, bool, error)
	// FinishJob err nil berarti sukses; retryAfter > 0 antrekan ulang.
	FinishJob(ctx context.Context, id string, jobErr error, retryAfter time.Duration) error

	// SaveBenchmark menimpa hasil benchmark; LatestBenchmark mengembalikan daftar kosong dan waktu nol kalau belum ada.
	SaveBenchmark(ctx context.Context, rows []ModelBenchmark) error
	LatestBenchmark(ctx context.Context) ([]ModelBenchmark, time.Time, error)

	Notes(ctx context.Context, prodi string) ([]domain.FollowUpNote, error)
	CreateNote(ctx context.Context, n domain.FollowUpNote) error
}

// Candidate gabungan lamaran, mahasiswa, lowongan, dan hasil untuk layar HRD dan feedback.
type Candidate struct {
	App     domain.Application
	Student domain.User
	Vacancy domain.Vacancy
	Result  domain.Result
}

// RankRow satu kandidat untuk agregat prodi. Tidak pernah keluar dari backend.
type RankRow struct {
	CreatedAt time.Time
	Position  string
	Evidences []domain.Evidence
}

// FileStore penyimpanan CV dan rekaman. Lokal dulu, S3 nanti tanpa ubah usecase.
type FileStore interface {
	Save(ctx context.Context, name string, r io.Reader, size int64, contentType string) (string, error)
	Read(ctx context.Context, name string) ([]byte, error)
}

// AIService abstraksi AI Engine FastAPI agar provider bisa diganti.
// Satu method per job ML README 5.5. Bobot, kategori, dan agregat dihitung di Go.
type AIService interface {
	ParseCV(ctx context.Context, file []byte, filename string) (ParsedCV, error)
	Transcribe(ctx context.Context, file []byte, filename string) (Transcript, error)
	Questions(ctx context.Context, in QuestionsInput) (Questions, error)
	Score(ctx context.Context, in ScoreInput) (ScoreResult, error)
	DraftFeedback(ctx context.Context, in FeedbackInput) (domain.Feedback, error)
	Benchmark(ctx context.Context) ([]ModelBenchmark, error)
}

// ModelBenchmark waktu satu fitur untuk satu model (atau manual) dari AI Engine; Detik nil berarti gagal.
type ModelBenchmark struct {
	Fitur string   `json:"fitur"`
	Nama  string   `json:"nama"`
	Detik *float64 `json:"detik"`
}

// Tipe kontrak AI Engine. Tag JSON sama dengan model Pydantic di ai-engine/app/routers.

type ParsedCV struct {
	Profil    domain.Profile `json:"profil"`
	Identitas IdentitasCV    `json:"identitas"`
	// Teks verbatim CV, sumber kutipan saat score.
	Teks string `json:"teks"`
}

// IdentitasCV data akademik yang tertulis di CV; angka 0 berarti tidak tertulis.
// Nama dan prodi sengaja tidak diambil: prodi harus sama persis dengan akun prodi agar masuk agregat.
type IdentitasCV struct {
	NIM      string  `json:"nim"`
	Kampus   string  `json:"kampus"`
	Semester int     `json:"semester"`
	IPK      float64 `json:"ipk"`
}

type Transcript struct {
	Teks        string   `json:"teks"`
	DurasiDetik *float64 `json:"durasi_detik"`
}

type QuestionsInput struct {
	Posisi    string   `json:"posisi"`
	Deskripsi string   `json:"deskripsi"`
	Wajib     []string `json:"wajib"`
	Plus      []string `json:"plus"`
}

type Questions struct {
	Prescreen []string `json:"prescreen"`
	Interview []string `json:"interview"`
}

type ScoreInput struct {
	Posisi       string      `json:"posisi"`
	Deskripsi    string      `json:"deskripsi"`
	Wajib        []string    `json:"wajib"`
	Plus         []string    `json:"plus"`
	CVTeks       string      `json:"cv_teks"`
	Prescreening []domain.QA `json:"prescreening"`
	Interview    []domain.QA `json:"interview"`
}

// AIBukti satu syarat hasil engine. Sumber: "CV", "Pre-screening", "AI Interview".
type AIBukti struct {
	Syarat  string  `json:"syarat"`
	Wajib   bool    `json:"wajib"`
	Dasar   bool    `json:"dasar"`
	Dimensi int     `json:"dimensi"`
	Status  string  `json:"status"`
	Kutipan *string `json:"kutipan"`
	Sumber  *string `json:"sumber"`
	Alasan  string  `json:"alasan"`
}

type ScoreResult struct {
	// Dimensi skor 0-100, urutan sama dengan DIMENSI di lib/data/scoring.ts.
	Dimensi    []float64 `json:"dimensi"`
	Bukti      []AIBukti `json:"bukti"`
	Alasan     string    `json:"alasan"`
	Peringatan *string   `json:"peringatan"`
	Versi      string    `json:"versi"`
}

type FeedbackInput struct {
	Posisi   string    `json:"posisi"`
	Kategori string    `json:"kategori"`
	Alasan   string    `json:"alasan"`
	Bukti    []AIBukti `json:"bukti"`
}
