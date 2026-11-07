package usecase

import (
	"context"
	"errors"
	"fmt"
	"log/slog"
	"slices"
	"strconv"
	"strings"
	"sync"
	"time"

	"pintukarier-backend/internal/domain"
)

const (
	KindQuestions  = "questions"
	KindParseCV    = "parse_cv"
	KindProfilCV   = "profil_cv"
	KindTranscribe = "transcribe"
	KindAnalisis   = "analisis"
)

var ErrPermanent = errors.New("gagal permanen")

type Pipeline struct {
	Store       Store
	AI          AIService
	Files       FileStore
	Concurrency int
}

func (p *Pipeline) Run(ctx context.Context, j domain.Job) error {
	switch j.Kind {
	case KindQuestions:
		return p.questions(ctx, j.RefID)
	case KindParseCV:
		return p.parseCV(ctx, j.RefID)
	case KindProfilCV:
		uid, key, _ := strings.Cut(j.RefID, ":")
		return p.profilCV(ctx, uid, key)
	case KindTranscribe:
		appID, nomor, _ := strings.Cut(j.RefID, ":")
		n, err := strconv.Atoi(nomor)
		if err != nil {
			return fmt.Errorf("%w: ref transcribe %q", ErrPermanent, j.RefID)
		}
		return p.transcribe(ctx, appID, n)
	case KindAnalisis:
		return p.analisis(ctx, j.RefID)
	}
	return fmt.Errorf("%w: jenis job %q tidak dikenal", ErrPermanent, j.Kind)
}

func TranscribeRef(appID string, nomor int) string {
	return appID + ":" + strconv.Itoa(nomor)
}

// ProfilCVRef ref job profil_cv; key file tidak pernah memuat ":".
func ProfilCVRef(userID, key string) string {
	return userID + ":" + key
}

func (p *Pipeline) questions(ctx context.Context, vacancyID string) error {
	v, err := p.Store.Vacancy(ctx, vacancyID)
	if err != nil {
		return err
	}
	q, err := p.AI.Questions(ctx, QuestionsInput{Posisi: v.Title, Deskripsi: v.Description, Wajib: v.Required, Plus: nonNil(v.Preferred)})
	if err != nil {
		return err
	}
	if len(q.Prescreen) != domain.JumlahPertanyaan || len(q.Interview) != domain.JumlahPertanyaan {
		return errors.New("AI Engine wajib kirim 3 pertanyaan pre-screening dan 3 interview")
	}
	return p.Store.SetVacancyQuestions(ctx, vacancyID, q.Prescreen, q.Interview)
}

func (p *Pipeline) parseCV(ctx context.Context, appID string) error {
	a, err := p.Store.Application(ctx, appID)
	if err != nil {
		return err
	}
	if a.CVKey == "" {
		return fmt.Errorf("%w: lamaran belum punya CV", ErrPermanent)
	}
	file, err := p.Files.Read(ctx, a.CVKey)
	if err != nil {
		return err
	}
	cv, err := p.AI.ParseCV(ctx, file, a.CVKey)
	if err != nil {
		return err
	}
	a.CVText, a.Profile, a.UpdatedAt = cv.Teks, cv.Profil, time.Now()
	return p.Store.SaveApplication(ctx, a)
}

