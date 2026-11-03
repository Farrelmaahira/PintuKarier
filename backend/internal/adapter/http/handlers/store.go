package handlers

import (
	"encoding/json"
	"errors"
	"log/slog"
	"net/http"
	"strings"
	"time"
	"unicode"

	"pintukarier-backend/internal/domain"
	"pintukarier-backend/internal/usecase"
)

// Deps dependensi handler. Store dan Files lewat port usecase supaya adapter bisa diganti.
type Deps struct {
	Secret string
	Store  usecase.Store
	Files  usecase.FileStore
	// PublicURL alamat backend yang dibuka browser, dipakai untuk link upload bertanda tangan.
	PublicURL string
	// WebOrigin origin frontend (dipisah koma) yang boleh PUT file lintas origin.
	WebOrigin string
}

const maxJSONBody = 1 << 20

// decode baca body JSON dengan batas ukuran; false berarti respons error sudah ditulis.
func decode(w http.ResponseWriter, r *http.Request, v any) bool {
	if err := json.NewDecoder(http.MaxBytesReader(w, r.Body, maxJSONBody)).Decode(v); err != nil {
		WriteError(w, http.StatusBadRequest, "body tidak valid")
		return false
	}
	return true
}

// fail petakan error store ke status HTTP tanpa membocorkan detail internal.
func fail(w http.ResponseWriter, err error, what string) {
	switch {
	case errors.Is(err, usecase.ErrNotFound):
		WriteError(w, http.StatusNotFound, what+" tidak ditemukan")
	case errors.Is(err, usecase.ErrConflict):
		WriteError(w, http.StatusConflict, what+" sudah ada")
	default:
		slog.Error("request gagal", "what", what, "err", err)
		WriteError(w, http.StatusInternalServerError, "terjadi kesalahan, coba lagi sebentar")
	}
}

func forbidden(w http.ResponseWriter) {
	WriteError(w, http.StatusForbidden, "akses ditolak untuk role ini")
}

// ownedApp lamaran milik mahasiswa pemanggil (admin boleh semua).
func ownedApp(w http.ResponseWriter, r *http.Request, d *Deps) (domain.Application, bool) {
	a, err := d.Store.Application(r.Context(), r.PathValue("id"))
	if err != nil {
		fail(w, err, "lamaran")
		return a, false
	}
	uid, role := ClaimsFromContext(r.Context())
	if role != domain.RoleAdmin && a.StudentID != uid {
		forbidden(w)
		return a, false
	}
	return a, true
}

// ownedVacancy lowongan milik HRD pemanggil (admin boleh semua).
func ownedVacancy(w http.ResponseWriter, r *http.Request, d *Deps, id string) (domain.Vacancy, bool) {
	v, err := d.Store.Vacancy(r.Context(), id)
	if err != nil {
		fail(w, err, "lowongan")
		return v, false
	}
	uid, role := ClaimsFromContext(r.Context())
	if role != domain.RoleAdmin && v.CreatedBy != uid {
		forbidden(w)
		return v, false
	}
	return v, true
}

// ownedCandidate lamaran yang masuk ke lowongan milik HRD pemanggil.
func ownedCandidate(w http.ResponseWriter, r *http.Request, d *Deps) (domain.Application, domain.Vacancy, bool) {
	a, err := d.Store.Application(r.Context(), r.PathValue("id"))
	if err != nil {
		fail(w, err, "kandidat")
		return a, domain.Vacancy{}, false
	}
	v, ok := ownedVacancy(w, r, d, a.VacancyID)
	return a, v, ok
}

// Slug id URL prodi dari namanya, mis. "D4 Teknik Informatika" jadi "d4-teknik-informatika".
func Slug(s string) string {
	var b strings.Builder
	dash := false
	for _, c := range strings.ToLower(strings.TrimSpace(s)) {
		if unicode.IsLetter(c) || unicode.IsDigit(c) {
			b.WriteRune(c)
			dash = false
		} else if !dash && b.Len() > 0 {
			b.WriteByte('-')
			dash = true
		}
	}
	return strings.TrimSuffix(b.String(), "-")
}

// ownedProdi nama prodi pemanggil bila {id} cocok dengan prodinya.
func ownedProdi(w http.ResponseWriter, r *http.Request, d *Deps) (string, bool) {
	uid, _ := ClaimsFromContext(r.Context())
	u, err := d.Store.UserByID(r.Context(), uid)
	if err != nil {
		fail(w, err, "akun")
		return "", false
	}
	if Slug(u.Institution) != r.PathValue("id") {
		forbidden(w)
		return "", false
	}
	return u.Institution, true
}

var stageOrder = map[domain.ApplicationStage]int{
	domain.StageApplied: 0, domain.StageUploaded: 1, domain.StageProfile: 2, domain.StagePrescreening: 3,
	domain.StageInterview: 4, domain.StageScored: 5, domain.StageDecided: 6,
}

// before true bila lamaran belum mencapai tahap s.
func before(a domain.Application, s domain.ApplicationStage) bool {
	return stageOrder[a.Stage] < stageOrder[s]
}

// advance naikkan tahap, tidak pernah mundur.
func advance(a *domain.Application, s domain.ApplicationStage) {
	if before(*a, s) {
		a.Stage = s
	}
	a.UpdatedAt = time.Now()
}

func jobResponse(j domain.Job) JobResponse {
	return JobResponse{ID: j.ID, Kind: j.Kind, RefID: j.RefID, Status: string(j.Status), Error: j.Error}
}
