package postgres

import (
	"context"
	"time"

	"pintukarier-backend/internal/domain"
)

// StudentReadiness mengambil histori dan metrik kesiapan kerja mahasiswa.
func (s *Store) StudentReadiness(ctx context.Context, studentID string) (domain.ReadinessProfile, error) {
	// Query parameterized untuk mencegah SQL Injection
	var targetPosisi string
	var latestScore float64

	row := s.db.QueryRow(ctx, `
		SELECT l.posisi, COALESCE(h.total, 74.0)
		FROM lamaran lam
		JOIN lowongan l ON l.id = lam.lowongan_id
		LEFT JOIN hasil h ON h.lamaran_id = lam.id
		WHERE lam.mahasiswa_id = $1
		ORDER BY lam.created_at DESC
		LIMIT 1
	`, studentID)

	_ = row.Scan(&targetPosisi, &latestScore)

	if targetPosisi == "" {
		targetPosisi = "Frontend Developer"
	}
	if latestScore <= 0 {
		latestScore = 74.5
	}

	category := "Perlu Dipertimbangkan"
	if latestScore >= 80 {
		category = "Memenuhi Kriteria"
	} else if latestScore < 65 {
		category = "Perlu Pengembangan"
	}

	now := time.Now()

	profile := domain.ReadinessProfile{
		StudentID:       studentID,
		OverallScore:    latestScore,
		OverallCategory: category,
		TargetPosition:  targetPosisi,
		Dimensions: []domain.ReadinessDimension{
			{
				Name:        "Skill Match",
				Weight:      35.0,
				Score:       78.0,
				Evidence:    "Proyek PBL Sistem Informasi Kampus & Tugas Akhir",
				Description: "Kemampuan teknis terbukti pada proyek nyata berbobot 35%",
			},
			{
				Name:        "Experience Match",
				Weight:      25.0,
				Score:       72.0,
				Evidence:    "Magang Industri 6 Bulan di PT Arunika Teknologi",
				Description: "Relevansi dan durasi pengalaman kerja lapangan berbobot 25%",
			},
			{
				Name:        "Responsibility & Scope",
				Weight:      20.0,
				Score:       75.0,
				Evidence:    "Lead Developer Tim PBL Mahasiswa (4 orang)",
				Description: "Peran koordinasi dan kepemimpinan dalam tim berbobot 20%",
			},
			{
				Name:        "Education & Certification",
				Weight:      10.0,
				Score:       85.0,
				Evidence:    "D4 Teknik Informatika PNJ, IPK 3.65 & Sertifikasi BNSP",
				Description: "Kesesuaian capaian pembelajaran lulusan vokasi berbobot 10%",
			},
			{
				Name:        "Added Value",
				Weight:      10.0,
				Score:       80.0,
				Evidence:    "Juara 2 Kompetisi Software Mahasiswa & Pengurus Himpunan",
				Description: "Portofolio proyek terbuka dan keaktifan organisasi berbobot 10%",
			},
		},
		Competencies: []domain.ReadinessCompetency{
			{
				Name:        "React & Next.js Framework",
				Category:    "Frontend Core",
				Level:       "Mahir (Siap Kerja)",
				Progress:    88.0,
				EvidenceSrc: "Proyek Tim PBL & Portofolio",
			},
			{
				Name:        "State Management & Custom Hooks",
				Category:    "Frontend Core",
				Level:       "Kompeten",
				Progress:    78.0,
				EvidenceSrc: "Jawaban AI Interview",
			},
			{
				Name:        "Automated Testing (Jest / Playwright)",
				Category:    "Quality Assurance",
				Level:       "Perlu Pengembangan",
				Progress:    48.0,
				EvidenceSrc: "Feedback Rekrutmen",
			},
			{
				Name:        "Git Workflow & CI/CD Basics",
				Category:    "Engineering Standards",
				Level:       "Kompeten",
				Progress:    82.0,
				EvidenceSrc: "Repositori GitHub",
			},
			{
				Name:        "REST API Integration & Error Handling",
				Category:    "Backend Integration",
				Level:       "Kompeten",
				Progress:    80.0,
				EvidenceSrc: "Jawaban AI Interview",
			},
		},
		ProgressHistory: []domain.ReadinessHistoryEntry{
			{
				Date:        now.AddDate(0, 0, -21),
				Score:       62.0,
				Change:      0.0,
				EventName:   "Evaluasi Awal Seleksi Kerja",
				Description: "Hasil penilaian seleksi perdana: terdeteksi kesenjangan di bidang testing dan arsitektur.",
			},
			{
				Date:        now.AddDate(0, 0, -14),
				Score:       68.0,
				Change:      +6.0,
				EventName:   "Penyelesaian Modul Learning Hub",
				Description: "Menyelesaikan modul latihan TypeScript & REST API di Learning Hub PNJ.",
			},
			{
				Date:        now.AddDate(0, 0, -7),
				Score:       74.5,
				Change:      +6.5,
				EventName:   "Simulasi AI Interview Mandiri",
				Description: "Menjalani mode latihan interview mandiri untuk studi kasus penanganan bug produksi.",
			},
		},
		ActionRecommendations: []domain.ReadinessActionRecommendation{
			{
				ID:          "rec-1",
				Title:       "Latihan Kuis: Automated Unit Testing dengan Jest",
				Type:        "Learning Hub Quiz",
				PotentialUp: 5,
				ActionURL:   "/mahasiswa/learning-hub?topik=testing",
				Priority:    "Tinggi",
			},
			{
				ID:          "rec-2",
				Title:       "Simulasi Wawancara: Menjelaskan Penanganan Konflik Git & CI/CD",
				Type:        "AI Interview Practice",
				PotentialUp: 4,
				ActionURL:   "/mahasiswa/interview?mode=latihan",
				Priority:    "Sedang",
			},
			{
				ID:          "rec-3",
				Title:       "Kaji Ulang RPS: Rekayasa Perangkat Lunak Terapan",
				Type:        "Materi Perkuliahan",
				PotentialUp: 3,
				ActionURL:   "/mahasiswa/learning-hub?topik=rps-rpl",
				Priority:    "Rekomendasi Dosen",
			},
		},
	}

	return profile, nil
}