// profilCV lengkapi profil akun dari CV yang diunggah di halaman profil, tempat mahasiswa langsung
// melihat hasilnya. CV lamaran sengaja tidak mengubah profil akun tanpa dilihat mahasiswa.
// shortcut: baca-ubah-tulis tanpa lock, PUT /me/profil yang jatuh di jeda milidetik itu tertimpa;
// ganti ke UPDATE ... CASE WHEN kolom kosong bila edit bersamaan mulai terjadi.
func (p *Pipeline) profilCV(ctx context.Context, userID, key string) error {
	file, err := p.Files.Read(ctx, key)
	if err != nil {
		return err
	}
	cv, err := p.AI.ParseCV(ctx, file, key)
	if err != nil {
		return err
	}
	u, err := p.Store.UserByID(ctx, userID)
	if err != nil {
		return err
	}
	LengkapiProfil(&u, cv)
	if err := p.Store.UpdateStudentProfile(ctx, u); err != nil {
		return err
	}

	// Ekstrak klaim sertifikasi dari CV untuk diverifikasi dokumen buktinya (deduplikasi dengan judul yang sudah ada)
	if len(cv.Profil.Sertifikasi) > 0 {
		existingClaims, _ := p.Store.ClaimsByStudent(ctx, userID)
		existingTitles := make(map[string]bool)
		for _, ec := range existingClaims {
			existingTitles[strings.ToLower(strings.TrimSpace(ec.Title))] = true
		}

		var newClaims []domain.ClaimEvidence
		now := time.Now()
		for i, cert := range cv.Profil.Sertifikasi {
			certTitle := strings.TrimSpace(cert)
			if certTitle == "" || existingTitles[strings.ToLower(certTitle)] {
				continue
			}
			newClaims = append(newClaims, domain.ClaimEvidence{
				ID:                fmt.Sprintf("claim-%s-%d-%d", userID, now.Unix(), i),
				StudentID:         userID,
				ClaimType:         "sertifikasi",
				Title:             certTitle,
				Context:           fmt.Sprintf("Diekstrak otomatis dari CV mahasiswa: %s", certTitle),
				Status:            domain.ClaimPendingUpload,
				MatchConfidence:   0.0,
				VerificationNotes: "Menunggu mahasiswa mengunggah dokumen bukti sertifikat.",
				CreatedAt:         now,
				UpdatedAt:         now,
			})
		}
		if len(newClaims) > 0 {
			if err := p.Store.SaveClaims(ctx, newClaims); err != nil {
				slog.Error("gagal menyimpan claims hasil ekstraksi CV", "err", err, "userID", userID)
			}
		}
	}

	return nil
}

// LengkapiProfil isi field profil akun yang masih kosong dari CV dan tambah skill yang belum ada.
// Isian mahasiswa tidak pernah ditimpa.
func LengkapiProfil(u *domain.User, cv ParsedCV) {
	id := cv.Identitas
	for _, f := range []struct {
		dst *string
		v   string
	}{
		{&u.NIM, id.NIM}, {&u.Campus, id.Kampus}, {&u.Summary, cv.Profil.Ringkasan},
	} {
		if strings.TrimSpace(*f.dst) == "" {
			*f.dst = strings.TrimSpace(f.v)
		}
	}
	if u.Semester == 0 && id.Semester >= 1 && id.Semester <= 14 {
		u.Semester = id.Semester
	}
	if u.IPK == 0 && id.IPK > 0 && id.IPK <= 4 {
		u.IPK = id.IPK
	}
	for _, s := range cv.Profil.Skill {
		s = strings.TrimSpace(s)
		if s != "" && !slices.ContainsFunc(u.Skills, func(x string) bool { return strings.EqualFold(x, s) }) {
			u.Skills = append(u.Skills, s)
		}
	}
}

func (p *Pipeline) transcribe(ctx context.Context, appID string, nomor int) error {
	answers, err := p.Store.Answers(ctx, appID)
	if err != nil {
		return err
	}
	for _, ans := range answers {
		if ans.Nomor != nomor {
			continue
		}
		file, err := p.Files.Read(ctx, ans.AudioKey)
		if err != nil {
			return err
		}
		t, err := p.AI.Transcribe(ctx, file, ans.AudioKey)
		if err != nil {
			return err
		}
		ans.Transcript = strings.TrimSpace(t.Teks)
		if ans.Seconds == 0 && t.DurasiDetik != nil {
			ans.Seconds = int(*t.DurasiDetik + 0.5)
		}
		return p.Store.SaveAnswer(ctx, appID, ans)
	}
	return fmt.Errorf("%w: jawaban %d tidak ditemukan", ErrPermanent, nomor)
}

