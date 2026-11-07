// Package postgres implementasi usecase.Store di atas pgx.
package postgres

import (
	"context"
	_ "embed"
	"encoding/json"
	"errors"
	"fmt"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
	"github.com/jackc/pgx/v5/pgxpool"

	"pintukarier-backend/internal/domain"
	"pintukarier-backend/internal/usecase"
)

//go:embed schema.sql
var schema string

type Store struct {
	db *pgxpool.Pool
}

var _ usecase.Store = (*Store)(nil)

// Open sambungkan pool dan pastikan skema ada.
func Open(ctx context.Context, url string) (*Store, error) {
	db, err := pgxpool.New(ctx, url)
	if err != nil {
		return nil, err
	}
	if _, err := db.Exec(ctx, schema); err != nil {
		db.Close()
		return nil, fmt.Errorf("postgres: terapkan skema: %w", err)
	}
	return &Store{db: db}, nil
}

func (s *Store) Close() { s.db.Close() }

func notFound(err error) error {
	if errors.Is(err, pgx.ErrNoRows) {
		return usecase.ErrNotFound
	}
	return err
}

func toJSON(v any) []byte {
	b, _ := json.Marshal(v)
	return b
}

// ─── users ───────────────────────────────────────────────────────────────────

const userCols = `id, email, password_hash, peran, nama, instansi, nim, kampus, semester, ipk, ringkasan, skill, created_at`

func scanUser(row pgx.Row) (domain.User, error) {
	var u domain.User
	var skill []byte
	err := row.Scan(&u.ID, &u.Email, &u.PasswordHash, &u.Role, &u.Name, &u.Institution, &u.NIM, &u.Campus, &u.Semester, &u.IPK, &u.Summary, &skill, &u.CreatedAt)
	if err != nil {
		return u, notFound(err)
	}
	_ = json.Unmarshal(skill, &u.Skills)
	return u, nil
}

func (s *Store) CreateUser(ctx context.Context, u domain.User) (domain.User, error) {
	if u.Skills == nil {
		u.Skills = []string{}
	}
	_, err := s.db.Exec(ctx, `INSERT INTO users (`+userCols+`) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)`,
		u.ID, u.Email, u.PasswordHash, u.Role, u.Name, u.Institution, u.NIM, u.Campus, u.Semester, u.IPK, u.Summary, toJSON(u.Skills), u.CreatedAt)
	if pgErr, ok := errors.AsType[*pgconn.PgError](err); ok && pgErr.Code == "23505" {
		return u, usecase.ErrConflict
	}
	return u, err
}

func (s *Store) UserByEmail(ctx context.Context, email string) (domain.User, error) {
	return scanUser(s.db.QueryRow(ctx, `SELECT `+userCols+` FROM users WHERE email = $1`, email))
}

func (s *Store) UserByID(ctx context.Context, id string) (domain.User, error) {
	return scanUser(s.db.QueryRow(ctx, `SELECT `+userCols+` FROM users WHERE id = $1`, id))
}

func (s *Store) UpdateStudentProfile(ctx context.Context, u domain.User) error {
	if u.Skills == nil {
		u.Skills = []string{}
	}
	_, err := s.db.Exec(ctx, `UPDATE users SET nama=$2, instansi=$3, nim=$4, kampus=$5, semester=$6, ipk=$7, ringkasan=$8, skill=$9 WHERE id=$1`,
		u.ID, u.Name, u.Institution, u.NIM, u.Campus, u.Semester, u.IPK, u.Summary, toJSON(u.Skills))
	return err
}

// ─── lowongan ────────────────────────────────────────────────────────────────

const vacancyCols = `l.id, l.posisi, l.perusahaan, l.bidang, l.lokasi, l.tipe, l.deskripsi, l.deadline, l.wajib, l.plus,
	l.prescreen_tanya, l.interview_tanya, l.created_by, l.created_at,
	(SELECT count(*) FROM lamaran x WHERE x.lowongan_id = l.id)`

