package domain

import "time"

const (
	MinKandidat      = 10
	MaxUploadBytes   = 5 * 1024 * 1024
	JumlahPertanyaan = 3
)

type User struct {
	ID           string
	Email        string
	PasswordHash string
	Role         Role
	Name         string
	Institution  string
	NIM          string
	Campus       string
	Semester     int
	IPK          float64
	Summary      string
	Skills       []string
	CreatedAt    time.Time
}

type Vacancy struct {
	ID          string
	Title       string
	Company     string
	Position    string
	Location    string
	Type        string
	Description string
	Deadline    time.Time
	Required    []string
	Preferred   []string
	Prescreen   []string
	Interview   []string
	Applicants  int
	CreatedBy   string
	CreatedAt   time.Time
}

type ApplicationStage string

const (
	StageApplied      ApplicationStage = "applied"
	StageUploaded     ApplicationStage = "cv_uploaded"
	StageProfile      ApplicationStage = "profile_checked"
	StagePrescreening ApplicationStage = "prescreening_done"
	StageInterview    ApplicationStage = "interview_done"
	StageScored       ApplicationStage = "scored"
	StageDecided      ApplicationStage = "decided"
)

type Entry struct {
	Peran  string `json:"peran"`
	Tempat string `json:"tempat"`
	Waktu  string `json:"waktu"`
	Poin   string `json:"poin"`
}

type Profile struct {
	Ringkasan   string   `json:"ringkasan"`
	Skill       []string `json:"skill"`
	Pengalaman  []Entry  `json:"pengalaman"`
	Proyek      []Entry  `json:"proyek"`
	Organisasi  []Entry  `json:"organisasi"`
	Sertifikasi []string `json:"sertifikasi"`
}

type QA struct {
	Tanya string `json:"tanya"`
	Jawab string `json:"jawab"`
}

type Application struct {
	ID        string
	VacancyID string
	StudentID string
	Stage     ApplicationStage
	CVKey     string
	CVText    string
	Profile   Profile
	Prescreen []QA
	CreatedAt time.Time
	UpdatedAt time.Time
}

type Answer struct {
	Nomor      int
	Question   string
	AudioKey   string
	Transcript string
	Seconds    int
}

type DimensionScore struct {
	Name   string
	Weight int
	Score  float64
}

type CandidateScore struct {
	CandidateID      string
	Total            float64
	Category         Category
	MandatoryMissing bool
	Dimensions       []DimensionScore
	Evidences        []Evidence
}

type JobStatus string

const (
	JobQueued    JobStatus = "queued"
	JobRunning   JobStatus = "running"
	JobSucceeded JobStatus = "succeeded"
	JobFailed    JobStatus = "failed"
)

type Job struct {
	ID             string
	Kind           string
	RefID          string
	IdempotencyKey string
	Status         JobStatus
	Attempts       int
	Error          string
	CreatedAt      time.Time
}

type Area struct {
	Kompetensi string `json:"kompetensi"`
	Kenapa     string `json:"kenapa"`
	Saran      string `json:"saran"`
	Matkul     string `json:"matkul"`
}

type Feedback struct {
	Ringkasan string   `json:"ringkasan"`
	Kekuatan  []string `json:"kekuatan"`
	Area      []Area   `json:"area"`
	Penutup   string   `json:"penutup"`
}

type Result struct {
	ApplicationID string
	Score         CandidateScore
	Reason        string
	// Warning teks persis yang menyerupai instruksi ke AI, ditandai untuk HRD.
	Warning          string
	Version          string
	Draft            Feedback
	HRCategory       Category
	CorrectionReason string
	Decision         string
	Feedback         *Feedback
	FeedbackBy       string
	FeedbackAt       time.Time
	ScoredAt         time.Time
}

type FollowUpNote struct {
	ID         string
	ProdiID    string
	Kompetensi string
	Matkul     string
	Aksi       string
	Oleh       string
	Status     string
	CreatedAt  time.Time
}

type ClaimStatus string

const (
	ClaimPendingUpload      ClaimStatus = "pending_upload"
	ClaimVerifying          ClaimStatus = "verifying"
	ClaimVerified           ClaimStatus = "verified"
	ClaimNeedsManualReview  ClaimStatus = "needs_manual_review"
	ClaimRejected           ClaimStatus = "rejected"
)

// ClaimEvidence adalah berkas bukti verifikasi untuk klaim sertifikasi/kompetensi yang tercantum di CV.
type ClaimEvidence struct {
	ID                string      `json:"id"`
	ApplicationID     string      `json:"application_id"`
	StudentID         string      `json:"student_id"`
	ClaimType         string      `json:"claim_type"` // e.g. "sertifikasi", "proyek", "penghargaan"
	Title             string      `json:"title"`      // Nama sertifikat atau klaim
	Issuer            string      `json:"issuer,omitempty"`
	Year              string      `json:"year,omitempty"`
	Context           string      `json:"context,omitempty"` // Kutipan CV
	FileKey           string      `json:"file_key,omitempty"`
	FileName          string      `json:"file_name,omitempty"`
	Status            ClaimStatus `json:"status"`
	MatchConfidence   float64     `json:"match_confidence"` // 0.0 - 1.0
	VerificationNotes string      `json:"verification_notes,omitempty"`
	CreatedAt         time.Time   `json:"created_at"`
	UpdatedAt         time.Time   `json:"updated_at"`
}

