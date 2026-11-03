package handlers

import (
	"net/http"

	"pintukarier-backend/internal/domain"
)

// Route satu pola rute, daftar peran yang boleh memanggil, dan pembuat handler.
type Route struct {
	Pattern string
	Roles   []domain.Role
	Handler func(*Deps) http.HandlerFunc
}

var (
	all       = []domain.Role{domain.RoleMahasiswa, domain.RoleHRD, domain.RoleProdi, domain.RoleAdmin}
	hrOnly    = []domain.Role{domain.RoleHRD, domain.RoleAdmin}
	mhsOnly   = []domain.Role{domain.RoleMahasiswa, domain.RoleAdmin}
	prodiOnly = []domain.Role{domain.RoleProdi}
	adminOnly = []domain.Role{domain.RoleAdmin}
)

// Routes kontrak REST API Pintu Karier.
var Routes = []Route{
	{"GET /me", all, HandleMe},
	{"GET /me/profil", mhsOnly, HandleProfilMahasiswaGet},
	{"PUT /me/profil", mhsOnly, HandleProfilMahasiswaPut},
	{"POST /me/cv", mhsOnly, HandleProfilCVUpload},
	{"POST /me/cv/selesai", mhsOnly, HandleProfilCVDone},
	{"GET /me/readiness", mhsOnly, HandleStudentReadiness},
	{"GET /me/learning", mhsOnly, HandleStudentLearning},
	{"POST /me/learning/drill", mhsOnly, HandleSubmitDrill},

	{"GET /lowongan", all, HandleVacancyList},
	{"POST /lowongan", hrOnly, HandleVacancyCreate},
	{"GET /lowongan/{id}", all, HandleVacancyGet},
	{"POST /lowongan/{id}/analisis", hrOnly, HandleVacancyAnalisis},
	{"GET /lowongan/{id}/kandidat", hrOnly, HandleVacancyKandidat},

	{"POST /lamaran", mhsOnly, HandleApply},
	{"GET /lamaran", mhsOnly, HandleMyLamaran},
	{"POST /lamaran/{id}/cv", mhsOnly, HandleCVUpload},
	{"POST /lamaran/{id}/cv/selesai", mhsOnly, HandleCVDone},
	{"GET /lamaran/{id}/profil", mhsOnly, HandleProfilGet},
	{"PUT /lamaran/{id}/profil", mhsOnly, HandleProfilPut},
	{"POST /lamaran/{id}/prescreening", mhsOnly, HandlePrescreening},
	{"POST /lamaran/{id}/interview/{nomor}", mhsOnly, HandleInterviewUpload},
	{"POST /lamaran/{id}/interview/{nomor}/selesai", mhsOnly, HandleInterviewDone},
	{"GET /lamaran/{id}/feedback", mhsOnly, HandleLamaranFeedback},
	{"GET /feedback", mhsOnly, HandleMyFeedback},

	{"GET /kandidat/{id}", hrOnly, HandleKandidatGet},
	{"PATCH /kandidat/{id}/keputusan", hrOnly, HandleKeputusan},
	{"POST /kandidat/{id}/feedback", hrOnly, HandleKirimFeedback},

	{"GET /prodi/{id}/ranking", prodiOnly, HandleRanking},
	{"GET /prodi/{id}/catatan", prodiOnly, HandleCatatanList},
	{"POST /prodi/{id}/catatan", prodiOnly, HandleCatatanCreate},

	{"GET /admin/overview", adminOnly, HandleAdminOverview},
	{"GET /admin/jurusan", adminOnly, HandleAdminJurusan},
	{"GET /admin/mitra", adminOnly, HandleAdminMitra},

	{"GET /jobs/{id}", all, HandleJobGet},
}

// RegisterRoutes pasang semua rute ke mux.
func RegisterRoutes(mux *http.ServeMux, d *Deps) {
	mux.HandleFunc("POST /auth/register", HandleRegister(d))
	mux.HandleFunc("POST /auth/login", HandleLogin(d))
	mux.HandleFunc("POST /auth/logout", HandleLogout())
	mux.HandleFunc("GET /benchmark", HandleBenchmark(d))
	for _, rt := range Routes {
		mux.Handle(rt.Pattern, RequireRole(d.Secret, rt.Roles...)(rt.Handler(d)))
	}
	files := CORS(d.WebOrigin, HandleFilePut(d))
	mux.Handle("PUT /files/{key}", files)
	mux.Handle("OPTIONS /files/{key}", files)
}
