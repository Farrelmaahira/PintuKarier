package postgres

import (
	"context"
	"encoding/json"
	"os"
	"regexp"
	"strings"
	"testing"

	"pintukarier-backend/internal/domain"
	"pintukarier-backend/internal/usecase"
)

func TestProductionAccountsFromEnv_Missing(t *testing.T) {
	env := map[string]string{}
	_, err := ProductionAccountsFromEnv(func(k string) string { return env[k] })
	if err == nil {
		t.Fatal("expected error for empty env")
	}
}

func TestProductionAccountsFromEnv_Valid(t *testing.T) {
	env := map[string]string{
		"PROD_ADMIN_EMAIL":     "admin@pintukarier.id",
		"PROD_ADMIN_PASSWORD":  "AdminSecret123!",
		"PROD_ADMIN_NAMA":      "Admin Prod",
		"PROD_HRD_EMAIL":       "hrd@mitra.id",
		"PROD_HRD_PASSWORD":    "HrdSecret123!",
		"PROD_HRD_NAMA":        "HRD Prod",
		"PROD_PRODI_EMAIL":     "prodi@kampus.id",
		"PROD_PRODI_PASSWORD":  "ProdiSecret123!",
		"PROD_PRODI_NAMA":      "Prodi Prod",
		"PROD_MAHASISWA_EMAIL": "mhs@kampus.id",
		"PROD_MAHASISWA_PASSWORD": "MhsSecret123!",
		"PROD_MAHASISWA_NAMA":  "Mhs Prod",
	}

	accs, err := ProductionAccountsFromEnv(func(k string) string { return env[k] })
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if len(accs) != 4 {
		t.Fatalf("expected 4 accounts, got %d", len(accs))
	}
}

func TestSeedProduction(t *testing.T) {
	s := testStore(t)
	ctx := context.Background()

	suffix := usecase.NewID("")
	accounts := []SeedAccount{
		{
			Role:        domain.RoleAdmin,
			Email:       "admin" + suffix + "@pintukarier.id",
			Password:    "password123",
			Nama:        "Admin Test",
			Institution: "Pintu Karier",
		},
		{
			Role:        domain.RoleHRD,
			Email:       "hrd" + suffix + "@mitra.id",
			Password:    "password123",
			Nama:        "HRD Test",
			Institution: "PT Mitra",
		},
		{
			Role:        domain.RoleProdi,
			Email:       "prodi" + suffix + "@kampus.id",
			Password:    "password123",
			Nama:        "Prodi Test",
			Institution: "D4 TI",
		},
		{
			Role:        domain.RoleMahasiswa,
			Email:       "mhs" + suffix + "@kampus.id",
			Password:    "password123",
			Nama:        "Mhs Test",
			Institution: "D4 TI",
			NIM:         "210001",
			Campus:      "Politeknik",
			Semester:    7,
			IPK:         3.90,
		},
	}

	if err := SeedProduction(ctx, s, accounts); err != nil {
		t.Fatalf("SeedProduction error: %v", err)
	}

	// Idempoten: run again without error
	if err := SeedProduction(ctx, s, accounts); err != nil {
		t.Fatalf("SeedProduction second run must be idempotent: %v", err)
	}

	for _, a := range accounts {
		u, err := s.UserByEmail(ctx, a.Email)
		if err != nil {
			t.Fatalf("user %s not found: %v", a.Email, err)
		}
		if u.Role != a.Role {
			t.Fatalf("expected role %s, got %s", a.Role, u.Role)
		}
		if !usecase.CheckPassword(u.PasswordHash, a.Password) {
			t.Fatalf("password check failed for %s", a.Email)
		}
	}
}

func TestSeedProductionSQL_Contains5Students(t *testing.T) {
	content, err := os.ReadFile("../../../scripts/seed_production.sql")
	if err != nil {
		t.Fatalf("gagal membaca seed_production.sql: %v", err)
	}
	sqlStr := string(content)
	expectedIDs := []string{
		"u-prod-mahasiswa",
		"u-prod-mahasiswa-2",
		"u-prod-mahasiswa-3",
		"u-prod-mahasiswa-4",
		"u-prod-mahasiswa-5",
	}
	for _, id := range expectedIDs {
		if !strings.Contains(sqlStr, id) {
			t.Errorf("seed_production.sql tidak memuat mahasiswa ID: %s", id)
		}
	}
}