func scanVacancy(row pgx.Row) (domain.Vacancy, error) {
	var v domain.Vacancy
	var deadline *time.Time
	var wajib, plus, pre, iv []byte
	err := row.Scan(&v.ID, &v.Title, &v.Company, &v.Position, &v.Location, &v.Type, &v.Description, &deadline,
		&wajib, &plus, &pre, &iv, &v.CreatedBy, &v.CreatedAt, &v.Applicants)
	if err != nil {
		return v, notFound(err)
	}
	if deadline != nil {
		v.Deadline = *deadline
	}
	_ = json.Unmarshal(wajib, &v.Required)
	_ = json.Unmarshal(plus, &v.Preferred)
	_ = json.Unmarshal(pre, &v.Prescreen)
	_ = json.Unmarshal(iv, &v.Interview)
	return v, nil
}

func (s *Store) CreateVacancy(ctx context.Context, v domain.Vacancy) error {
	var deadline *time.Time
	if !v.Deadline.IsZero() {
		deadline = &v.Deadline
	}
	_, err := s.db.Exec(ctx, `INSERT INTO lowongan (id, posisi, perusahaan, bidang, lokasi, tipe, deskripsi, deadline, wajib, plus,
		prescreen_tanya, interview_tanya, created_by, created_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)`,
		v.ID, v.Title, v.Company, v.Position, v.Location, v.Type, v.Description, deadline, toJSON(v.Required), toJSON(nonNil(v.Preferred)),
		toJSON(v.Prescreen), toJSON(v.Interview), v.CreatedBy, v.CreatedAt)
	return err
}

func (s *Store) ListVacancies(ctx context.Context, createdBy string) ([]domain.Vacancy, error) {
	rows, err := s.db.Query(ctx, `SELECT `+vacancyCols+` FROM lowongan l WHERE $1 = '' OR l.created_by = $1 ORDER BY l.created_at DESC`, createdBy)
	if err != nil {
		return nil, err
	}
	return collect(rows, scanVacancy)
}

func (s *Store) Vacancy(ctx context.Context, id string) (domain.Vacancy, error) {
	return scanVacancy(s.db.QueryRow(ctx, `SELECT `+vacancyCols+` FROM lowongan l WHERE l.id = $1`, id))
}

func (s *Store) SetVacancyQuestions(ctx context.Context, id string, prescreen, interview []string) error {
	_, err := s.db.Exec(ctx, `UPDATE lowongan SET prescreen_tanya=$2, interview_tanya=$3 WHERE id=$1`, id, toJSON(prescreen), toJSON(interview))
	return err
}

// ─── lamaran ─────────────────────────────────────────────────────────────────

const appCols = `a.id, a.lowongan_id, a.mahasiswa_id, a.tahap, a.cv_key, a.cv_teks, a.profil, a.prescreen, a.created_at, a.updated_at`

func scanApp(row pgx.Row) (domain.Application, error) {
	var a domain.Application
	var profil, pre []byte
	err := row.Scan(&a.ID, &a.VacancyID, &a.StudentID, &a.Stage, &a.CVKey, &a.CVText, &profil, &pre, &a.CreatedAt, &a.UpdatedAt)
	if err != nil {
		return a, notFound(err)
	}
	_ = json.Unmarshal(profil, &a.Profile)
	_ = json.Unmarshal(pre, &a.Prescreen)
	return a, nil
}

func (s *Store) CreateApplication(ctx context.Context, a domain.Application) (domain.Application, error) {
	_, err := s.db.Exec(ctx, `INSERT INTO lamaran (id, lowongan_id, mahasiswa_id, tahap, created_at, updated_at)
		VALUES ($1,$2,$3,$4,$5,$6) ON CONFLICT (lowongan_id, mahasiswa_id) DO NOTHING`,
		a.ID, a.VacancyID, a.StudentID, a.Stage, a.CreatedAt, a.UpdatedAt)
	if err != nil {
		return a, err
	}
	return scanApp(s.db.QueryRow(ctx, `SELECT `+appCols+` FROM lamaran a WHERE a.lowongan_id=$1 AND a.mahasiswa_id=$2`, a.VacancyID, a.StudentID))
}

