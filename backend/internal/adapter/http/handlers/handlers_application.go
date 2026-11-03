package handlers

import (
	"fmt"
	"net/http"
	"net/url"
	"path/filepath"
	"strconv"
	"strings"
	"time"

	"pintukarier-backend/internal/domain"
	"pintukarier-backend/internal/usecase"
)

func lamaranOf(a domain.Application, decision string, now time.Time) LamaranResponse {
	s := usecase.StatusLamaran(a.Stage, decision)
	return LamaranResponse{
		ID: a.ID, Lowongan: a.VacancyID, Tahap: s.Tahap, Status: s.Status, Catatan: s.Catatan,
		Update: usecase.TanggalID(a.UpdatedAt, now), TahapKode: string(a.Stage),
	}
}

// decisionOf keputusan hanya terlihat mahasiswa setelah feedback dikirim (tahap decided).
func decisionOf(r *http.Request, d *Deps, a domain.Application) string {
	if a.Stage != domain.StageDecided {
		return ""
	}
	res, err := d.Store.Result(r.Context(), a.ID)
	if err != nil {
		return ""
	}
	return res.Decision
}

func HandleApply(d *Deps) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req ApplyRequest
		if !decode(w, r, &req) {
			return
		}
		v, err := d.Store.Vacancy(r.Context(), req.LowonganID)
		if err != nil {
			fail(w, err, "lowongan")
			return
		}
		if lowonganOf(v, time.Now()).Ditutup {
			WriteError(w, http.StatusConflict, "lowongan ini sudah ditutup")
			return
		}
		uid, _ := ClaimsFromContext(r.Context())
		a, err := usecase.Apply(v.ID, uid)
		if err != nil {
			WriteError(w, http.StatusBadRequest, err.Error())
			return
		}
		if a, err = d.Store.CreateApplication(r.Context(), a); err != nil {
			fail(w, err, "lamaran")
			return
		}
		WriteJSON(w, http.StatusCreated, lamaranOf(a, decisionOf(r, d, a), time.Now()))
	}
}

func HandleMyLamaran(d *Deps) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		uid, _ := ClaimsFromContext(r.Context())
		list, err := d.Store.ListApplications(r.Context(), uid)
		if err != nil {
			fail(w, err, "lamaran")
			return
		}
		now := time.Now()
		out := make([]LamaranResponse, len(list))
		for i, a := range list {
			out[i] = lamaranOf(a, decisionOf(r, d, a), now)
		}
		WriteJSON(w, http.StatusOK, out)
	}
}

func HandleProfilGet(d *Deps) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		a, ok := ownedApp(w, r, d)
		if !ok {
			return
		}
		WriteJSON(w, http.StatusOK, a.Profile)
	}
}

// HandleProfilPut koreksi mahasiswa atas hasil ekstraksi CV.
func HandleProfilPut(d *Deps) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		a, ok := ownedApp(w, r, d)
		if !ok {
			return
		}
		if !before(a, domain.StageInterview) {
			WriteError(w, http.StatusConflict, "profil tidak bisa diubah setelah AI Interview")
			return
		}
		var p domain.Profile
		if !decode(w, r, &p) {
			return
		}
		a.Profile = p
		advance(&a, domain.StageProfile)
		if err := d.Store.SaveApplication(r.Context(), a); err != nil {
			fail(w, err, "lamaran")
			return
		}
		WriteJSON(w, http.StatusOK, a.Profile)
	}
}

