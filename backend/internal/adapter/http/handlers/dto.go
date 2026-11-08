package handlers

import (
	"encoding/json"
	"net/http"

	"pintukarier-backend/internal/domain"
)

// Key JSON di file ini dipakai frontend lewat kamus terjemahan di frontend/lib/apiKeys.ts.
// Menambah key baru berarti menambahkannya juga ke kamus itu, kalau tidak nama field di frontend tetap Indonesia.

// ErrorResponse amplop error konsisten.
type ErrorResponse struct {
	Error string `json:"error"`
}

func WriteJSON(w http.ResponseWriter, code int, v any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	_ = json.NewEncoder(w).Encode(v)
}

func WriteError(w http.ResponseWriter, code int, msg string) {
	WriteJSON(w, code, ErrorResponse{Error: msg})
}

// Auth
type RegisterRequest struct {
	Nama     string `json:"nama"`
	Email    string `json:"email"`
	Password string `json:"password"`
	Peran    string `json:"peran"`
	Instansi string `json:"instansi"`
}

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type SessionResponse struct {
	Token string `json:"token"`
	Peran string `json:"peran"`
	Nama  string `json:"nama"`
	Email string `json:"email"`
}

type MeResponse struct {
	UserID   string `json:"userId"`
	Role     string `json:"role"`
	Nama     string `json:"nama"`
	Email    string `json:"email"`
	Instansi string `json:"instansi"`
	ProdiID  string `json:"prodiId,omitempty"`
}

// ProfilMahasiswa cermin StudentProfileData di frontend/lib/hooks/useStudentProfile.ts plus skill.
type ProfilMahasiswa struct {
	Nama      string   `json:"nama"`
	NIM       string   `json:"nim"`
	Prodi     string   `json:"prodi"`
	Kampus    string   `json:"kampus"`
	Semester  int      `json:"semester"`
	IPK       float64  `json:"ipk"`
	Ringkasan string   `json:"ringkasan"`
	Skill     []string `json:"skill"`
}

// Lowongan cermin Vacancy di frontend/lib/data/student.ts plus field HRD.
type LowonganRequest struct {
	Posisi    string   `json:"posisi"`
	Bidang    string   `json:"bidang"`
	Lokasi    string   `json:"lokasi"`
	Tipe      string   `json:"tipe"`
	Deadline  string   `json:"deadline"`
	Deskripsi string   `json:"deskripsi"`
	Wajib     []string `json:"wajib"`
	Plus      []string `json:"plus"`
}

type LowonganResponse struct {
	ID             string   `json:"id"`
	Posisi         string   `json:"posisi"`
	Perusahaan     string   `json:"perusahaan"`
	Bidang         string   `json:"bidang"`
	Lokasi         string   `json:"lokasi"`
	Tipe           string   `json:"tipe"`
	Deadline       string   `json:"deadline"`
	Ditutup        bool     `json:"ditutup"`
	Pelamar        int      `json:"pelamar"`
	Tags           []string `json:"tags"`
	Deskripsi      string   `json:"deskripsi"`
	Wajib          []string `json:"wajib"`
	Plus           []string `json:"plus"`
	PrescreenTanya []string `json:"prescreenTanya"`
	InterviewTanya []string `json:"interviewTanya"`
}

type JobResponse struct {
	ID     string `json:"id"`
	Kind   string `json:"kind"`
	RefID  string `json:"refId"`
	Status string `json:"status"`
	Error  string `json:"error,omitempty"`
}

// Lamaran cermin Application di frontend/lib/data/student.ts plus id dan kode tahap untuk melanjutkan alur.
type LamaranResponse struct {
	ID        string `json:"id"`
	Lowongan  string `json:"lowongan"`
	Tahap     int    `json:"tahap"`
	Status    string `json:"status"`
	Update    string `json:"update"`
	Catatan   string `json:"catatan"`
	TahapKode string `json:"tahapKode"`
}

type ApplyRequest struct {
	LowonganID string `json:"lowonganId"`
}

type UploadRequest struct {
	Nama   string `json:"nama"`
	Ukuran int64  `json:"ukuran"`
}

type UploadURLResponse struct {
	UploadURL string `json:"uploadUrl"`
	Key       string `json:"key"`
}

