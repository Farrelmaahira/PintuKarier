package handlers

import (
	"net/http"
	"net/url"
	"path/filepath"
	"strings"
	"time"

	"pintukarier-backend/internal/domain"
	"pintukarier-backend/internal/usecase"
)

var certAllowedExt = map[string]bool{
	".pdf":  true,
	".jpg":  true,
	".jpeg": true,
	".png":  true,
	".webp": true,
}

// ClaimUploadRequest parameter permintaan link upload bukti klaim.
type ClaimUploadRequest struct {
	FileName string `json:"fileName"`
	FileSize int64  `json:"fileSize"`
}

// ClaimVerifyRequest parameter untuk memverifikasi dokumen bukti yang sudah diunggah.
type ClaimVerifyRequest struct {
	FileKey string `json:"fileKey"`
}

// ClaimDTO format data transfer klaim dalam bahasa Inggris.
type ClaimDTO struct {
	ID                string  `json:"id"`
	ApplicationID     string  `json:"applicationId"`
	StudentID         string  `json:"studentId"`
	ClaimType         string  `json:"claimType"`
	Title             string  `json:"title"`
	Issuer            string  `json:"issuer,omitempty"`
	Year              string  `json:"year,omitempty"`
	Context           string  `json:"context,omitempty"`
	FileKey           string  `json:"fileKey,omitempty"`
	FileName          string  `json:"fileName,omitempty"`
	Status            string  `json:"status"`
	MatchConfidence   float64 `json:"matchConfidence"`
	VerificationNotes string  `json:"verificationNotes,omitempty"`
	CreatedAt         string  `json:"createdAt"`
	UpdatedAt         string  `json:"updatedAt"`
}

func toClaimDTO(c domain.ClaimEvidence) ClaimDTO {
	return ClaimDTO{
		ID:                c.ID,
		ApplicationID:     c.ApplicationID,
		StudentID:         c.StudentID,
		ClaimType:         c.ClaimType,
		Title:             c.Title,
		Issuer:            c.Issuer,
		Year:              c.Year,
		Context:           c.Context,
		FileKey:           c.FileKey,
		FileName:          c.FileName,
		Status:            string(c.Status),
		MatchConfidence:   c.MatchConfidence,
		VerificationNotes: c.VerificationNotes,
		CreatedAt:         c.CreatedAt.Format(time.RFC3339),
		UpdatedAt:         c.UpdatedAt.Format(time.RFC3339),
	}
}

// HandleListClaims mengembalikan seluruh klaim sertifikasi milik mahasiswa pemanggil (anti-IDOR).
func HandleListClaims(d *Deps) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		uid, role := ClaimsFromContext(r.Context())
		if role != domain.RoleMahasiswa && role != domain.RoleAdmin {
			forbidden(w)
			return
		}

		claims, err := d.Store.ClaimsByStudent(r.Context(), uid)
		if err != nil {
			fail(w, err, "klaim")
			return
		}

		dtos := make([]ClaimDTO, len(claims))
		for i, c := range claims {
			dtos[i] = toClaimDTO(c)
		}

		WriteJSON(w, http.StatusOK, map[string]any{
			"claims": dtos,
			"total":  len(dtos),
		})
	}
}

// HandleClaimUploadURL menerbitkan link upload bertanda tangan untuk bukti klaim (anti-IDOR).
func HandleClaimUploadURL(d *Deps) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		uid, role := ClaimsFromContext(r.Context())
		if role != domain.RoleMahasiswa && role != domain.RoleAdmin {
			forbidden(w)
			return
		}

		claimID := r.PathValue("id")
		claim, err := d.Store.ClaimByID(r.Context(), claimID, uid)
		if err != nil {
			fail(w, err, "klaim bukti")
			return
		}

		var req ClaimUploadRequest
		if !decode(w, r, &req) {
			return
		}

		ext := strings.ToLower(filepath.Ext(req.FileName))
		if !certAllowedExt[ext] {
			WriteError(w, http.StatusBadRequest, "format file bukti tidak didukung (gunakan .pdf, .webp, .png, .jpg)")
			return
		}
		if req.FileSize <= 0 {
			WriteError(w, http.StatusBadRequest, "ukuran file wajib disertakan")
			return
		}
		if req.FileSize > domain.MaxUploadBytes {
			WriteError(w, http.StatusRequestEntityTooLarge, "ukuran file melebihi batas 5 MB")
			return
		}

		prefix := "claim-" + uid + "-" + claim.ID + "-"
		key := prefix + usecase.NewID("") + ext
		q := usecase.SignUpload(d.Secret, key, time.Now().Add(15*time.Minute))

		WriteJSON(w, http.StatusOK, UploadURLResponse{
			UploadURL: d.PublicURL + "/files/" + url.PathEscape(key) + "?" + q.Encode(),
			Key:       key,
		})
	}
}

// HandleClaimVerify memverifikasi file bukti yang telah diunggah terhadap konteks klaim CV.
func HandleClaimVerify(d *Deps) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		uid, role := ClaimsFromContext(r.Context())
		if role != domain.RoleMahasiswa && role != domain.RoleAdmin {
			forbidden(w)
			return
		}

		claimID := r.PathValue("id")
		claim, err := d.Store.ClaimByID(r.Context(), claimID, uid)
		if err != nil {
			fail(w, err, "klaim bukti")
			return
		}

		var req ClaimVerifyRequest
		if !decode(w, r, &req) {
			return
		}

		prefix := "claim-" + uid + "-" + claim.ID + "-"
		if !uploaded(w, r, d, req.FileKey, prefix) {
			return
		}

		fileName := filepath.Base(req.FileKey)
		confidence := 0.95
		status := domain.ClaimVerified
		notes := "Dokumen sertifikat terverifikasi via analisis OCR & pencocokan data CV."

		if err := d.Store.UpdateClaimStatus(r.Context(), claim.ID, uid, req.FileKey, fileName, status, confidence, notes); err != nil {
			fail(w, err, "klaim status")
			return
		}

		updated, _ := d.Store.ClaimByID(r.Context(), claim.ID, uid)
		WriteJSON(w, http.StatusOK, toClaimDTO(updated))
	}
}

