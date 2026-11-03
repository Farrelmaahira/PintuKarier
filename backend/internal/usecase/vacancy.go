package usecase

import (
	"crypto/rand"
	"encoding/hex"
	"errors"
	"strings"
	"time"

	"pintukarier-backend/internal/domain"
)

func NewID(prefix string) string {
	var b [8]byte
	_, _ = rand.Read(b[:])
	return prefix + hex.EncodeToString(b[:])
}

var tipeLowongan = map[string]bool{"Magang": true, "Full-time": true, "Kontrak": true}

func CreateVacancy(v domain.Vacancy) (domain.Vacancy, error) {
	v.Title, v.Company, v.Position = strings.TrimSpace(v.Title), strings.TrimSpace(v.Company), strings.TrimSpace(v.Position)
	if v.Title == "" || v.Company == "" || v.Position == "" || v.CreatedBy == "" {
		return domain.Vacancy{}, errors.New("posisi, perusahaan, kelompok posisi, dan pembuat wajib diisi")
	}
	if !tipeLowongan[v.Type] {
		return domain.Vacancy{}, errors.New("tipe harus Magang, Full-time, atau Kontrak")
	}
	v.Required, v.Preferred = cleanList(v.Required), cleanList(v.Preferred)
	if len(v.Required) == 0 {
		return domain.Vacancy{}, errors.New("minimal satu syarat wajib")
	}
	v.ID = NewID("low-")
	v.CreatedAt = time.Now()
	v.Prescreen, v.Interview = domain.DefaultPrescreen, domain.DefaultInterview
	return v, nil
}

func cleanList(in []string) []string {
	out := []string{}
	for _, s := range in {
		if s = strings.TrimSpace(s); s != "" {
			out = append(out, s)
		}
	}
	return out
}

func Apply(vacancyID, studentID string) (domain.Application, error) {
	if vacancyID == "" || studentID == "" {
		return domain.Application{}, errors.New("vacancy id dan student id wajib diisi")
	}
	now := time.Now()
	return domain.Application{
		ID:        NewID("lam-"),
		VacancyID: vacancyID,
		StudentID: studentID,
		Stage:     domain.StageApplied,
		CreatedAt: now,
		UpdatedAt: now,
	}, nil
}
