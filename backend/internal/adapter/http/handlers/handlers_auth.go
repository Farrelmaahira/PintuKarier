package handlers

import (
	"net/http"
	"strings"
	"time"

	"pintukarier-backend/internal/domain"
	"pintukarier-backend/internal/usecase"
)

const sessionTTL = 24 * time.Hour

func session(w http.ResponseWriter, d *Deps, u domain.User, code int) {
	tok, err := usecase.Issue(u.ID, u.Role, d.Secret, sessionTTL)
	if err != nil {
		fail(w, err, "sesi")
		return
	}
	WriteJSON(w, code, SessionResponse{Token: tok, Peran: string(u.Role), Nama: u.Name, Email: u.Email})
}

func HandleRegister(d *Deps) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req RegisterRequest
		if !decode(w, r, &req) {
			return
		}
		email := strings.ToLower(strings.TrimSpace(req.Email))
		role := domain.Role(req.Peran)
		switch {
		case strings.TrimSpace(req.Nama) == "" || strings.TrimSpace(req.Instansi) == "":
			WriteError(w, http.StatusBadRequest, "nama dan instansi wajib diisi")
			return
		case !role.Valid() || role == domain.RoleAdmin:
			WriteError(w, http.StatusBadRequest, "peran harus mahasiswa, hrd, atau prodi")
			return
		}
		if !usecase.ValidEmail(email) {
			WriteError(w, http.StatusBadRequest, "format email belum benar")
			return
		}
		hash, err := usecase.HashPassword(req.Password)
		if err != nil {
			WriteError(w, http.StatusBadRequest, err.Error())
			return
		}
		u := domain.User{
			ID: usecase.NewID("u-"), Email: email, PasswordHash: hash, Role: role,
			Name: strings.TrimSpace(req.Nama), Institution: strings.TrimSpace(req.Instansi), CreatedAt: time.Now(),
		}
		if _, err := d.Store.CreateUser(r.Context(), u); err != nil {
			fail(w, err, "email")
			return
		}
		session(w, d, u, http.StatusCreated)
	}
}

func HandleLogin(d *Deps) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req LoginRequest
		if !decode(w, r, &req) {
			return
		}
		u, err := d.Store.UserByEmail(r.Context(), strings.ToLower(strings.TrimSpace(req.Email)))
		// Pesan sama untuk email tak dikenal dan password salah supaya akun tidak bisa ditebak.
		if err != nil || !usecase.CheckPassword(u.PasswordHash, req.Password) {
			WriteError(w, http.StatusUnauthorized, "email atau password belum cocok")
			return
		}
		session(w, d, u, http.StatusOK)
	}
}

// HandleLogout token stateless; frontend cukup menghapus cookie.
// shortcut: token tidak dicabut di server, tambah daftar cabut atau refresh token sebelum pilot.
func HandleLogout() http.HandlerFunc {
	return func(w http.ResponseWriter, _ *http.Request) {
		w.WriteHeader(http.StatusNoContent)
	}
}

func HandleMe(d *Deps) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		uid, role := ClaimsFromContext(r.Context())
		u, err := d.Store.UserByID(r.Context(), uid)
		if err != nil {
			fail(w, err, "akun")
			return
		}
		me := MeResponse{UserID: uid, Role: string(role), Nama: u.Name, Email: u.Email, Instansi: u.Institution}
		if role == domain.RoleProdi {
			me.ProdiID = Slug(u.Institution)
		}
		WriteJSON(w, http.StatusOK, me)
	}
}

func profilOf(u domain.User) ProfilMahasiswa {
	skill := u.Skills
	if skill == nil {
		skill = []string{}
	}
	return ProfilMahasiswa{Nama: u.Name, NIM: u.NIM, Prodi: u.Institution, Kampus: u.Campus, Semester: u.Semester, IPK: u.IPK, Ringkasan: u.Summary, Skill: skill}
}

func HandleProfilMahasiswaGet(d *Deps) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		uid, _ := ClaimsFromContext(r.Context())
		u, err := d.Store.UserByID(r.Context(), uid)
		if err != nil {
			fail(w, err, "akun")
			return
		}
		WriteJSON(w, http.StatusOK, profilOf(u))
	}
}

func HandleProfilMahasiswaPut(d *Deps) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var p ProfilMahasiswa
		if !decode(w, r, &p) {
			return
		}
		if strings.TrimSpace(p.Nama) == "" || strings.TrimSpace(p.Prodi) == "" {
			WriteError(w, http.StatusBadRequest, "nama dan program studi wajib diisi")
			return
		}
		if p.Semester < 0 || p.Semester > 14 || p.IPK < 0 || p.IPK > 4 {
			WriteError(w, http.StatusBadRequest, "semester 0-14 dan IPK 0-4")
			return
		}
		uid, _ := ClaimsFromContext(r.Context())
		u, err := d.Store.UserByID(r.Context(), uid)
		if err != nil {
			fail(w, err, "akun")
			return
		}
		u.Name, u.Institution, u.NIM, u.Campus = strings.TrimSpace(p.Nama), strings.TrimSpace(p.Prodi), strings.TrimSpace(p.NIM), strings.TrimSpace(p.Kampus)
		u.Semester, u.IPK, u.Summary, u.Skills = p.Semester, p.IPK, strings.TrimSpace(p.Ringkasan), p.Skill
		if err := d.Store.UpdateStudentProfile(r.Context(), u); err != nil {
			fail(w, err, "akun")
			return
		}
		WriteJSON(w, http.StatusOK, profilOf(u))
	}
}

func profilCVPrefix(uid string) string {
	return "profil-" + uid + "-"
}

// HandleProfilCVUpload link upload CV untuk melengkapi profil akun, terpisah dari CV lamaran.
func HandleProfilCVUpload(d *Deps) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		uid, _ := ClaimsFromContext(r.Context())
		signedUpload(w, r, d, profilCVPrefix(uid), cvExt)
	}
}

// HandleProfilCVDone mulai job profil_cv yang mengisi field profil yang masih kosong.
func HandleProfilCVDone(d *Deps) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		uid, _ := ClaimsFromContext(r.Context())
		var req UploadDoneRequest
		if !decode(w, r, &req) || !uploaded(w, r, d, req.Key, profilCVPrefix(uid)) {
			return
		}
		j, err := d.Store.Enqueue(r.Context(), "profil_cv:"+req.Key, usecase.KindProfilCV, usecase.ProfilCVRef(uid, req.Key))
		if err != nil {
			fail(w, err, "job")
			return
		}
		WriteJSON(w, http.StatusAccepted, jobResponse(j))
	}
}
