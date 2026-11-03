package usecase

import (
	"errors"
	"strings"

	"pintukarier-backend/internal/domain"
)

// Keputusan yang boleh diambil HRD. AI tidak pernah mengisi ini.
const (
	KeputusanBelum = "Belum diputuskan"
	KeputusanLolos = "Lolos"
	KeputusanTidak = "Belum lolos"
)

func CorrectCategory(ai domain.Category, correction string, reason string) (domain.Category, error) {
	c := domain.Category(correction)
	if correction == "" || c == ai {
		return ai, nil
	}
	if !c.Valid() {
		return "", errors.New("kategori koreksi tidak dikenal")
	}
	if strings.TrimSpace(reason) == "" {
		return "", errors.New("alasan koreksi wajib diisi")
	}
	return c, nil
}

// ValidDecision keputusan harus salah satu dari tiga label frontend.
func ValidDecision(d string) bool {
	return d == KeputusanBelum || d == KeputusanLolos || d == KeputusanTidak
}

// ReviewFeedback pastikan HR baca draf sebelum kirim dan isi spesifik.
func ReviewFeedback(content string, reviewed bool) (string, error) {
	if !reviewed {
		return "", errors.New("feedback wajib direview HR sebelum dikirim")
	}
	if len([]rune(strings.TrimSpace(content))) < 20 {
		return "", errors.New("feedback harus spesifik minimal 20 karakter")
	}
	return strings.TrimSpace(content), nil
}