func (s *Store) Application(ctx context.Context, id string) (domain.Application, error) {
	return scanApp(s.db.QueryRow(ctx, `SELECT `+appCols+` FROM lamaran a WHERE a.id = $1`, id))
}

func (s *Store) ListApplications(ctx context.Context, studentID string) ([]domain.Application, error) {
	rows, err := s.db.Query(ctx, `SELECT `+appCols+` FROM lamaran a WHERE a.mahasiswa_id = $1 ORDER BY a.updated_at DESC`, studentID)
	if err != nil {
		return nil, err
	}
	return collect(rows, scanApp)
}

func (s *Store) SaveApplication(ctx context.Context, a domain.Application) error {
	tag, err := s.db.Exec(ctx, `UPDATE lamaran SET tahap=$2, cv_key=$3, cv_teks=$4, profil=$5, prescreen=$6, updated_at=$7 WHERE id=$1`,
		a.ID, a.Stage, a.CVKey, a.CVText, toJSON(a.Profile), toJSON(nonNil(a.Prescreen)), a.UpdatedAt)
	if err == nil && tag.RowsAffected() == 0 {
		return usecase.ErrNotFound
	}
	return err
}

func (s *Store) SaveAnswer(ctx context.Context, appID string, ans domain.Answer) error {
	_, err := s.db.Exec(ctx, `INSERT INTO jawaban_interview (lamaran_id, nomor, tanya, audio_key, transkrip, durasi) VALUES ($1,$2,$3,$4,$5,$6)
		ON CONFLICT (lamaran_id, nomor) DO UPDATE SET tanya=EXCLUDED.tanya, audio_key=EXCLUDED.audio_key, transkrip=EXCLUDED.transkrip, durasi=EXCLUDED.durasi`,
		appID, ans.Nomor, ans.Question, ans.AudioKey, ans.Transcript, ans.Seconds)
	return err
}

func (s *Store) Answers(ctx context.Context, appID string) ([]domain.Answer, error) {
	rows, err := s.db.Query(ctx, `SELECT nomor, tanya, audio_key, transkrip, durasi FROM jawaban_interview WHERE lamaran_id=$1 ORDER BY nomor`, appID)
	if err != nil {
		return nil, err
	}
	return collect(rows, func(r pgx.Row) (domain.Answer, error) {
		var a domain.Answer
		return a, r.Scan(&a.Nomor, &a.Question, &a.AudioKey, &a.Transcript, &a.Seconds)
	})
}

func (s *Store) PendingScoring(ctx context.Context, vacancyID string) ([]string, error) {
	rows, err := s.db.Query(ctx, `SELECT id FROM lamaran WHERE lowongan_id=$1 AND tahap=$2 ORDER BY created_at`, vacancyID, domain.StageInterview)
	if err != nil {
		return nil, err
	}
	return pgx.CollectRows(rows, pgx.RowTo[string])
}

// ─── hasil ───────────────────────────────────────────────────────────────────

// buktiRow bentuk JSON evidence di kolom hasil.bukti.
type buktiRow struct {
	Syarat  string `json:"syarat"`
	Wajib   bool   `json:"wajib"`
	Dasar   bool   `json:"dasar,omitempty"`
	Status  string `json:"status"`
	Kutipan string `json:"kutipan,omitempty"`
	Sumber  string `json:"sumber,omitempty"`
}

func evidencesToJSON(ev []domain.Evidence) []byte {
	out := make([]buktiRow, len(ev))
	for i, e := range ev {
		out[i] = buktiRow{e.Requirement, e.Mandatory, e.Baseline, string(e.Status), e.Quote, string(e.Source)}
	}
	return toJSON(out)
}

func evidencesFromJSON(b []byte) []domain.Evidence {
	var rows []buktiRow
	_ = json.Unmarshal(b, &rows)
	out := make([]domain.Evidence, len(rows))
	for i, r := range rows {
		out[i] = domain.Evidence{Requirement: r.Syarat, Mandatory: r.Wajib, Baseline: r.Dasar, Status: domain.EvidenceStatus(r.Status), Quote: r.Kutipan, Source: domain.EvidenceSource(r.Sumber)}
	}
	return out
}

