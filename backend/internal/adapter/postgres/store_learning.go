package postgres

import (
	"context"
	"strings"

	"pintukarier-backend/internal/domain"
)

// StudentLearning mengambil modul pembelajaran adaptif dan drill aktif mahasiswa.
func (s *Store) StudentLearning(ctx context.Context, studentID string) (domain.LearningOverview, error) {
	// Query parameterized untuk mengecek jurusan/target lamaran mahasiswa
	var userProdi string
	err := s.db.QueryRow(ctx, `
		SELECT COALESCE(prodi, 'Teknik Informatika')
		FROM pengguna
		WHERE id = $1
	`, studentID).Scan(&userProdi)
	if err != nil {
		userProdi = "Teknik Informatika"
	}

	modules := []domain.LearningModule{
		{
			ID:                  "mod-sql-indexing",
			Title:               "Optimasi Kueri PostgreSQL & Indexing B-Tree",
			Category:            "Database",
			Difficulty:          "Menengah",
			DurationMinutes:     45,
			Summary:             "Pahami cara kerja EXPLAIN ANALYZE, indeks komposit, dan pencegahan sequential scan pada dataset skala besar.",
			CompetenciesCovered: []string{"PostgreSQL", "Database Indexing", "Query Optimization"},
			EstimatedGain:       8,
			Status:              "recommended",
			ExternalResourceURL: "https://www.postgresql.org/docs/current/indexes-types.html",
		},
		{
			ID:                  "mod-clean-arch",
			Title:               "Arsitektur Bersih & Boundary Ports-Adapters",
			Category:            "Arsitektur Sistem",
			Difficulty:          "Lanjutan",
			DurationMinutes:     60,
			Summary:             "Pisahkan logika domain dari HTTP dan framework database agar sistem modular, mudah diuji, dan minim coupling.",
			CompetenciesCovered: []string{"Clean Architecture", "Hexagonal Architecture", "Domain Modeling"},
			EstimatedGain:       10,
			Status:              "in_progress",
			ExternalResourceURL: "https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html",
		},
		{
			ID:                  "mod-docker-ci",
			Title:               "Containerization Multi-Stage & Orchestration Docker",
			Category:            "Cloud & DevOps",
			Difficulty:          "Menengah",
			DurationMinutes:     40,
			Summary:             "Bangun image Docker yang ramping dan aman dengan multi-stage builds untuk Golang dan Node.js vokasi.",
			CompetenciesCovered: []string{"Docker", "Container Security", "CI/CD Pipeline"},
			EstimatedGain:       6,
			Status:              "recommended",
			ExternalResourceURL: "https://docs.docker.com/build/building/multi-stage/",
		},
		{
			ID:                  "mod-api-security",
			Title:               "Proteksi API: HMAC Signing, Rate Limiting & OWASP",
			Category:            "Keamanan Sistem",
			Difficulty:          "Lanjutan",
			DurationMinutes:     50,
			Summary:             "Cegah kerentanan IDOR, Mass Assignment, dan serangan brute-force dengan middleware keamanan standar industri.",
			CompetenciesCovered: []string{"API Security", "OWASP Top 10", "HMAC Auth", "IDOR Prevention"},
			EstimatedGain:       9,
			Status:              "recommended",
			ExternalResourceURL: "https://owasp.org/www-project-api-security/",
		},
		{
			ID:                  "mod-tech-collab",
			Title:               "Komunikasi Teknis & Code Review Asinkron",
			Category:            "Soft Skill & Kolaborasi",
			Difficulty:          "Dasar",
			DurationMinutes:     30,
			Summary:             "Teknik merumuskan Pull Request yang jelas, memfasilitasi review kode berbobot, dan dokumentasi arsitektur.",
			CompetenciesCovered: []string{"Technical Communication", "Git Workflow", "Code Review"},
			EstimatedGain:       5,
			Status:              "completed",
			ExternalResourceURL: "https://google.github.io/eng-practices/review/",
		},
	}

	drills := []domain.LearningDrill{
		{
			ID:               "drill-pg-perf",
			ModuleID:         "mod-sql-indexing",
			Scenario:         "Tabel lamaran telah memiliki 500.000 baris. Kueri pencarian berdasarkan mahasiswa_id dan created_at mengalami lonjakan latency hingga 850ms.",
			ProblemStatement: "Indeks manakah yang paling efektif dan hemat I/O untuk mempercepat kueri tersebut?",
			Options: []domain.LearningDrillOption{
				{Index: 0, Text: "Membuat dua single-column index terpisah pada mahasiswa_id dan created_at."},
				{Index: 1, Text: "Membuat composite index (mahasiswa_id, created_at DESC) agar matching equality dan sorting terlayani dalam satu index scan."},
				{Index: 2, Text: "Menjalankan VACUUM FULL pada tabel lamaran secara berkala setiap 5 menit."},
				{Index: 3, Text: "Menghapus constraint foreign key agar insert dan read tidak memeriksa integritas data."},
			},
			CorrectIndex:     1,
			Explanation:      "Composite index (mahasiswa_id, created_at DESC) memungkinkan PostgreSQL melakukan Index Scan langsung untuk filter equality mahasiswa_id sekaligus urutan created_at tanpa sorting tambahan di memori.",
			ReadinessBoost:   8,
			TargetCompetency: "PostgreSQL Optimization",
		},
		{
			ID:               "drill-clean-boundary",
			ModuleID:         "mod-clean-arch",
			Scenario:         "Seorang engineer memanggil langsung sql.DB.Exec('INSERT INTO ...') di dalam fungsi handler HTTP gin/net-http controller.",
			ProblemStatement: "Prinsip clean architecture mana yang dilanggar dan bagaimana refaktor yang tepat?",
			Options: []domain.LearningDrillOption{
				{Index: 0, Text: "Tidak ada pelanggaran; memanggil SQL langsung di handler mempercepat waktu respons API."},
				{Index: 1, Text: "Pelanggaran Separation of Concerns; HTTP handler harus memanggil port Usecase, dan operasi persistensi diisolasi di package Adapter/Postgres."},
				{Index: 2, Text: "Handler harus diubah menjadi class abstract agar mendukung pewarisan bertingkat."},
				{Index: 3, Text: "Cukup menambahkan komentar dokumentasi di atas pemanggilan SQL."},
			},
			CorrectIndex:     1,
			Explanation:      "Dalam Clean Architecture, presentation layer (HTTP) tidak boleh bergantung langsung pada persistensi (SQL). Alur dependensi harus mengarah ke dalam melalui antarmuka (ports).",
			ReadinessBoost:   10,
			TargetCompetency: "Clean Architecture",
		},
	}

	recommendedCategory := "Database & Arsitektur Sistem"
	if strings.Contains(strings.ToLower(userProdi), "elektro") {
		recommendedCategory = "Embedded Systems & API IoT"
	} else if strings.Contains(strings.ToLower(userProdi), "akuntansi") {
		recommendedCategory = "Financial Data & Audit Trail"
	}

	return domain.LearningOverview{
		StudentID:           studentID,
		TotalModules:        len(modules),
		CompletedModules:    1,
		InProgressModules:   1,
		TotalScoreBoost:     15,
		RecommendedCategory: recommendedCategory,
		Modules:             modules,
		ActiveDrills:        drills,
	}, nil
}

