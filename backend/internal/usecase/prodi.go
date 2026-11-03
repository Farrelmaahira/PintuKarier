package usecase

import "pintukarier-backend/internal/domain"

// RankItem hanya bawa nama kompetensi dan persen gagal. Tanpa nama mahasiswa.
type RankItem struct {
	Kompetensi string
	Pct        float64
}

// Ranking satu irisan periode dan posisi.
type Ranking struct {
	N     int
	Items []RankItem
}

// FilterRanking tegakkan MinKandidat di server. Grup kecil hilang total.
func FilterRanking(in map[string]map[string]Ranking) map[string]map[string]Ranking {
	out := map[string]map[string]Ranking{}
	for periode, byPosisi := range in {
		kept := map[string]Ranking{}
		for posisi, r := range byPosisi {
			if r.N < domain.MinKandidat {
				continue
			}
			kept[posisi] = r
		}
		if len(kept) > 0 {
			out[periode] = kept
		}
	}
	return out
}