func (s *Store) SaveResult(ctx context.Context, r domain.Result) error {
	dims := make([]float64, len(r.Score.Dimensions))
	for i, d := range r.Score.Dimensions {
		dims[i] = d.Score
	}
	_, err := s.db.Exec(ctx, `INSERT INTO hasil (lamaran_id, dimensi, total, kategori_ai, wajib_hilang, alasan, bukti, peringatan, draft_feedback, versi, dinilai_at)
		VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
		ON CONFLICT (lamaran_id) DO UPDATE SET dimensi=EXCLUDED.dimensi, total=EXCLUDED.total, kategori_ai=EXCLUDED.kategori_ai,
		wajib_hilang=EXCLUDED.wajib_hilang, alasan=EXCLUDED.alasan, bukti=EXCLUDED.bukti, peringatan=EXCLUDED.peringatan,
		draft_feedback=EXCLUDED.draft_feedback, versi=EXCLUDED.versi, dinilai_at=EXCLUDED.dinilai_at`,
		r.ApplicationID, toJSON(dims), r.Score.Total, r.Score.Category, r.Score.MandatoryMissing, r.Reason,
		evidencesToJSON(r.Score.Evidences), r.Warning, toJSON(r.Draft), r.Version, r.ScoredAt)
	return err
}

const resultCols = `h.lamaran_id, h.dimensi, h.total, h.kategori_ai, h.wajib_hilang, h.alasan, h.bukti, h.peringatan, h.draft_feedback,
	h.versi, h.dinilai_at, h.kategori_hrd, h.alasan_koreksi, h.keputusan, h.feedback, h.feedback_oleh, h.feedback_at`

func scanResultInto(r *domain.Result) []any {
	return []any{&r.ApplicationID, jsonDims{&r.Score}, &r.Score.Total, &r.Score.Category, &r.Score.MandatoryMissing, &r.Reason,
		jsonEvidence{&r.Score}, &r.Warning, jsonInto{&r.Draft}, &r.Version, &r.ScoredAt, &r.HRCategory, &r.CorrectionReason,
		&r.Decision, jsonFeedback{&r.Feedback}, &r.FeedbackBy, nullTime{&r.FeedbackAt}}
}

func (s *Store) Result(ctx context.Context, appID string) (domain.Result, error) {
	var r domain.Result
	err := s.db.QueryRow(ctx, `SELECT `+resultCols+` FROM hasil h WHERE h.lamaran_id=$1`, appID).Scan(scanResultInto(&r)...)
	if err == nil {
		r.Score.CandidateID = appID
	}
	return r, notFound(err)
}

func (s *Store) SaveDecision(ctx context.Context, appID string, hrCategory domain.Category, reason, decision string) error {
	tag, err := s.db.Exec(ctx, `UPDATE hasil SET kategori_hrd=$2, alasan_koreksi=$3, keputusan=$4 WHERE lamaran_id=$1`, appID, hrCategory, reason, decision)
	if err == nil && tag.RowsAffected() == 0 {
		return usecase.ErrNotFound
	}
	return err
}

// SaveFeedback simpan feedback dan tutup lamaran dalam satu transaksi.
func (s *Store) SaveFeedback(ctx context.Context, appID string, fb domain.Feedback, by string) error {
	return pgx.BeginFunc(ctx, s.db, func(tx pgx.Tx) error {
		tag, err := tx.Exec(ctx, `UPDATE hasil SET feedback=$2, feedback_oleh=$3, feedback_at=now() WHERE lamaran_id=$1`, appID, toJSON(fb), by)
		if err != nil {
			return err
		}
		if tag.RowsAffected() == 0 {
			return usecase.ErrNotFound
		}
		_, err = tx.Exec(ctx, `UPDATE lamaran SET tahap=$2, updated_at=now() WHERE id=$1`, appID, domain.StageDecided)
		return err
	})
}

