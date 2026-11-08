package usecase

import "testing"

func sampleRanking() map[string]map[string]Ranking {
	return map[string]map[string]Ranking{
		"Gasal 2026/2027": {
			"Software Developer": {N: 118, Items: []RankItem{{Kompetensi: "Testing otomatis", Pct: 71}}},
			"QA & Testing":       {N: 8, Items: []RankItem{{Kompetensi: "Testing otomatis", Pct: 75}}},
			"Batas":              {N: 10, Items: []RankItem{{Kompetensi: "SQL", Pct: 50}}},
			"Bawah":              {N: 9, Items: []RankItem{{Kompetensi: "SQL", Pct: 50}}},
		},
	}
}

func TestFilterRankingHidesUnder10(t *testing.T) {
	out := FilterRanking(sampleRanking())
	gasal := out["Gasal 2026/2027"]
	if _, ok := gasal["QA & Testing"]; ok {
		t.Error("n=8 should be hidden")
	}
	if _, ok := gasal["Bawah"]; ok {
		t.Error("n=9 should be hidden")
	}
	if _, ok := gasal["Software Developer"]; !ok {
		t.Error("n=118 should be visible")
	}
	if _, ok := gasal["Batas"]; !ok {
		t.Error("n=10 should be visible")
	}
}

func TestFilterRankingKeepsAggregateOnly(t *testing.T) {
	out := FilterRanking(sampleRanking())
	item := out["Gasal 2026/2027"]["Software Developer"].Items[0]
	if item.Kompetensi == "" || item.Pct == 0 {
		t.Fatal("expected aggregate kompetensi and pct")
	}
}
