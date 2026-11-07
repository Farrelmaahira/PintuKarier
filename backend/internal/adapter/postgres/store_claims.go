package postgres

import (
	"context"
	"errors"
	"strings"
	"time"

	"github.com/jackc/pgx/v5"

	"pintukarier-backend/internal/domain"
	"pintukarier-backend/internal/usecase"
)

// SaveClaims menyimpan atau memperbarui daftar klaim bukti dengan parameterized query.
func (s *Store) SaveClaims(ctx context.Context, claims []domain.ClaimEvidence) error {
	if len(claims) == 0 {
		return nil
	}

	for _, c := range claims {
		now := time.Now()
		createdAt := c.CreatedAt
		if createdAt.IsZero() {
			createdAt = now
		}

		var appID any = nil
		if strings.TrimSpace(c.ApplicationID) != "" {
			appID = strings.TrimSpace(c.ApplicationID)
		}

		query := `
			INSERT INTO claim_evidences (
				id, application_id, student_id, claim_type, title, issuer, year,
				context, file_key, file_name, status, match_confidence, verification_notes,
				created_at, updated_at
			) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
			ON CONFLICT (id) DO UPDATE SET
				title = EXCLUDED.title,
				issuer = EXCLUDED.issuer,
				year = EXCLUDED.year,
				context = EXCLUDED.context,
				file_key = EXCLUDED.file_key,
				file_name = EXCLUDED.file_name,
				status = EXCLUDED.status,
				match_confidence = EXCLUDED.match_confidence,
				verification_notes = EXCLUDED.verification_notes,
				updated_at = EXCLUDED.updated_at
		`
		_, err := s.db.Exec(ctx, query,
			c.ID, appID, c.StudentID, c.ClaimType, c.Title, c.Issuer, c.Year,
			c.Context, c.FileKey, c.FileName, string(c.Status), c.MatchConfidence, c.VerificationNotes,
			createdAt, now,
		)
		if err != nil {
			return err
		}
	}
	return nil
}

// ClaimsByStudent mengambil seluruh klaim milik mahasiswa (anti-IDOR filter $1).
func (s *Store) ClaimsByStudent(ctx context.Context, studentID string) ([]domain.ClaimEvidence, error) {
	query := `
		SELECT
			id, application_id, student_id, claim_type, title, issuer, year,
			context, file_key, file_name, status, match_confidence, verification_notes,
			created_at, updated_at
		FROM claim_evidences
		WHERE student_id = $1
		ORDER BY created_at DESC
	`
	rows, err := s.db.Query(ctx, query, studentID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var claims []domain.ClaimEvidence
	for rows.Next() {
		var c domain.ClaimEvidence
		var statusStr string
		err := rows.Scan(
			&c.ID, &c.ApplicationID, &c.StudentID, &c.ClaimType, &c.Title, &c.Issuer, &c.Year,
			&c.Context, &c.FileKey, &c.FileName, &statusStr, &c.MatchConfidence, &c.VerificationNotes,
			&c.CreatedAt, &c.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		c.Status = domain.ClaimStatus(statusStr)
		claims = append(claims, c)
	}
	return claims, rows.Err()
}

// ClaimByID mengambil satu klaim dengan proteksi kepemilikan anti-IDOR.
func (s *Store) ClaimByID(ctx context.Context, claimID, studentID string) (domain.ClaimEvidence, error) {
	query := `
		SELECT
			id, application_id, student_id, claim_type, title, issuer, year,
			context, file_key, file_name, status, match_confidence, verification_notes,
			created_at, updated_at
		FROM claim_evidences
		WHERE id = $1 AND student_id = $2
	`
	var c domain.ClaimEvidence
	var statusStr string
	err := s.db.QueryRow(ctx, query, claimID, studentID).Scan(
		&c.ID, &c.ApplicationID, &c.StudentID, &c.ClaimType, &c.Title, &c.Issuer, &c.Year,
		&c.Context, &c.FileKey, &c.FileName, &statusStr, &c.MatchConfidence, &c.VerificationNotes,
		&c.CreatedAt, &c.UpdatedAt,
	)
	if errors.Is(err, pgx.ErrNoRows) {
		return domain.ClaimEvidence{}, usecase.ErrNotFound
	}
	if err != nil {
		return domain.ClaimEvidence{}, err
	}
	c.Status = domain.ClaimStatus(statusStr)
	return c, nil
}

// UpdateClaimStatus memperbarui bukti dan hasil verifikasi dengan validasi kepemilikan mahasiswa.
func (s *Store) UpdateClaimStatus(ctx context.Context, claimID, studentID string, fileKey, fileName string, status domain.ClaimStatus, confidence float64, notes string) error {
	query := `
		UPDATE claim_evidences
		SET
			file_key = $3,
			file_name = $4,
			status = $5,
			match_confidence = $6,
			verification_notes = $7,
			updated_at = now()
		WHERE id = $1 AND student_id = $2
	`
	cmd, err := s.db.Exec(ctx, query, claimID, studentID, fileKey, fileName, string(status), confidence, notes)
	if err != nil {
		return err
	}
	if cmd.RowsAffected() == 0 {
		return usecase.ErrNotFound
	}
	return nil
}

// ClaimsByApplication mengambil daftar klaim untuk satu berkas lamaran.
func (s *Store) ClaimsByApplication(ctx context.Context, applicationID string) ([]domain.ClaimEvidence, error) {
	query := `
		SELECT
			id, application_id, student_id, claim_type, title, issuer, year,
			context, file_key, file_name, status, match_confidence, verification_notes,
			created_at, updated_at
		FROM claim_evidences
		WHERE application_id = $1
		ORDER BY created_at ASC
	`
	rows, err := s.db.Query(ctx, query, applicationID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var claims []domain.ClaimEvidence
	for rows.Next() {
		var c domain.ClaimEvidence
		var statusStr string
		err := rows.Scan(
			&c.ID, &c.ApplicationID, &c.StudentID, &c.ClaimType, &c.Title, &c.Issuer, &c.Year,
			&c.Context, &c.FileKey, &c.FileName, &statusStr, &c.MatchConfidence, &c.VerificationNotes,
			&c.CreatedAt, &c.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		c.Status = domain.ClaimStatus(statusStr)
		claims = append(claims, c)
	}
	return claims, rows.Err()
}

