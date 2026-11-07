package handlers

import (
	"net/http"
	"strings"
	"time"

	"pintukarier-backend/internal/domain"
	"pintukarier-backend/internal/usecase"
)

// HandleRanking agregat kompetensi prodi pemanggil per periode dan posisi.
// Grup di bawah MinKandidat dibuang di server, bukan cuma disembunyikan frontend.
func HandleRanking(d *Deps) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		prodi, ok := ownedProdi(w, r, d)
		if !ok {
			return
		}
		rows, err := d.Store.RankRows(r.Context(), prodi)
		if err != nil {
			fail(w, err, "ranking")
			return
		}
		filtered := usecase.FilterRanking(usecase.AggregateRanking(rows))
		out := map[string]map[string]RankingResponse{}
		for periode, byPos := range filtered {
			out[periode] = map[string]RankingResponse{}
			for pos, rk := range byPos {
				items := make([][]any, len(rk.Items))
				for i, it := range rk.Items {
					items[i] = []any{it.Kompetensi, it.Pct}
				}
				out[periode][pos] = RankingResponse{N: rk.N, Items: items}
			}
		}
		WriteJSON(w, http.StatusOK, out)
	}
}

func catatanOf(n domain.FollowUpNote) CatatanResponse {
	return CatatanResponse{ID: n.ID, Kompetensi: n.Kompetensi, Matkul: n.Matkul, Aksi: n.Aksi, Oleh: n.Oleh, Tanggal: usecase.TanggalID(n.CreatedAt, time.Now()), Status: n.Status}
}

func HandleCatatanList(d *Deps) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		prodi, ok := ownedProdi(w, r, d)
		if !ok {
			return
		}
		notes, err := d.Store.Notes(r.Context(), prodi)
		if err != nil {
			fail(w, err, "catatan")
			return
		}
		out := make([]CatatanResponse, len(notes))
		for i, n := range notes {
			out[i] = catatanOf(n)
		}
		WriteJSON(w, http.StatusOK, out)
	}
}

func HandleCatatanCreate(d *Deps) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		prodi, ok := ownedProdi(w, r, d)
		if !ok {
			return
		}
		var req CatatanRequest
		if !decode(w, r, &req) {
			return
		}
		if strings.TrimSpace(req.Kompetensi) == "" || len([]rune(strings.TrimSpace(req.Aksi))) < 10 {
			WriteError(w, http.StatusBadRequest, "kompetensi wajib diisi dan aksi minimal 10 karakter")
			return
		}
		uid, _ := ClaimsFromContext(r.Context())
		u, err := d.Store.UserByID(r.Context(), uid)
		if err != nil {
			fail(w, err, "akun")
			return
		}
		n := domain.FollowUpNote{
			ID: usecase.NewID("cat-"), ProdiID: prodi, Kompetensi: strings.TrimSpace(req.Kompetensi),
			Matkul: strings.TrimSpace(req.Matkul), Aksi: strings.TrimSpace(req.Aksi), Oleh: u.Name,
			Status: "Direncanakan", CreatedAt: time.Now(),
		}
		if err := d.Store.CreateNote(r.Context(), n); err != nil {
			fail(w, err, "catatan")
			return
		}
		WriteJSON(w, http.StatusCreated, catatanOf(n))
	}
}

// HandleProdiStudents mengembalikan daftar mahasiswa prodi dan status bukti klaim portofolio.
func HandleProdiStudents(d *Deps) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		prodi, ok := ownedProdi(w, r, d)
		if !ok {
			return
		}
		students, err := d.Store.ProdiStudents(r.Context(), prodi)
		if err != nil {
			fail(w, err, "mahasiswa prodi")
			return
		}
		WriteJSON(w, http.StatusOK, students)
	}
}

// HandleProdiVerifyClaim memproses validasi/approval klaim bukti mahasiswa oleh kaprodi/dosen prodi.
func HandleProdiVerifyClaim(d *Deps) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		prodi, ok := ownedProdi(w, r, d)
		if !ok {
			return
		}
		claimID := r.PathValue("claimId")
		if claimID == "" {
			WriteError(w, http.StatusBadRequest, "claim ID wajib disertakan")
			return
		}

		var req ProdiVerifyClaimRequest
		if !decode(w, r, &req) {
			return
		}

		err := d.Store.VerifyClaimByProdi(r.Context(), claimID, prodi, req.Notes, req.Verified)
		if err != nil {
			fail(w, err, "klaim bukti")
			return
		}
		WriteJSON(w, http.StatusOK, map[string]any{"ok": true, "claimId": claimID, "verified": req.Verified})
	}
}
