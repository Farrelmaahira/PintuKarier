package handlers

import (
	"fmt"
	"net/http"
	"time"

	"pintukarier-backend/internal/domain"
	"pintukarier-backend/internal/usecase"
)

// effectiveCategory kategori HRD bila sudah dikoreksi, selain itu rekomendasi AI.
func effectiveCategory(r domain.Result) domain.Category {
	if r.HRCategory != "" {
		return r.HRCategory
	}
	return r.Score.Category
}

func dims(r domain.Result) [5]float64 {
	var out [5]float64
	for i, d := range r.Score.Dimensions {
		if i < 5 {
			out[i] = d.Score
		}
	}
	return out
}

func durasi(sec int) string {
	return fmt.Sprintf("%d:%02d", sec/60, sec%60)
}

func kandidatOf(c usecase.Candidate, answers []domain.Answer, now time.Time) KandidatResponse {
	res := c.Result
	k := KandidatResponse{
		ID: c.App.ID, Lowongan: c.Vacancy.ID, Posisi: c.Vacancy.Title, Nama: c.Student.Name, Prodi: c.Student.Institution, Kampus: c.Student.Campus,
		Angkatan: domain.Angkatan(c.Student.Semester, now), IPK: c.Student.IPK, Dilamar: usecase.TanggalID(c.App.CreatedAt, now),
		Dimensi: dims(res), Kategori: string(effectiveCategory(res)), KategoriAI: string(res.Score.Category),
		Alasan: res.Reason, AlasanKoreksi: res.CorrectionReason, Peringatan: res.Warning, Keputusan: res.Decision,
		Bukti: []BuktiDTO{}, Prescreen: []string{}, PrescreenTanya: []string{}, Transkrip: []TranskripDTO{},
		InterviewTanya: c.Vacancy.Interview, Feedback: res.Draft.Ringkasan, FeedbackTerkirim: res.Feedback != nil,
		ProdiVerified: c.ProdiVerified,
	}
	if res.Feedback != nil {
		k.Feedback = res.Feedback.Ringkasan
	}
	for _, e := range res.Score.Evidences {
		k.Bukti = append(k.Bukti, BuktiDTO{Syarat: e.Requirement, Wajib: e.Mandatory, Status: string(e.Status), Kutipan: e.Quote, Sumber: string(e.Source)})
	}
	for _, qa := range c.App.Prescreen {
		k.PrescreenTanya = append(k.PrescreenTanya, qa.Tanya)
		k.Prescreen = append(k.Prescreen, qa.Jawab)
	}
	if len(answers) > 0 {
		k.InterviewTanya = nil
		for _, a := range answers {
			k.InterviewTanya = append(k.InterviewTanya, a.Question)
			k.Transkrip = append(k.Transkrip, TranskripDTO{Jawab: a.Transcript, Durasi: durasi(a.Seconds)})
		}
	}
	return k
}

// candidateDetail rakit Kandidat lengkap untuk satu lamaran.
func candidateDetail(w http.ResponseWriter, r *http.Request, d *Deps, a domain.Application, v domain.Vacancy) (KandidatResponse, bool) {
	res, err := d.Store.Result(r.Context(), a.ID)
	if err != nil {
		fail(w, err, "hasil analisis")
		return KandidatResponse{}, false
	}
	student, err := d.Store.UserByID(r.Context(), a.StudentID)
	if err != nil {
		fail(w, err, "mahasiswa")
		return KandidatResponse{}, false
	}
	answers, err := d.Store.Answers(r.Context(), a.ID)
	if err != nil {
		fail(w, err, "jawaban")
		return KandidatResponse{}, false
	}
	return kandidatOf(usecase.Candidate{App: a, Student: student, Vacancy: v, Result: res}, answers, time.Now()), true
}

func HandleKandidatGet(d *Deps) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		a, v, ok := ownedCandidate(w, r, d)
		if !ok {
			return
		}
		if k, ok := candidateDetail(w, r, d, a, v); ok {
			WriteJSON(w, http.StatusOK, k)
		}
	}
}

