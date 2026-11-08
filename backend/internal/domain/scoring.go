package domain

import "math"

// Bobot Tabel 1 concept paper. Jangan ubah tanpa keputusan tim.
const (
	WeightSkill          = 35
	WeightExperience     = 25
	WeightResponsibility = 20
	WeightEducation      = 10
	WeightAddedValue     = 10
)

// Weights urutannya sama dengan DIMENSI di frontend.
var Weights = [5]int{WeightSkill, WeightExperience, WeightResponsibility, WeightEducation, WeightAddedValue}

// DimensionNames urutannya sama dengan Weights.
var DimensionNames = [5]string{"Skill Match", "Experience Match", "Responsibility and Scope", "Education and Certification", "Added Value"}

// Category empat kategori rekomendasi.
type Category string

const (
	CategoryMemenuhi        Category = "Memenuhi Kriteria"
	CategoryDipertimbangkan Category = "Perlu Dipertimbangkan"
	CategoryPengembangan    Category = "Perlu Pengembangan"
	CategoryTidakMemenuhi   Category = "Tidak Memenuhi Syarat"
)

func (c Category) Valid() bool {
	switch c {
	case CategoryMemenuhi, CategoryDipertimbangkan, CategoryPengembangan, CategoryTidakMemenuhi:
		return true
	}
	return false
}

// CategoryForScore wajib hilang selalu Tidak Memenuhi Syarat apapun skornya.
func CategoryForScore(score float64, mandatoryMissing bool) Category {
	if mandatoryMissing {
		return CategoryTidakMemenuhi
	}
	switch {
	case score >= 80:
		return CategoryMemenuhi
	case score >= 65:
		return CategoryDipertimbangkan
	case score >= 50:
		return CategoryPengembangan
	default:
		return CategoryTidakMemenuhi
	}
}

// WeightedTotal rata-rata berbobot 5 dimensi, dibulatkan seperti frontend/lib/computeScore.ts.
func WeightedTotal(dims [5]float64) float64 {
	sum := 0.0
	for i, d := range dims {
		sum += d * float64(Weights[i])
	}
	return math.Round(sum / 100)
}
