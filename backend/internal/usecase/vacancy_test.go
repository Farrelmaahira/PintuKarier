package usecase

import (
	"testing"

	"pintukarier-backend/internal/domain"
)

func sampleVacancy() domain.Vacancy {
	return domain.Vacancy{Title: "Backend Intern", Company: "Mitra A", Position: "Software Developer", Type: "Magang", CreatedBy: "hr-1", Required: []string{" Go ", ""}}
}

func TestCreateVacancyValid(t *testing.T) {
	v, err := CreateVacancy(sampleVacancy())
	if err != nil {
		t.Fatalf("CreateVacancy: %v", err)
	}
	if v.ID == "" || len(v.Required) != 1 || v.Required[0] != "Go" || len(v.Prescreen) != domain.JumlahPertanyaan {
		t.Fatalf("vacancy = %+v", v)
	}
}

func TestCreateVacancyRejectsInvalid(t *testing.T) {
	cases := []func(*domain.Vacancy){
		func(v *domain.Vacancy) { v.Title = " " },
		func(v *domain.Vacancy) { v.Company = "" },
		func(v *domain.Vacancy) { v.Position = "" },
		func(v *domain.Vacancy) { v.Type = "Freelance" },
		func(v *domain.Vacancy) { v.Required = []string{" "} },
	}
	for i, mutate := range cases {
		v := sampleVacancy()
		mutate(&v)
		if _, err := CreateVacancy(v); err == nil {
			t.Errorf("case %d: expected error", i)
		}
	}
}

func TestApplySetsInitialStage(t *testing.T) {
	a, err := Apply("vac-1", "mhs-1")
	if err != nil {
		t.Fatalf("Apply: %v", err)
	}
	if a.Stage != domain.StageApplied {
		t.Fatalf("stage = %q, want applied", a.Stage)
	}
}

func TestApplyRejectsEmptyIDs(t *testing.T) {
	if _, err := Apply("", "mhs-1"); err == nil {
		t.Error("expected error for empty vacancy id")
	}
	if _, err := Apply("vac-1", ""); err == nil {
		t.Error("expected error for empty student id")
	}
}

func TestUpdateVacancy(t *testing.T) {
	v := sampleVacancy()
	v.ID = "low-1"
	got, err := UpdateVacancy(v)
	if err != nil {
		t.Fatalf("UpdateVacancy: %v", err)
	}
	if got.ID != "low-1" || got.Title != "Backend Intern" || len(got.Required) != 1 || got.Required[0] != "Go" {
		t.Fatalf("vacancy = %+v", got)
	}
	cases := map[string]func(*domain.Vacancy){
		"tanpa id":     func(v *domain.Vacancy) { v.ID = "" },
		"tipe salah":   func(v *domain.Vacancy) { v.Type = "Paruh waktu" },
		"tanpa syarat": func(v *domain.Vacancy) { v.Required = []string{" "} },
	}
	for name, mutate := range cases {
		bad := v
		mutate(&bad)
		if _, err := UpdateVacancy(bad); err == nil {
			t.Errorf("%s: want error", name)
		}
	}
}
