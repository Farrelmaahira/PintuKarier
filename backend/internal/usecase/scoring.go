package usecase

import (
	"errors"
	"sort"

	"pintukarier-backend/internal/domain"
)

// BuildScore rakit skor hanya jika evidence lengkap. Tanpa evidence tolak.
// Total pakai bobot Tabel 1; syarat wajib tanpa bukti memaksa Tidak Memenuhi Syarat.
func BuildScore(candidateID string, dims [5]float64, evidences []domain.Evidence) (domain.CandidateScore, error) {
	if candidateID == "" {
		return domain.CandidateScore{}, errors.New("candidate id wajib diisi")
	}
	if len(evidences) == 0 {
		return domain.CandidateScore{}, errors.New("skor wajib sertakan daftar evidence")
	}
	missing := false
	for _, e := range evidences {
		if err := e.Validate(); err != nil {
			return domain.CandidateScore{}, err
		}
		if e.Mandatory && e.Status == domain.EvidenceTidakDitemukan {
			missing = true
		}
	}
	scores := make([]domain.DimensionScore, len(dims))
	for i, d := range dims {
		scores[i] = domain.DimensionScore{Name: domain.DimensionNames[i], Weight: domain.Weights[i], Score: d}
	}
	total := domain.WeightedTotal(dims)
	return domain.CandidateScore{
		CandidateID:      candidateID,
		Total:            total,
		Category:         domain.CategoryForScore(total, missing),
		MandatoryMissing: missing,
		Dimensions:       scores,
		Evidences:        evidences,
	}, nil
}

var sourceFromAI = map[string]domain.EvidenceSource{
	"CV":            domain.SourceCV,
	"Pre-screening": domain.SourcePrescreening,
	"AI Interview":  domain.SourceInterview,
}

// ScoreFromAI rakit skor dari hasil AI Engine. Engine hanya kirim skor per
// dimensi dan bukti; bobot, total, cek wajib, dan kategori diputuskan di sini.
func ScoreFromAI(candidateID string, r ScoreResult) (domain.CandidateScore, error) {
	if len(r.Dimensi) != 5 {
		return domain.CandidateScore{}, errors.New("AI Engine wajib kirim 5 skor dimensi")
	}
	var dims [5]float64
	copy(dims[:], r.Dimensi)
	evidences := make([]domain.Evidence, 0, len(r.Bukti))
	for _, b := range r.Bukti {
		e := domain.Evidence{Requirement: b.Syarat, Status: domain.EvidenceStatus(b.Status), Mandatory: b.Wajib, Baseline: b.Dasar}
		if b.Kutipan != nil {
			e.Quote = *b.Kutipan
		}
		if b.Sumber != nil {
			e.Source = sourceFromAI[*b.Sumber]
		}
		evidences = append(evidences, e)
	}
	return BuildScore(candidateID, dims, evidences)
}

func AggregateRanking(rows []RankRow) map[string]map[string]Ranking {
	// shortcut: dikelompokkan per teks syarat persis, normalisasi semantik antar lowongan menyusul.
	groups := map[string]map[string][][]domain.Evidence{}
	for _, r := range rows {
		p := domain.Periode(r.CreatedAt)
		if groups[p] == nil {
			groups[p] = map[string][][]domain.Evidence{}
		}
		groups[p][r.Position] = append(groups[p][r.Position], r.Evidences)
		groups[p][SemuaPosisi] = append(groups[p][SemuaPosisi], r.Evidences)
	}
	out := map[string]map[string]Ranking{}
	for p, byPos := range groups {
		out[p] = map[string]Ranking{}
		for pos, list := range byPos {
			out[p][pos] = aggregate(list)
		}
	}
	return out
}

// SemuaPosisi kunci gabungan semua posisi, sama dengan POSISI[0] di frontend.
const SemuaPosisi = "Semua posisi"

func aggregate(perKandidat [][]domain.Evidence) Ranking {
	miss := map[string]int{}
	for _, evidences := range perKandidat {
		seen := map[string]bool{}
		for _, e := range evidences {
			if !e.Baseline && e.Status == domain.EvidenceTidakDitemukan && !seen[e.Requirement] {
				seen[e.Requirement] = true
				miss[e.Requirement]++
			}
		}
	}
	r := Ranking{N: len(perKandidat)}
	for k, c := range miss {
		r.Items = append(r.Items, RankItem{Kompetensi: k, Pct: float64(c*100) / float64(r.N)})
	}
	sort.Slice(r.Items, func(i, j int) bool {
		if r.Items[i].Pct != r.Items[j].Pct {
			return r.Items[i].Pct > r.Items[j].Pct
		}
		return r.Items[i].Kompetensi < r.Items[j].Kompetensi
	})
	for i := range r.Items {
		r.Items[i].Pct = float64(int(r.Items[i].Pct + 0.5))
	}
	return r
}