func TestSeedProductionSQL_ContainsVacancies(t *testing.T) {
	content, err := os.ReadFile("../../../scripts/seed_production.sql")
	if err != nil {
		t.Fatalf("gagal membaca seed_production.sql: %v", err)
	}
	sqlStr := string(content)
	expectedVacancies := []string{
		"low-prod-fe",
		"low-prod-be",
		"low-prod-qa",
	}
	for _, id := range expectedVacancies {
		if !strings.Contains(sqlStr, id) {
			t.Errorf("seed_production.sql tidak memuat lowongan ID: %s", id)
		}
	}
}

func TestSeedProductionSQL_ContainsApplications(t *testing.T) {
	content, err := os.ReadFile("../../../scripts/seed_production.sql")
	if err != nil {
		t.Fatalf("gagal membaca seed_production.sql: %v", err)
	}
	sqlStr := string(content)
	expectedApps := []string{
		"lam-prod-1",
		"lam-prod-2",
		"lam-prod-3",
		"lam-prod-4",
		"lam-prod-5",
	}
	for _, id := range expectedApps {
		if !strings.Contains(sqlStr, id) {
			t.Errorf("seed_production.sql tidak memuat lamaran ID: %s", id)
		}
	}
}

func TestSeedProductionSQL_JSONAndReferencesValidity(t *testing.T) {
	content, err := os.ReadFile("../../../scripts/seed_production.sql")
	if err != nil {
		t.Fatalf("gagal membaca seed_production.sql: %v", err)
	}
	sqlStr := string(content)

	// Validasi semua literal JSONB dalam format '...'::jsonb
	reJSON := regexp.MustCompile(`'(\{[\s\S]*?\}|\[[\s\S]*?\])'::jsonb`)
	matches := reJSON.FindAllStringSubmatch(sqlStr, -1)
	if len(matches) == 0 {
		t.Fatal("tidak ada literal jsonb yang ditemukan untuk divalidasi")
	}

	for _, m := range matches {
		rawJSON := m[1]
		var v any
		if err := json.Unmarshal([]byte(rawJSON), &v); err != nil {
			t.Errorf("invalid JSONB literal dalam seed_production.sql:\n%s\nError: %v", rawJSON, err)
		}
	}

	// Validasi bahwa seluruh lowongan merujuk ke u-prod-hrd yang ada
	if !strings.Contains(sqlStr, "'u-prod-hrd'") {
		t.Error("seed_production.sql harus memuat HRD u-prod-hrd")
	}

	// Validasi bahwa tahap lamaran sesuai domain.ApplicationStage
	validStages := map[string]bool{
		string(domain.StageApplied):      true,
		string(domain.StageUploaded):     true,
		string(domain.StageProfile):      true,
		string(domain.StagePrescreening): true,
		string(domain.StageInterview):    true,
		string(domain.StageScored):       true,
		string(domain.StageDecided):      true,
	}

	reStages := regexp.MustCompile(`'(interview_done|prescreening_done|scored|cv_uploaded|applied)'`)
	stageMatches := reStages.FindAllStringSubmatch(sqlStr, -1)
	if len(stageMatches) < 5 {
		t.Errorf("diharapkan minimal 5 tahapan lamaran yang valid, ditemukan %d", len(stageMatches))
	}
	for _, sm := range stageMatches {
		if !validStages[sm[1]] {
			t.Errorf("tahap lamaran tidak dikenal: %s", sm[1])
		}
	}
}

func TestSeedProductionSQL_IdempotentExecution(t *testing.T) {
	s := testStore(t)
	ctx := context.Background()

	content, err := os.ReadFile("../../../scripts/seed_production.sql")
	if err != nil {
		t.Fatalf("gagal membaca file seed_production.sql: %v", err)
	}

	// Eksekusi pertama
	if _, err := s.db.Exec(ctx, string(content)); err != nil {
		t.Fatalf("eksekusi pertama seed_production.sql gagal: %v", err)
	}

	// Eksekusi kedua (harus idempoten tanpa error)
	if _, err := s.db.Exec(ctx, string(content)); err != nil {
		t.Fatalf("eksekusi kedua seed_production.sql (idempoten) gagal: %v", err)
	}
}