// candidateQuery gabungan lamaran, mahasiswa, lowongan, dan hasil.
const candidateQuery = `SELECT ` + appCols + `, ` + userColsU + `, ` + vacancyCols + `, ` + resultCols + `
	FROM lamaran a JOIN users u ON u.id = a.mahasiswa_id JOIN lowongan l ON l.id = a.lowongan_id JOIN hasil h ON h.lamaran_id = a.id`

const userColsU = `u.id, u.email, u.password_hash, u.peran, u.nama, u.instansi, u.nim, u.kampus, u.semester, u.ipk, u.ringkasan, u.skill, u.created_at`

func scanCandidate(row pgx.Row) (usecase.Candidate, error) {
	var c usecase.Candidate
	var profil, pre, skill, wajib, plus, ps, iv []byte
	var deadline *time.Time
	dest := []any{&c.App.ID, &c.App.VacancyID, &c.App.StudentID, &c.App.Stage, &c.App.CVKey, &c.App.CVText, &profil, &pre, &c.App.CreatedAt, &c.App.UpdatedAt,
		&c.Student.ID, &c.Student.Email, &c.Student.PasswordHash, &c.Student.Role, &c.Student.Name, &c.Student.Institution, &c.Student.NIM,
		&c.Student.Campus, &c.Student.Semester, &c.Student.IPK, &c.Student.Summary, &skill, &c.Student.CreatedAt,
		&c.Vacancy.ID, &c.Vacancy.Title, &c.Vacancy.Company, &c.Vacancy.Position, &c.Vacancy.Location, &c.Vacancy.Type, &c.Vacancy.Description,
		&deadline, &wajib, &plus, &ps, &iv, &c.Vacancy.CreatedBy, &c.Vacancy.CreatedAt, &c.Vacancy.Applicants}
	dest = append(dest, scanResultInto(&c.Result)...)
	if err := row.Scan(dest...); err != nil {
		return c, err
	}
	_ = json.Unmarshal(profil, &c.App.Profile)
	_ = json.Unmarshal(pre, &c.App.Prescreen)
	_ = json.Unmarshal(skill, &c.Student.Skills)
	_ = json.Unmarshal(wajib, &c.Vacancy.Required)
	_ = json.Unmarshal(plus, &c.Vacancy.Preferred)
	if deadline != nil {
		c.Vacancy.Deadline = *deadline
	}
	c.Student.PasswordHash = ""
	c.Result.Score.CandidateID = c.App.ID
	return c, nil
}

func (s *Store) Candidates(ctx context.Context, vacancyID string) ([]usecase.Candidate, error) {
	rows, err := s.db.Query(ctx, candidateQuery+` WHERE a.lowongan_id=$1 ORDER BY h.total DESC`, vacancyID)
	if err != nil {
		return nil, err
	}
	candidates, err := collect(rows, scanCandidate)
	if err != nil {
		return nil, err
	}

	// Cek apakah mahasiswa kandidat memiliki bukti sertifikasi yang sudah diverifikasi prodi
	for i := range candidates {
		var verifiedCount int
		err := s.db.QueryRow(ctx, `
			SELECT COUNT(*) FROM claim_evidences
			WHERE student_id = $1 AND status = 'verified'
		`, candidates[i].Student.ID).Scan(&verifiedCount)
		if err == nil && verifiedCount > 0 {
			candidates[i].ProdiVerified = true
		}
	}
	return candidates, nil
}

func (s *Store) FeedbackFor(ctx context.Context, studentID string) ([]usecase.Candidate, error) {
	rows, err := s.db.Query(ctx, candidateQuery+` WHERE a.mahasiswa_id=$1 AND h.feedback IS NOT NULL ORDER BY h.feedback_at DESC`, studentID)
	if err != nil {
		return nil, err
	}
	return collect(rows, scanCandidate)
}

