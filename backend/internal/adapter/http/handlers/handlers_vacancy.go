package handlers

import (
	"crypto/sha256"
	"encoding/hex"
	"net/http"
	"strings"
	"time"

	"pintukarier-backend/internal/domain"
	"pintukarier-backend/internal/usecase"
)

func lowonganOf(v domain.Vacancy, now time.Time) LowonganResponse {
	tags := append(append([]string{}, v.Required...), v.Preferred...)
	if len(tags) > 3 {
		tags = tags[:3]
	}
	out := LowonganResponse{
		ID: v.ID, Posisi: v.Title, Perusahaan: v.Company, Bidang: v.Position, Lokasi: v.Location, Tipe: v.Type,
		Pelamar: v.Applicants, Tags: tags, Deskripsi: v.Description, Wajib: v.Required, Plus: v.Preferred,
		PrescreenTanya: v.Prescreen, InterviewTanya: v.Interview,
	}
	if !v.Deadline.IsZero() {
		out.Deadline = v.Deadline.Format(time.DateOnly)
		out.Ditutup = now.After(v.Deadline.AddDate(0, 0, 1))
	}
	return out
}

// HandleVacancyList HRD hanya melihat lowongannya sendiri; peran lain melihat semua.
func HandleVacancyList(d *Deps) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		uid, role := ClaimsFromContext(r.Context())
		owner := ""
		if role == domain.RoleHRD {
			owner = uid
		}
		list, err := d.Store.ListVacancies(r.Context(), owner)
		if err != nil {
			fail(w, err, "lowongan")
			return
		}
		now := time.Now()
		out := make([]LowonganResponse, len(list))
		for i, v := range list {
			out[i] = lowonganOf(v, now)
		}
		WriteJSON(w, http.StatusOK, out)
	}
}

func HandleVacancyCreate(d *Deps) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req LowonganRequest
		if !decode(w, r, &req) {
			return
		}
		uid, _ := ClaimsFromContext(r.Context())
		hr, err := d.Store.UserByID(r.Context(), uid)
		if err != nil {
			fail(w, err, "akun")
			return
		}
		v := domain.Vacancy{
			Title: req.Posisi, Company: hr.Institution, Position: req.Bidang, Location: strings.TrimSpace(req.Lokasi),
			Type: req.Tipe, Description: strings.TrimSpace(req.Deskripsi), Required: req.Wajib, Preferred: req.Plus, CreatedBy: uid,
		}
		if req.Deadline != "" {
			if v.Deadline, err = time.Parse(time.DateOnly, req.Deadline); err != nil {
				WriteError(w, http.StatusBadRequest, "deadline harus format YYYY-MM-DD")
				return
			}
		}
		if v, err = usecase.CreateVacancy(v); err != nil {
			WriteError(w, http.StatusBadRequest, err.Error())
			return
		}
		if err := d.Store.CreateVacancy(r.Context(), v); err != nil {
			fail(w, err, "lowongan")
			return
		}
		// Pertanyaan per lowongan dibuat AI di background; sementara pakai cadangan.
		if _, err := d.Store.Enqueue(r.Context(), "questions:"+v.ID, usecase.KindQuestions, v.ID); err != nil {
			fail(w, err, "job")
			return
		}
		WriteJSON(w, http.StatusCreated, lowonganOf(v, time.Now()))
	}
}

func HandleVacancyGet(d *Deps) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		v, err := d.Store.Vacancy(r.Context(), r.PathValue("id"))
		if err != nil {
			fail(w, err, "lowongan")
			return
		}
		WriteJSON(w, http.StatusOK, lowonganOf(v, time.Now()))
	}
}

// HandleVacancyAnalisis mulai job analisis untuk lamaran yang sudah selesai interview.
// Key job dari daftar lamaran yang menunggu, jadi klik ganda tidak menilai dua kali.
func HandleVacancyAnalisis(d *Deps) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		v, ok := ownedVacancy(w, r, d, r.PathValue("id"))
		if !ok {
			return
		}
		ids, err := d.Store.PendingScoring(r.Context(), v.ID)
		if err != nil {
			fail(w, err, "lamaran")
			return
		}
		if len(ids) == 0 {
			WriteJSON(w, http.StatusOK, JobResponse{Kind: usecase.KindAnalisis, RefID: v.ID, Status: string(domain.JobSucceeded)})
			return
		}
		sum := sha256.Sum256([]byte(strings.Join(ids, ",")))
		j, err := d.Store.Enqueue(r.Context(), "analisis:"+v.ID+":"+hex.EncodeToString(sum[:8]), usecase.KindAnalisis, v.ID)
		if err != nil {
			fail(w, err, "job")
			return
		}
		WriteJSON(w, http.StatusAccepted, jobResponse(j))
	}
}

func HandleVacancyKandidat(d *Deps) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		v, ok := ownedVacancy(w, r, d, r.PathValue("id"))
		if !ok {
			return
		}
		list, err := d.Store.Candidates(r.Context(), v.ID)
		if err != nil {
			fail(w, err, "kandidat")
			return
		}
		kategori := r.URL.Query().Get("kategori")
		now := time.Now()
		out := []KandidatResponse{}
		for _, c := range list {
			k := kandidatOf(c, nil, now)
			if kategori == "" || k.Kategori == kategori {
				out = append(out, k)
			}
		}
		WriteJSON(w, http.StatusOK, out)
	}
}