func (p *Pipeline) analisis(ctx context.Context, vacancyID string) error {
	ids, err := p.Store.PendingScoring(ctx, vacancyID)
	if err != nil {
		return err
	}
	sem := make(chan struct{}, max(1, p.Concurrency))
	var (
		mu        sync.Mutex
		permanent []error
		transient []error
		wg        sync.WaitGroup
	)
	for _, id := range ids {
		wg.Go(func() {
			sem <- struct{}{}
			defer func() { <-sem }()
			if err := p.score(ctx, id); err != nil {
				mu.Lock()
				defer mu.Unlock()
				if errors.Is(err, ErrPermanent) {
					permanent = append(permanent, fmt.Errorf("%s: %w", id, err))
				} else {
					transient = append(transient, fmt.Errorf("%s: %w", id, err))
				}
			}
		})
	}
	wg.Wait()
	// Selama ada yang bisa di-retry, jangan tandai permanen supaya job diulang.
	if len(transient) > 0 {
		return errors.Join(transient...)
	}
	return errors.Join(permanent...)
}

func (p *Pipeline) score(ctx context.Context, appID string) error {
	a, err := p.Store.Application(ctx, appID)
	if err != nil {
		return err
	}
	if a.Stage != domain.StageInterview {
		return nil
	}
	v, err := p.Store.Vacancy(ctx, a.VacancyID)
	if err != nil {
		return err
	}
	answers, err := p.Store.Answers(ctx, appID)
	if err != nil {
		return err
	}
	interview := make([]domain.QA, 0, len(answers))
	for _, ans := range answers {
		if ans.Transcript == "" {
			return fmt.Errorf("transkrip jawaban %d belum selesai", ans.Nomor)
		}
		interview = append(interview, domain.QA{Tanya: ans.Question, Jawab: ans.Transcript})
	}
	cvText := a.CVText
	if cvText == "" {
		cvText = ProfileText(a.Profile)
	}
	res, err := p.AI.Score(ctx, ScoreInput{
		Posisi: v.Title, Deskripsi: v.Description, Wajib: v.Required, Plus: nonNil(v.Preferred),
		CVTeks: cvText, Prescreening: nonNil(a.Prescreen), Interview: interview,
	})
	if err != nil {
		return err
	}
	score, err := ScoreFromAI(appID, res)
	if err != nil {
		return err
	}
	draft, err := p.AI.DraftFeedback(ctx, FeedbackInput{Posisi: v.Title, Kategori: string(score.Category), Alasan: res.Alasan, Bukti: res.Bukti})
	if err != nil {
		// Draf hanya bantuan; HRD tetap bisa menulis feedback sendiri.
		slog.Warn("draft feedback gagal", "lamaran", appID, "err", err)
		draft = domain.Feedback{}
	}
	for i := range draft.Area {
		draft.Area[i].Matkul = domain.MatkulFor(draft.Area[i].Kompetensi)
	}
	r := domain.Result{ApplicationID: appID, Score: score, Reason: res.Alasan, Draft: draft, Version: res.Versi, ScoredAt: time.Now()}
	if res.Peringatan != nil {
		r.Warning = *res.Peringatan
	}
	if err := p.Store.SaveResult(ctx, r); err != nil {
		return err
	}
	a.Stage, a.UpdatedAt = domain.StageScored, time.Now()
	return p.Store.SaveApplication(ctx, a)
}

// ProfileText cadangan teks CV dari profil yang sudah dicek mahasiswa, dipakai
// bila CV tidak punya teks yang bisa diekstrak.
func ProfileText(pr domain.Profile) string {
	var b strings.Builder
	b.WriteString(pr.Ringkasan + "\nSkill: " + strings.Join(pr.Skill, ", ") + "\n")
	for _, group := range [][]domain.Entry{pr.Pengalaman, pr.Proyek, pr.Organisasi} {
		for _, e := range group {
			fmt.Fprintf(&b, "%s, %s (%s): %s\n", e.Peran, e.Tempat, e.Waktu, e.Poin)
		}
	}
	if len(pr.Sertifikasi) > 0 {
		b.WriteString("Sertifikasi: " + strings.Join(pr.Sertifikasi, ", "))
	}
	return strings.TrimSpace(b.String())
}

// nonNil Pydantic menolak null untuk list; nil slice Go di-marshal jadi null.
func nonNil[T any](s []T) []T {
	if s == nil {
		return []T{}
	}
	return s
}
