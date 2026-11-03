package handlers

import (
	"encoding/json"
	"net/http"

	"pintukarier-backend/internal/domain"
)

type SubmitDrillRequest struct {
	DrillID     string `json:"drill_id"`
	OptionIndex int    `json:"option_index"`
}

// HandleStudentLearning menyajikan daftar modul belajar adaptif dan drill studi kasus.
func HandleStudentLearning(d *Deps) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		uid, role := ClaimsFromContext(r.Context())
		if role != domain.RoleMahasiswa && role != domain.RoleAdmin {
			WriteError(w, http.StatusForbidden, "hanya dapat diakses oleh mahasiswa atau admin")
			return
		}

		overview, err := d.Store.StudentLearning(r.Context(), uid)
		if err != nil {
			WriteError(w, http.StatusInternalServerError, "gagal memuat data modul pembelajaran")
			return
		}

		WriteJSON(w, http.StatusOK, overview)
	}
}

// HandleSubmitDrill memproses pengiriman jawaban studi kasus interaktif.
func HandleSubmitDrill(d *Deps) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		uid, role := ClaimsFromContext(r.Context())
		if role != domain.RoleMahasiswa && role != domain.RoleAdmin {
			WriteError(w, http.StatusForbidden, "hanya dapat diakses oleh mahasiswa")
			return
		}

		var req SubmitDrillRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			WriteError(w, http.StatusBadRequest, "format body request tidak valid")
			return
		}

		if req.DrillID == "" {
			WriteError(w, http.StatusBadRequest, "drill_id wajib diisi")
			return
		}

		result, err := d.Store.SubmitDrill(r.Context(), uid, req.DrillID, req.OptionIndex)
		if err != nil {
			WriteError(w, http.StatusInternalServerError, "gagal mengevaluasi jawaban drill")
			return
		}

		WriteJSON(w, http.StatusOK, result)
	}
}