func (s *Store) RankRows(ctx context.Context, prodi string) ([]usecase.RankRow, error) {
	rows, err := s.db.Query(ctx, `SELECT a.created_at, l.bidang, h.bukti FROM lamaran a
		JOIN users u ON u.id = a.mahasiswa_id JOIN lowongan l ON l.id = a.lowongan_id JOIN hasil h ON h.lamaran_id = a.id
		WHERE lower(trim(u.instansi)) = lower(trim($1))`, prodi)
	if err != nil {
		return nil, err
	}
	return collect(rows, func(r pgx.Row) (usecase.RankRow, error) {
		var row usecase.RankRow
		var bukti []byte
		err := r.Scan(&row.CreatedAt, &row.Position, &bukti)
		row.Evidences = evidencesFromJSON(bukti)
		return row, err
	})
}

// SaveBenchmark simpan hasil benchmark terbaru; hanya ada satu baris.
func (s *Store) SaveBenchmark(ctx context.Context, rows []usecase.ModelBenchmark) error {
	raw, err := json.Marshal(rows)
	if err != nil {
		return err
	}
	_, err = s.db.Exec(ctx, `INSERT INTO benchmark (id, hasil, diukur_at) VALUES (1, $1, now())
		ON CONFLICT (id) DO UPDATE SET hasil = EXCLUDED.hasil, diukur_at = now()`, raw)
	return err
}

func (s *Store) LatestBenchmark(ctx context.Context) ([]usecase.ModelBenchmark, time.Time, error) {
	var raw []byte
	var at time.Time
	err := s.db.QueryRow(ctx, `SELECT hasil, diukur_at FROM benchmark WHERE id = 1`).Scan(&raw, &at)
	if errors.Is(err, pgx.ErrNoRows) {
		return []usecase.ModelBenchmark{}, time.Time{}, nil
	}
	if err != nil {
		return nil, time.Time{}, err
	}
	rows := []usecase.ModelBenchmark{}
	return rows, at, json.Unmarshal(raw, &rows)
}

// ─── jobs ────────────────────────────────────────────────────────────────────

const jobCols = `id, kind, ref_id, idem_key, status, attempts, error, created_at`

func scanJob(row pgx.Row) (domain.Job, error) {
	var j domain.Job
	err := row.Scan(&j.ID, &j.Kind, &j.RefID, &j.IdempotencyKey, &j.Status, &j.Attempts, &j.Error, &j.CreatedAt)
	return j, notFound(err)
}

// Enqueue idempoten: key yang sama mengembalikan job yang sudah ada.
func (s *Store) Enqueue(ctx context.Context, key, kind, refID string) (domain.Job, error) {
	_, err := s.db.Exec(ctx, `INSERT INTO jobs (id, kind, ref_id, idem_key, status) VALUES ($1,$2,$3,$4,$5) ON CONFLICT (idem_key) DO NOTHING`,
		usecase.NewID("job-"), kind, refID, key, domain.JobQueued)
	if err != nil {
		return domain.Job{}, err
	}
	return scanJob(s.db.QueryRow(ctx, `SELECT `+jobCols+` FROM jobs WHERE idem_key=$1`, key))
}

func (s *Store) Job(ctx context.Context, id string) (domain.Job, error) {
	return scanJob(s.db.QueryRow(ctx, `SELECT `+jobCols+` FROM jobs WHERE id=$1`, id))
}

// ClaimJob ambil job siap jalan. Job running yang macet lebih dari 35 menit
// (proses mati di tengah jalan) ikut diambil ulang.
func (s *Store) ClaimJob(ctx context.Context) (domain.Job, bool, error) {
	j, err := scanJob(s.db.QueryRow(ctx, `UPDATE jobs SET status=$1, attempts=attempts+1, updated_at=now() WHERE id = (
		SELECT id FROM jobs WHERE (status=$2 AND run_at <= now()) OR (status=$1 AND updated_at < now() - interval '35 minutes')
		ORDER BY run_at FOR UPDATE SKIP LOCKED LIMIT 1) RETURNING `+jobCols, domain.JobRunning, domain.JobQueued))
	if errors.Is(err, usecase.ErrNotFound) {
		return j, false, nil
	}
	return j, err == nil, err
}

