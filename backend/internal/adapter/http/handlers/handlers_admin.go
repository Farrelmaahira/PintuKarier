package handlers

import (
	"net/http"

	"pintukarier-backend/internal/domain"
)

// HandleAdminOverview ringkasan data makro seluruh jurusan kampus.
func HandleAdminOverview(d *Deps) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		_, role := ClaimsFromContext(r.Context())
		if role != domain.RoleAdmin {
			WriteError(w, http.StatusForbidden, "hanya dapat diakses oleh admin pusat karier")
			return
		}

		ov, err := d.Store.AdminOverview(r.Context())
		if err != nil {
			WriteError(w, http.StatusInternalServerError, "gagal memuat data overview admin")
			return
		}

		WriteJSON(w, http.StatusOK, ov)
	}
}

// HandleAdminJurusan menyajikan statistik 7 jurusan Politeknik Negeri Jakarta.
func HandleAdminJurusan(d *Deps) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		_, role := ClaimsFromContext(r.Context())
		if role != domain.RoleAdmin {
			WriteError(w, http.StatusForbidden, "hanya dapat diakses oleh admin pusat karier")
			return
		}

		daftar, err := d.Store.AdminJurusan(r.Context())
		if err != nil {
			WriteError(w, http.StatusInternalServerError, "gagal memuat data jurusan")
			return
		}

		WriteJSON(w, http.StatusOK, daftar)
	}
}

// HandleAdminMitra menyajikan daftar kemitraan industri dan SLA feedback.
func HandleAdminMitra(d *Deps) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		_, role := ClaimsFromContext(r.Context())
		if role != domain.RoleAdmin {
			WriteError(w, http.StatusForbidden, "hanya dapat diakses oleh admin pusat karier")
			return
		}

		mitra, err := d.Store.AdminMitra(r.Context())
		if err != nil {
			WriteError(w, http.StatusInternalServerError, "gagal memuat data mitra")
			return
		}

		WriteJSON(w, http.StatusOK, mitra)
	}
}
