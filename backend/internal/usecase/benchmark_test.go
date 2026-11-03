package usecase

import (
	"context"
	"errors"
	"testing"
	"time"
)

type benchStore struct {
	Store
	rows []ModelBenchmark
	at   time.Time
}

func (s *benchStore) LatestBenchmark(context.Context) ([]ModelBenchmark, time.Time, error) {
	return s.rows, s.at, nil
}
func (s *benchStore) SaveBenchmark(_ context.Context, rows []ModelBenchmark) error {
	s.rows, s.at = rows, time.Now()
	return nil
}

type benchAI struct {
	AIService
	calls int
	err   error
}

func (a *benchAI) Benchmark(context.Context) ([]ModelBenchmark, error) {
	a.calls++
	return []ModelBenchmark{{Fitur: "Ekstraksi CV", Nama: "Groq · baru"}}, a.err
}

func TestRefreshBenchmark(t *testing.T) {
	now := time.Now()
	lama := []ModelBenchmark{{Fitur: "Ekstraksi CV", Nama: "Groq · lama"}}
	cases := []struct {
		name      string
		rows      []ModelBenchmark
		at        time.Time
		aiErr     error
		wantCalls int
		wantNama  string
		wantErr   bool
	}{
		{"belum pernah diukur", nil, time.Time{}, nil, 1, "Groq · baru", false},
		{"masih segar", lama, now.Add(-time.Hour), nil, 0, "Groq · lama", false},
		{"sudah usang", lama, now.Add(-BenchmarkMaxAge - time.Minute), nil, 1, "Groq · baru", false},
		{"gagal tidak menimpa hasil lama", lama, now.Add(-BenchmarkMaxAge - time.Minute), errors.New("AI Engine mati"), 1, "Groq · lama", true},
	}
	for _, c := range cases {
		t.Run(c.name, func(t *testing.T) {
			store, ai := &benchStore{rows: c.rows, at: c.at}, &benchAI{err: c.aiErr}
			err := RefreshBenchmark(context.Background(), store, ai, now)
			if (err != nil) != c.wantErr || ai.calls != c.wantCalls {
				t.Fatalf("err=%v calls=%d, want err=%v calls=%d", err, ai.calls, c.wantErr, c.wantCalls)
			}
			if len(store.rows) != 1 || store.rows[0].Nama != c.wantNama {
				t.Fatalf("hasil tersimpan = %+v, want %s", store.rows, c.wantNama)
			}
		})
	}
}
