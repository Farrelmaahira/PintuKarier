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
	if err := validateVacancy(v); err != nil {
		return domain.Vacancy{}, err
	}
	v.Title, v.Company, v.Position = strings.TrimSpace(v.Title), strings.TrimSpace(v.Company), strings.TrimSpace(v.Position)
	v.Required, v.Preferred = cleanList(v.Required), cleanList(v.Preferred)
	v.ID = NewID("low-")
	v.CreatedAt = time.Now()
	v.Prescreen, v.Interview = domain.DefaultPrescreen, domain.DefaultInterview
	return v, nil
}

// UpdateVacancy validasi dan rapikan lowongan yang sudah ada; id, pembuat, dan pertanyaan tidak diubah.
func UpdateVacancy(v domain.Vacancy) (domain.Vacancy, error) {
	if v.ID == "" {
		return domain.Vacancy{}, errors.New("id lowongan wajib diisi")
	}
	if err := validateVacancy(v); err != nil {
		return domain.Vacancy{}, err
	}
	v.Title, v.Company, v.Position = strings.TrimSpace(v.Title), strings.TrimSpace(v.Company), strings.TrimSpace(v.Position)
	v.Required, v.Preferred = cleanList(v.Required), cleanList(v.Preferred)
	return v, nil
}

func validateVacancy(v domain.Vacancy) error {
	if strings.TrimSpace(v.Title) == "" || strings.TrimSpace(v.Company) == "" || strings.TrimSpace(v.Position) == "" || v.CreatedBy == "" {
		return errors.New("posisi, perusahaan, kelompok posisi, dan pembuat wajib diisi")
	}
	if !tipeLowongan[v.Type] {
		return errors.New("tipe harus Magang, Full-time, atau Kontrak")
	}
	if len(cleanList(v.Required)) == 0 {
		return errors.New("minimal satu syarat wajib")
	}
	return nil
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
