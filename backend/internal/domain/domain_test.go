package domain

import (
	"testing"
	"time"
)

func TestCategoryThresholds(t *testing.T) {
	cases := []struct {
		score     float64
		mandatory bool
		want      Category
	}{
		{95, false, CategoryMemenuhi},
		{80, false, CategoryMemenuhi},
		{79, false, CategoryDipertimbangkan},
		{65, false, CategoryDipertimbangkan},
		{64, false, CategoryPengembangan},
		{50, false, CategoryPengembangan},
		{49, false, CategoryTidakMemenuhi},
		{99, true, CategoryTidakMemenuhi},
	}
	for _, c := range cases {
		if got := CategoryForScore(c.score, c.mandatory); got != c.want {
			t.Errorf("CategoryForScore(%v, %v) = %q, want %q", c.score, c.mandatory, got, c.want)
		}
	}
}

func TestScoreWeightsSumTo100(t *testing.T) {
	sum := WeightSkill + WeightExperience + WeightResponsibility + WeightEducation + WeightAddedValue
	if sum != 100 {
		t.Fatalf("weights sum = %v, want 100", sum)
	}
}

func TestValidateRole(t *testing.T) {
	for _, r := range []Role{RoleMahasiswa, RoleHRD, RoleProdi, RoleAdmin} {
		if !r.Valid() {
			t.Errorf("role %q should be valid", r)
		}
	}
	if (Role("dosen")).Valid() {
		t.Error("role dosen should be invalid")
	}
}

func TestEvidenceRequiresQuoteWhenFound(t *testing.T) {
	e := Evidence{Requirement: "React", Status: EvidenceTerpenuhi, Source: SourceCV, Quote: ""}
	if err := e.Validate(); err == nil {
		t.Error("expected error for Terpenuhi without quote")
	}
	e.Quote = "Membangun SPA dengan React di proyek PBL"
	if err := e.Validate(); err != nil {
		t.Errorf("unexpected error: %v", err)
	}
	bad := Evidence{Requirement: "SQL", Status: EvidenceStatus("X")}
	if err := bad.Validate(); err == nil {
		t.Error("expected error for unknown status")
	}
}

func TestMinKandidatEnforced(t *testing.T) {
	if MinKandidat != 10 {
		t.Fatalf("MinKandidat = %d, want 10", MinKandidat)
	}
	if MaxUploadBytes != 5*1024*1024 {
		t.Fatalf("MaxUploadBytes = %d, want 5MB", MaxUploadBytes)
	}
}

func TestWeightedTotalMatchesProposalExample(t *testing.T) {
	// Contoh proposal: 80, 70, 90, 80, 60 = 77.5, dibulatkan seperti computeScore.ts.
	if got := WeightedTotal([5]float64{80, 70, 90, 80, 60}); got != 78 {
		t.Fatalf("WeightedTotal = %v, want 78", got)
	}
	if got := WeightedTotal([5]float64{92, 80, 85, 90, 88}); got != 87 {
		t.Fatalf("WeightedTotal nadia = %v, want 87", got)
	}
}

func TestPeriode(t *testing.T) {
	cases := map[string]string{
		"2026-10-19": "Gasal 2026/2027",
		"2026-08-01": "Gasal 2026/2027",
		"2027-01-31": "Gasal 2026/2027",
		"2027-02-01": "Genap 2026/2027",
		"2026-07-31": "Genap 2025/2026",
	}
	for in, want := range cases {
		d, _ := time.Parse("2006-01-02", in)
		if got := Periode(d); got != want {
			t.Errorf("Periode(%s) = %q, want %q", in, got, want)
		}
	}
	now, _ := time.Parse("2006-01-02", "2026-10-19")
	if got := Angkatan(7, now); got != 2023 {
		t.Errorf("Angkatan(7) = %d, want 2023", got)
	}
}

func TestMatkulFor(t *testing.T) {
	cases := map[string]string{
		"SQL lanjutan":         "Basis Data Lanjut",
		"testing otomatis":     "Pengujian Perangkat Lunak",
		"Docker":               "Komputasi Awan",
		"Memasak rendang enak": "",
	}
	for in, want := range cases {
		if got := MatkulFor(in); got != want {
			t.Errorf("MatkulFor(%q) = %q, want %q", in, got, want)
		}
	}
}