// HandleKeputusan simpan koreksi kategori dan keputusan HRD. AI tidak pernah memutuskan.
func HandleKeputusan(d *Deps) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		a, v, ok := ownedCandidate(w, r, d)
		if !ok {
			return
		}
		if a.Stage == domain.StageDecided {
			WriteError(w, http.StatusConflict, "feedback sudah dikirim, keputusan tidak bisa diubah")
			return
		}
		var req KeputusanRequest
		if !decode(w, r, &req) {
			return
		}
		if req.Keputusan == "" {
			req.Keputusan = usecase.KeputusanBelum
		}
		if !usecase.ValidDecision(req.Keputusan) {
			WriteError(w, http.StatusBadRequest, "keputusan harus Belum diputuskan, Lolos, atau Belum lolos")
			return
		}
		res, err := d.Store.Result(r.Context(), a.ID)
		if err != nil {
			fail(w, err, "hasil analisis")
			return
		}
		cat, err := usecase.CorrectCategory(res.Score.Category, req.Kategori, req.Alasan)
		if err != nil {
			WriteError(w, http.StatusBadRequest, err.Error())
			return
		}
		alasan := ""
		if cat != res.Score.Category {
			alasan = req.Alasan
		}
		if err := d.Store.SaveDecision(r.Context(), a.ID, cat, alasan, req.Keputusan); err != nil {
			fail(w, err, "hasil analisis")
			return
		}
		if k, ok := candidateDetail(w, r, d, a, v); ok {
			WriteJSON(w, http.StatusOK, k)
		}
	}
}

// HandleKirimFeedback HRD kirim feedback yang sudah direview; struktur kekuatan
// dan area diambil dari draf AI, ringkasan dari tulisan HRD.
func HandleKirimFeedback(d *Deps) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		a, v, ok := ownedCandidate(w, r, d)
		if !ok {
			return
		}
		if a.Stage == domain.StageDecided {
			WriteError(w, http.StatusConflict, "feedback sudah dikirim")
			return
		}
		var req FeedbackRequest
		if !decode(w, r, &req) {
			return
		}
		isi, err := usecase.ReviewFeedback(req.Isi, req.Reviewed)
		if err != nil {
			WriteError(w, http.StatusBadRequest, err.Error())
			return
		}
		res, err := d.Store.Result(r.Context(), a.ID)
		if err != nil {
			fail(w, err, "hasil analisis")
			return
		}
		if res.Decision == "" || res.Decision == usecase.KeputusanBelum {
			WriteError(w, http.StatusConflict, "tentukan keputusan dulu sebelum mengirim feedback")
			return
		}
		fb := res.Draft
		fb.Ringkasan = isi
		uid, _ := ClaimsFromContext(r.Context())
		if err := d.Store.SaveFeedback(r.Context(), a.ID, fb, uid); err != nil {
			fail(w, err, "hasil analisis")
			return
		}
		a.Stage = domain.StageDecided
		if k, ok := candidateDetail(w, r, d, a, v); ok {
			WriteJSON(w, http.StatusOK, k)
		}
	}
}

func feedbackOf(r *http.Request, d *Deps, c usecase.Candidate) FeedbackData {
	res := c.Result
	fb := domain.Feedback{}
	if res.Feedback != nil {
		fb = *res.Feedback
	}
	dari := c.Vacancy.Company
	if hr, err := d.Store.UserByID(r.Context(), res.FeedbackBy); err == nil {
		dari = hr.Name + ", " + c.Vacancy.Company
	}
	out := FeedbackData{
		ID: c.App.ID, Lowongan: c.Vacancy.ID, Perusahaan: c.Vacancy.Company, Posisi: c.Vacancy.Title, Dari: dari,
		Tanggal: usecase.TanggalID(res.FeedbackAt, time.Now()), Kategori: string(effectiveCategory(res)), Dimensi: dims(res),
		Ringkasan: fb.Ringkasan, Kekuatan: fb.Kekuatan, Area: fb.Area, Penutup: fb.Penutup,
	}
	if out.Kekuatan == nil {
		out.Kekuatan = []string{}
	}
	if out.Area == nil {
		out.Area = []domain.Area{}
	}
	return out
}