func (s *Store) FinishJob(ctx context.Context, id string, jobErr error, retryAfter time.Duration) error {
	status, msg := domain.JobSucceeded, ""
	if jobErr != nil {
		status, msg = domain.JobFailed, jobErr.Error()
		if retryAfter > 0 {
			status = domain.JobQueued
		}
	}
	_, err := s.db.Exec(ctx, `UPDATE jobs SET status=$2, error=$3, run_at=now() + $4::interval, updated_at=now() WHERE id=$1`,
		id, status, msg, fmt.Sprintf("%d milliseconds", retryAfter.Milliseconds()))
	return err
}

// ─── catatan ─────────────────────────────────────────────────────────────────

func (s *Store) Notes(ctx context.Context, prodi string) ([]domain.FollowUpNote, error) {
	rows, err := s.db.Query(ctx, `SELECT id, prodi, kompetensi, matkul, aksi, oleh, status, created_at FROM catatan
		WHERE lower(trim(prodi)) = lower(trim($1)) ORDER BY created_at DESC`, prodi)
	if err != nil {
		return nil, err
	}
	return collect(rows, func(r pgx.Row) (domain.FollowUpNote, error) {
		var n domain.FollowUpNote
		return n, r.Scan(&n.ID, &n.ProdiID, &n.Kompetensi, &n.Matkul, &n.Aksi, &n.Oleh, &n.Status, &n.CreatedAt)
	})
}

func (s *Store) CreateNote(ctx context.Context, n domain.FollowUpNote) error {
	_, err := s.db.Exec(ctx, `INSERT INTO catatan (id, prodi, kompetensi, matkul, aksi, oleh, status, created_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
		n.ID, n.ProdiID, n.Kompetensi, n.Matkul, n.Aksi, n.Oleh, n.Status, n.CreatedAt)
	return err
}

// ─── helper scan ─────────────────────────────────────────────────────────────

func collect[T any](rows pgx.Rows, scan func(pgx.Row) (T, error)) ([]T, error) {
	defer rows.Close()
	out := []T{}
	for rows.Next() {
		v, err := scan(rows)
		if err != nil {
			return nil, err
		}
		out = append(out, v)
	}
	return out, rows.Err()
}

func nonNil[T any](s []T) []T {
	if s == nil {
		return []T{}
	}
	return s
}

// Target scan yang mengurai kolom JSONB langsung ke field domain.

type jsonInto struct{ v any }

func (j jsonInto) Scan(src any) error { return scanJSON(src, j.v) }

type jsonDims struct{ s *domain.CandidateScore }

func (j jsonDims) Scan(src any) error {
	var dims []float64
	if err := scanJSON(src, &dims); err != nil {
		return err
	}
	j.s.Dimensions = make([]domain.DimensionScore, len(dims))
	for i, d := range dims {
		j.s.Dimensions[i] = domain.DimensionScore{Name: domain.DimensionNames[i%5], Weight: domain.Weights[i%5], Score: d}
	}
	return nil
}

type jsonEvidence struct{ s *domain.CandidateScore }

func (j jsonEvidence) Scan(src any) error {
	b, err := srcBytes(src)
	j.s.Evidences = evidencesFromJSON(b)
	return err
}

type jsonFeedback struct{ f **domain.Feedback }

func (j jsonFeedback) Scan(src any) error {
	if src == nil {
		*j.f = nil
		return nil
	}
	var fb domain.Feedback
	if err := scanJSON(src, &fb); err != nil {
		return err
	}
	*j.f = &fb
	return nil
}

type nullTime struct{ t *time.Time }

func (n nullTime) Scan(src any) error {
	if t, ok := src.(time.Time); ok {
		*n.t = t
	}
	return nil
}

func srcBytes(src any) ([]byte, error) {
	switch v := src.(type) {
	case []byte:
		return v, nil
	case string:
		return []byte(v), nil
	case nil:
		return nil, nil
	}
	// pgx mengurai JSONB ke map/slice saat target bukan []byte; encode ulang.
	return json.Marshal(src)
}

func scanJSON(src any, dst any) error {
	b, err := srcBytes(src)
	if err != nil || b == nil {
		return err
	}
	return json.Unmarshal(b, dst)
}