func HandlePrescreening(d *Deps) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		a, ok := ownedApp(w, r, d)
		if !ok {
			return
		}
		if a.CVKey == "" || !before(a, domain.StageInterview) {
			WriteError(w, http.StatusConflict, "pre-screening dibuka setelah CV diunggah dan sebelum AI Interview")
			return
		}
		var req PrescreeningRequest
		if !decode(w, r, &req) {
			return
		}
		v, err := d.Store.Vacancy(r.Context(), a.VacancyID)
		if err != nil {
			fail(w, err, "lowongan")
			return
		}
		if len(req.Jawaban) != len(v.Prescreen) {
			WriteError(w, http.StatusBadRequest, fmt.Sprintf("jawab ketiga %d pertanyaan", len(v.Prescreen)))
			return
		}
		qa := make([]domain.QA, len(req.Jawaban))
		for i, j := range req.Jawaban {
			j = strings.TrimSpace(j)
			if len([]rune(j)) < 2 || len([]rune(j)) > 2000 {
				WriteError(w, http.StatusBadRequest, "tiap jawaban 2 sampai 2000 karakter")
				return
			}
			qa[i] = domain.QA{Tanya: v.Prescreen[i], Jawab: j}
		}
		a.Prescreen = qa
		advance(&a, domain.StagePrescreening)
		if err := d.Store.SaveApplication(r.Context(), a); err != nil {
			fail(w, err, "lamaran")
			return
		}
		WriteJSON(w, http.StatusOK, lamaranOf(a, "", time.Now()))
	}
}

var (
	cvExt    = map[string]bool{".pdf": true, ".jpg": true, ".jpeg": true, ".png": true}
	audioExt = map[string]bool{".webm": true, ".mp4": true, ".mp3": true}
)

// signedUpload validasi permintaan lalu terbitkan link PUT bertanda tangan 15 menit.
func signedUpload(w http.ResponseWriter, r *http.Request, d *Deps, prefix string, allowed map[string]bool) {
	var req UploadRequest
	if !decode(w, r, &req) {
		return
	}
	ext := strings.ToLower(filepath.Ext(req.Nama))
	switch {
	case !allowed[ext]:
		WriteError(w, http.StatusBadRequest, "tipe file tidak didukung")
		return
	case req.Ukuran <= 0:
		WriteError(w, http.StatusBadRequest, "ukuran file wajib diisi")
		return
	case req.Ukuran > domain.MaxUploadBytes:
		WriteError(w, http.StatusRequestEntityTooLarge, "ukuran file melebihi batas 5 MB")
		return
	}
	key := prefix + usecase.NewID("") + ext
	q := usecase.SignUpload(d.Secret, key, time.Now().Add(15*time.Minute))
	WriteJSON(w, http.StatusOK, UploadURLResponse{UploadURL: d.PublicURL + "/files/" + url.PathEscape(key) + "?" + q.Encode(), Key: key})
}

// uploaded pastikan key milik lamaran ini dan file-nya sudah benar-benar terunggah.
func uploaded(w http.ResponseWriter, r *http.Request, d *Deps, key, prefix string) bool {
	if !strings.HasPrefix(key, prefix) || filepath.Base(key) != key {
		WriteError(w, http.StatusBadRequest, "key file tidak cocok dengan lamaran ini")
		return false
	}
	if _, err := d.Files.Read(r.Context(), key); err != nil {
		WriteError(w, http.StatusBadRequest, "file belum terunggah, coba unggah ulang")
		return false
	}
	return true
}

func HandleCVUpload(d *Deps) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		a, ok := ownedApp(w, r, d)
		if !ok {
			return
		}
		if !before(a, domain.StageInterview) {
			WriteError(w, http.StatusConflict, "CV tidak bisa diganti setelah AI Interview")
			return
		}
		signedUpload(w, r, d, "cv-"+a.ID+"-", cvExt)
	}
}

// HandleCVDone simpan key CV lalu mulai job parse_cv.
func HandleCVDone(d *Deps) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		a, ok := ownedApp(w, r, d)
		if !ok {
			return
		}
		var req UploadDoneRequest
		if !decode(w, r, &req) || !uploaded(w, r, d, req.Key, "cv-"+a.ID+"-") {
			return
		}
		if !before(a, domain.StageInterview) {
			WriteError(w, http.StatusConflict, "CV tidak bisa diganti setelah AI Interview")
			return
		}
		a.CVKey, a.CVText, a.Profile = req.Key, "", domain.Profile{}
		advance(&a, domain.StageUploaded)
		if err := d.Store.SaveApplication(r.Context(), a); err != nil {
			fail(w, err, "lamaran")
			return
		}
		j, err := d.Store.Enqueue(r.Context(), "parse_cv:"+a.ID+":"+req.Key, usecase.KindParseCV, a.ID)
		if err != nil {
			fail(w, err, "job")
			return
		}
		WriteJSON(w, http.StatusAccepted, jobResponse(j))
	}
}

