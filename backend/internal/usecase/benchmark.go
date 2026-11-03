package usecase

import (
	"context"
	"log/slog"
	"time"
)

// BenchmarkMaxAge umur hasil benchmark sebelum diukur ulang.
const BenchmarkMaxAge = 6 * time.Hour

// RefreshBenchmark ukur ulang lewat AI Engine kalau hasil tersimpan kosong atau lebih tua dari BenchmarkMaxAge.
// Pengukuran yang gagal tidak menimpa hasil lama.
// shortcut: dua instance Cloud Run bisa mengukur bersamaan; hasilnya sama saja, tambahkan advisory lock
// kalau kuota provider mulai terasa.
func RefreshBenchmark(ctx context.Context, store Store, ai AIService, now time.Time) error {
	rows, measuredAt, err := store.LatestBenchmark(ctx)
	if err != nil {
		return err
	}
	if len(rows) > 0 && now.Sub(measuredAt) < BenchmarkMaxAge {
		return nil
	}
	fresh, err := ai.Benchmark(ctx)
	if err != nil {
		return err
	}
	return store.SaveBenchmark(ctx, fresh)
}

// RunBenchmarkRefresh cek saat start lalu tiap jam sampai ctx dibatalkan. Instance yang baru hidup dari nol
// langsung mengecek, jadi hasil tetap terisi walau instance sering mati.
func RunBenchmarkRefresh(ctx context.Context, store Store, ai AIService) {
	for {
		if err := RefreshBenchmark(ctx, store, ai, time.Now()); err != nil {
			slog.Warn("benchmark gagal diperbarui", "err", err)
		}
		select {
		case <-ctx.Done():
			return
		case <-time.After(time.Hour):
		}
	}
}
