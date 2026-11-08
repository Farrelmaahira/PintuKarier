package usecase

import (
	"testing"
	"time"

	"pintukarier-backend/internal/domain"
)

func validEvidence() []domain.Evidence {
	return []domain.Evidence{
		{Requirement: "React", Status: domain.EvidenceTerpenuhi, Source: domain.SourceCV, Quote: "Membangun SPA React di PBL", Mandatory: true},
	}
}

func TestBuildScoreRejectsEmptyEvidence(t *testing.T) {
	if _, err := BuildScore("c-1", [5]float64{85, 85, 85, 85, 85}, nil); err == nil {
		t.Fatal("expected error for score without evidence")
	}
}

func TestBuildScoreRejectsInvalidEvidence(t *testing.T) {
	ev := []domain.Evidence{{Requirement: "SQL", Status: domain.EvidenceTerpenuhi, Source: domain.SourceCV, Quote: ""}}
	if _, err := BuildScore("c-1", [5]float64{85, 85, 85, 85, 85}, ev); err == nil {
		t.Fatal("expected error for evidence without quote")
	}
}

func TestBuildScoreMandatoryOverridesTotal(t *testing.T) {
	ev := append(validEvidence(), domain.Evidence{Requirement: "Git", Status: domain.EvidenceTidakDitemukan, Mandatory: true})
	s, err := BuildScore("c-1", [5]float64{99, 99, 99, 99, 99}, ev)
	if err != nil {
		t.Fatalf("BuildScore: %v", err)
	}
	if !s.MandatoryMissing || s.Category != domain.CategoryTidakMemenuhi {
		t.Fatalf("category = %q, want Tidak Memenuhi Syarat", s.Category)
	}
}

func strp(s string) *string { return &s }

func TestScoreFromAIWeightsAndCategory(t *testing.T) {
	r := ScoreResult{
		Dimensi: []float64{100, 100, 100, 100, 100},
		Bukti:   []AIBukti{{Syarat: "React", Wajib: true, Status: "Terpenuhi", Kutipan: strp("Membangun SPA React"), Sumber: strp("CV")}},
	}
	s, err := ScoreFromAI("lam-1", r)
	if err != nil {
		t.Fatalf("ScoreFromAI: %v", err)
	}
	if s.Total != 100 || s.Category != domain.CategoryMemenuhi {
		t.Fatalf("total %v kategori %q, want 100 Memenuhi", s.Total, s.Category)
	}
	if s.Evidences[0].Source != domain.SourceCV || !s.Evidences[0].Mandatory {
		t.Fatalf("evidence = %+v", s.Evidences[0])
	}

	r.Dimensi = []float64{80, 60, 70, 50, 40}
	s, _ = ScoreFromAI("lam-1", r)
	// 80*.35 + 60*.25 + 70*.20 + 50*.10 + 40*.10 = 66
	if s.Total != 66 || s.Category != domain.CategoryDipertimbangkan {
		t.Fatalf("total %v kategori %q, want 66 Perlu Dipertimbangkan", s.Total, s.Category)
	}
}

func TestScoreFromAIMandatoryMissing(t *testing.T) {
	r := ScoreResult{
		Dimensi: []float64{95, 95, 95, 95, 95},
		Bukti: []AIBukti{
			{Syarat: "React", Wajib: true, Status: "Terpenuhi", Kutipan: strp("SPA React"), Sumber: strp("CV")},
			{Syarat: "Git", Wajib: true, Status: "Tidak ditemukan"},
		},
	}
	s, err := ScoreFromAI("lam-1", r)
	if err != nil {
		t.Fatalf("ScoreFromAI: %v", err)
	}
	if s.Category != domain.CategoryTidakMemenuhi {
		t.Fatalf("kategori %q, want Tidak Memenuhi Syarat", s.Category)
	}
}

func TestScoreFromAIRejectsBadShape(t *testing.T) {
	if _, err := ScoreFromAI("lam-1", ScoreResult{Dimensi: []float64{1, 2}}); err == nil {
		t.Fatal("expected error for wrong dimension count")
	}
	if _, err := ScoreFromAI("lam-1", ScoreResult{Dimensi: []float64{1, 2, 3, 4, 5}}); err == nil {
		t.Fatal("expected error for score without evidence")
	}
}

func TestAggregateRanking(t *testing.T) {
	okt := time.Date(2026, 10, 1, 0, 0, 0, 0, time.UTC)
	miss := domain.Evidence{Requirement: "Testing", Status: domain.EvidenceTidakDitemukan}
	dasar := domain.Evidence{Requirement: "Prestasi", Status: domain.EvidenceTidakDitemukan, Baseline: true}
	ok := domain.Evidence{Requirement: "React", Status: domain.EvidenceTerpenuhi, Quote: "q"}
	rows := []RankRow{
		{okt, "Software Developer", []domain.Evidence{miss, ok, dasar}},
		{okt, "Software Developer", []domain.Evidence{miss, ok}},
		{okt, "Software Developer", []domain.Evidence{ok}},
		{okt, "QA & Testing", []domain.Evidence{ok}},
	}
	got := AggregateRanking(rows)["Gasal 2026/2027"]
	sd := got["Software Developer"]
	if sd.N != 3 || len(sd.Items) != 1 || sd.Items[0] != (RankItem{Kompetensi: "Testing", Pct: 67}) {
		t.Fatalf("software developer = %+v", sd)
	}
	if all := got[SemuaPosisi]; all.N != 4 || all.Items[0].Pct != 50 {
		t.Fatalf("semua posisi = %+v", all)
	}
}