type UploadDoneRequest struct {
	Key    string `json:"key"`
	Durasi int    `json:"durasi"`
}

type PrescreeningRequest struct {
	Jawaban []string `json:"jawaban"`
}

// Kandidat cermin frontend/lib/data/candidate.ts.
type BuktiDTO struct {
	Syarat  string `json:"syarat"`
	Wajib   bool   `json:"wajib"`
	Status  string `json:"status"`
	Kutipan string `json:"kutipan,omitempty"`
	Sumber  string `json:"sumber,omitempty"`
}

type TranskripDTO struct {
	Jawab       string `json:"jawab"`
	Durasi      string `json:"durasi"`
	AudioURL    string `json:"audioUrl,omitempty"`
	SnapshotURL string `json:"snapshotUrl,omitempty"`
}

type KandidatResponse struct {
	ID               string         `json:"id"`
	Lowongan         string         `json:"lowongan"`
	Posisi           string         `json:"posisi"`
	Nama             string         `json:"nama"`
	Prodi            string         `json:"prodi"`
	Kampus           string         `json:"kampus"`
	Angkatan         int            `json:"angkatan"`
	IPK              float64        `json:"ipk"`
	Dilamar          string         `json:"dilamar"`
	Dimensi          [5]float64     `json:"dimensi"`
	Kategori         string         `json:"kategori"`
	KategoriAI       string         `json:"kategoriAi"`
	Alasan           string         `json:"alasan"`
	AlasanKoreksi    string         `json:"alasanKoreksi,omitempty"`
	Bukti            []BuktiDTO     `json:"bukti"`
	Prescreen        []string       `json:"prescreen"`
	PrescreenTanya   []string       `json:"prescreenTanya"`
	Transkrip        []TranskripDTO `json:"transkrip"`
	InterviewTanya   []string       `json:"interviewTanya"`
	Peringatan       string         `json:"peringatan,omitempty"`
	Keputusan        string         `json:"keputusan"`
	Feedback         string         `json:"feedback"`
	FeedbackTerkirim bool           `json:"feedbackTerkirim"`
	ProdiVerified    bool           `json:"prodiVerified"`
	CVURL            string         `json:"cvUrl,omitempty"`
	CVKey            string         `json:"cvKey,omitempty"`
}

type KeputusanRequest struct {
	Kategori  string `json:"kategori"`
	Alasan    string `json:"alasan"`
	Keputusan string `json:"keputusan"`
}

type FeedbackRequest struct {
	Isi      string `json:"isi"`
	Reviewed bool   `json:"reviewed"`
}

// FeedbackData cermin FeedbackData di frontend/lib/data/student.ts.
type FeedbackData struct {
	ID         string        `json:"id"`
	Lowongan   string        `json:"lowongan"`
	Perusahaan string        `json:"perusahaan"`
	Posisi     string        `json:"posisi"`
	Dari       string        `json:"dari"`
	Tanggal    string        `json:"tanggal"`
	Kategori   string        `json:"kategori"`
	Dimensi    [5]float64    `json:"dimensi"`
	Ringkasan  string        `json:"ringkasan"`
	Kekuatan   []string      `json:"kekuatan"`
	Area       []domain.Area `json:"area"`
	Penutup    string        `json:"penutup"`
}

// Ranking cermin Ranking di frontend/lib/data/studyProgram/types.ts: items berupa [kompetensi, persen].
type RankingResponse struct {
	N     int     `json:"n"`
	Items [][]any `json:"items"`
}

type CatatanRequest struct {
	Kompetensi string `json:"kompetensi"`
	Matkul     string `json:"matkul"`
	Aksi       string `json:"aksi"`
}

// Catatan cermin FollowUpNote di frontend/lib/data/studyProgram/types.ts.
type CatatanResponse struct {
	ID         string `json:"id"`
	Kompetensi string `json:"kompetensi"`
	Matkul     string `json:"matkul"`
	Aksi       string `json:"aksi"`
	Oleh       string `json:"oleh"`
	Tanggal    string `json:"tanggal"`
	Status     string `json:"status"`
}

type ProdiVerifyClaimRequest struct {
	Verified bool   `json:"verified"`
	Notes    string `json:"notes"`
}
