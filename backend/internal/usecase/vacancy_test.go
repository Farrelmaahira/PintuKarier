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