// SubmitDrill mengevaluasi jawaban drill interaktif dan mengembalikan perolehan skor.
func (s *Store) SubmitDrill(ctx context.Context, studentID, drillID string, optionIndex int) (domain.DrillSubmissionResult, error) {
	// Evaluasi jawaban berdasarkan drillID
	var correctIndex int
	var boost int
	var explanation string

	switch drillID {
	case "drill-pg-perf":
		correctIndex = 1
		boost = 8
		explanation = "Tepat! Composite index (mahasiswa_id, created_at DESC) mengeliminasi in-memory sort dan mengurangi buffer reads secara signifikan."
	case "drill-clean-boundary":
		correctIndex = 1
		boost = 10
		explanation = "Tepat! Mengisolasi akses SQL ke adapter/postgres melindungi layer aplikasi dan mempermudah unit testing dengan mock store."
	default:
		correctIndex = 0
		boost = 5
		explanation = "Analisis kasus telah dievaluasi dengan baik."
	}

	isCorrect := optionIndex == correctIndex
	pointsEarned := 0
	if isCorrect {
		pointsEarned = boost
	}

	// Update simulasi perolehan skor
	return domain.DrillSubmissionResult{
		IsCorrect:       isCorrect,
		PointsEarned:    pointsEarned,
		Explanation:     explanation,
		NewOverallScore: 78 + pointsEarned,
	}, nil
}
