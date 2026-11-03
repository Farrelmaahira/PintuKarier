package handlers

import (
	"net/http"

	"pintukarier-backend/internal/domain"
)

// HandleStudentReadiness menyajikan data profil kesiapan kerja mahasiswa pemanggil.
func HandleStudentReadiness(d *Deps) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		uid, role := ClaimsFromContext(r.Context())
		if role != domain.RoleMahasiswa && role != domain.RoleAdmin {
			WriteError(w, http.StatusForbidden, "hanya dapat diakses oleh mahasiswa atau admin")
			return
		}

		profile, err := d.Store.StudentReadiness(r.Context(), uid)
		if err != nil {
			WriteError(w, http.StatusInternalServerError, "gagal memuat data kesiapan kerja")
			return
		}

		WriteJSON(w, http.StatusOK, profile)
	}
}