func interviewNomor(w http.ResponseWriter, r *http.Request) (int, bool) {
	n, err := strconv.Atoi(r.PathValue("nomor"))
	if err != nil || n < 1 || n > domain.JumlahPertanyaan {
		WriteError(w, http.StatusBadRequest, "nomor jawaban 1-3")
		return 0, false
	}
	return n, true
}

func interviewOpen(w http.ResponseWriter, a domain.Application) bool {
	if before(a, domain.StagePrescreening) || !before(a, domain.StageInterview) {
		WriteError(w, http.StatusConflict, "AI Interview dibuka setelah pre-screening dan hanya sekali")
		return false
	}
	return true
}

func HandleInterviewUpload(d *Deps) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		n, ok := interviewNomor(w, r)
		if !ok {
			return
		}
		a, ok := ownedApp(w, r, d)
		if !ok || !interviewOpen(w, a) {
			return
		}
		signedUpload(w, r, d, fmt.Sprintf("aud-%s-%d-", a.ID, n), audioExt)
	}
}

// HandleInterviewDone simpan jawaban, mulai transkripsi; jawaban ketiga menutup interview.
func HandleInterviewDone(d *Deps) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		n, ok := interviewNomor(w, r)
		if !ok {
			return
		}
		a, ok := ownedApp(w, r, d)
		if !ok || !interviewOpen(w, a) {
			return
		}
		var req UploadDoneRequest
		if !decode(w, r, &req) || !uploaded(w, r, d, req.Key, fmt.Sprintf("aud-%s-%d-", a.ID, n)) {
			return
		}
		v, err := d.Store.Vacancy(r.Context(), a.VacancyID)
		if err != nil {
			fail(w, err, "lowongan")
			return
		}
		ans := domain.Answer{Nomor: n, Question: v.Interview[n-1], AudioKey: req.Key, Seconds: max(0, min(req.Durasi, 600))}
		if err := d.Store.SaveAnswer(r.Context(), a.ID, ans); err != nil {
			fail(w, err, "jawaban")
			return
		}
		j, err := d.Store.Enqueue(r.Context(), "transcribe:"+a.ID+":"+req.Key, usecase.KindTranscribe, usecase.TranscribeRef(a.ID, n))
		if err != nil {
			fail(w, err, "job")
			return
		}
		answers, err := d.Store.Answers(r.Context(), a.ID)
		if err != nil {
			fail(w, err, "jawaban")
			return
		}
		if len(answers) == domain.JumlahPertanyaan {
			advance(&a, domain.StageInterview)
			if err := d.Store.SaveApplication(r.Context(), a); err != nil {
				fail(w, err, "lamaran")
				return
			}
		}
		WriteJSON(w, http.StatusAccepted, jobResponse(j))
	}
}

func HandleLamaranFeedback(d *Deps) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		a, ok := ownedApp(w, r, d)
		if !ok {
			return
		}
		uid, _ := ClaimsFromContext(r.Context())
		list, err := d.Store.FeedbackFor(r.Context(), uid)
		if err != nil {
			fail(w, err, "feedback")
			return
		}
		for _, c := range list {
			if c.App.ID == a.ID {
				WriteJSON(w, http.StatusOK, feedbackOf(r, d, c))
				return
			}
		}
		WriteError(w, http.StatusNotFound, "feedback belum dikirim HRD")
	}
}

// HandleMyFeedback semua feedback yang sudah dikirim HRD ke mahasiswa ini.
func HandleMyFeedback(d *Deps) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		uid, _ := ClaimsFromContext(r.Context())
		list, err := d.Store.FeedbackFor(r.Context(), uid)
		if err != nil {
			fail(w, err, "feedback")
			return
		}
		out := make([]FeedbackData, len(list))
		for i, c := range list {
			out[i] = feedbackOf(r, d, c)
		}
		WriteJSON(w, http.StatusOK, out)
	}
}
