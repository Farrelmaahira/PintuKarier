package domain

import (
	"fmt"
	"time"
)

// Periode semester akademik: Agustus sampai Januari Gasal, Februari sampai Juli Genap.
func Periode(t time.Time) string {
	y, m := t.Year(), t.Month()
	switch {
	case m >= time.August:
		return fmt.Sprintf("Gasal %d/%d", y, y+1)
	case m == time.January:
		return fmt.Sprintf("Gasal %d/%d", y-1, y)
	default:
		return fmt.Sprintf("Genap %d/%d", y-1, y)
	}
}

// TahunAjaranMulai tahun awal tahun ajaran yang sedang berjalan.
func TahunAjaranMulai(t time.Time) int {
	if t.Month() >= time.August {
		return t.Year()
	}
	return t.Year() - 1
}

// Angkatan perkiraan tahun masuk dari semester berjalan, dua semester per tahun.
func Angkatan(semester int, now time.Time) int {
	if semester < 1 {
		return 0
	}
	return TahunAjaranMulai(now) - (semester-1)/2
}
