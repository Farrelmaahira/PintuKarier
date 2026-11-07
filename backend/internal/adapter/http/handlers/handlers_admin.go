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

// HandleAdminMitraCreate membuat entitas mitra baru.
func HandleAdminMitraCreate(d *Deps) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		_, role := ClaimsFromContext(r.Context())
		if role != domain.RoleAdmin {
			WriteError(w, http.StatusForbidden, "hanya dapat diakses oleh admin pusat karier")
			return
		}

		var req struct {
			NamaPerusahaan   string `json:"nama_perusahaan"`
			BidangIndustri   string `json:"bidang_industri"`
			JumlahLowongan   int    `json:"jumlah_lowongan"`
			JumlahPelamar    int    `json:"jumlah_pelamar"`
			FeedbackTerkirim int    `json:"feedback_terkirim"`
			StatusKemitraan  string `json:"status_kemitraan"`
		}
		if !decode(w, r, &req) {
			return
		}
		if req.NamaPerusahaan == "" || req.BidangIndustri == "" {
			WriteError(w, http.StatusBadRequest, "nama perusahaan dan bidang industri wajib diisi")
			return
		}

		created, err := d.Store.CreateMitra(r.Context(), domain.AdminMitraSummary{
			NamaPerusahaan:   req.NamaPerusahaan,
			BidangIndustri:   req.BidangIndustri,
			JumlahLowongan:   req.JumlahLowongan,
			JumlahPelamar:    req.JumlahPelamar,
			FeedbackTerkirim: req.FeedbackTerkirim,
			StatusKemitraan:  req.StatusKemitraan,
		})
		if err != nil {
			WriteError(w, http.StatusInternalServerError, "gagal menyimpan mitra")
			return
		}

		WriteJSON(w, http.StatusCreated, created)
	}
}

// HandleAdminMitraUpdate memperbarui data mitra industri yang ada.
func HandleAdminMitraUpdate(d *Deps) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		_, role := ClaimsFromContext(r.Context())
		if role != domain.RoleAdmin {
			WriteError(w, http.StatusForbidden, "hanya dapat diakses oleh admin pusat karier")
			return
		}

		id := r.PathValue("id")
		if id == "" {
			WriteError(w, http.StatusBadRequest, "id mitra wajib diisi")
			return
		}

		var req struct {
			NamaPerusahaan   string `json:"nama_perusahaan"`
			BidangIndustri   string `json:"bidang_industri"`
			JumlahLowongan   int    `json:"jumlah_lowongan"`
			JumlahPelamar    int    `json:"jumlah_pelamar"`
			FeedbackTerkirim int    `json:"feedback_terkirim"`
			StatusKemitraan  string `json:"status_kemitraan"`
		}
		if !decode(w, r, &req) {
			return
		}
		if req.NamaPerusahaan == "" || req.BidangIndustri == "" {
			WriteError(w, http.StatusBadRequest, "nama perusahaan dan bidang industri wajib diisi")
			return
		}

		updated, err := d.Store.UpdateMitra(r.Context(), domain.AdminMitraSummary{
			ID:               id,
			NamaPerusahaan:   req.NamaPerusahaan,
			BidangIndustri:   req.BidangIndustri,
			JumlahLowongan:   req.JumlahLowongan,
			JumlahPelamar:    req.JumlahPelamar,
			FeedbackTerkirim: req.FeedbackTerkirim,
			StatusKemitraan:  req.StatusKemitraan,
		})
		if err != nil {
			WriteError(w, http.StatusInternalServerError, "gagal memperbarui mitra")
			return
		}

		WriteJSON(w, http.StatusOK, updated)
	}
}

// HandleAdminMitraDelete menghapus data mitra industri.
func HandleAdminMitraDelete(d *Deps) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		_, role := ClaimsFromContext(r.Context())
		if role != domain.RoleAdmin {
			WriteError(w, http.StatusForbidden, "hanya dapat diakses oleh admin pusat karier")
			return
		}

		id := r.PathValue("id")
		if id == "" {
			WriteError(w, http.StatusBadRequest, "id mitra wajib diisi")
			return
		}

		if err := d.Store.DeleteMitra(r.Context(), id); err != nil {
			WriteError(w, http.StatusInternalServerError, "gagal menghapus mitra")
			return
		}

		WriteJSON(w, http.StatusOK, map[string]string{"message": "mitra berhasil dihapus"})
	}
}
