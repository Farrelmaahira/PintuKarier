package usecase

import (
	"context"
	"errors"
	"log/slog"
	"time"

	"pintukarier-backend/internal/domain"
)

// MaxAttempts job dicoba maksimal tiga kali dengan jeda 5 detik lalu 10 detik.
const MaxAttempts = 3

// JobRunner dijalankan worker untuk tiap job.
type JobRunner interface {
	Run(ctx context.Context, j domain.Job) error
}

// RunWorkers jalankan n worker sampai ctx dibatalkan.
func RunWorkers(ctx context.Context, store Store, runner JobRunner, n int) {
	for range max(1, n) {
		go workLoop(ctx, store, runner)
	}
}

func workLoop(ctx context.Context, store Store, runner JobRunner) {
	for ctx.Err() == nil {
		j, ok, err := store.ClaimJob(ctx)
		if err != nil {
			slog.Error("ambil job gagal", "err", err)
		}
		if err != nil || !ok {
			select {
			case <-ctx.Done():
			case <-time.After(time.Second):
			}
			continue
		}
		RunOne(ctx, store, runner, j)
	}
}

// RunOne jalankan satu job lalu catat hasilnya. Diekspor untuk tes.
func RunOne(ctx context.Context, store Store, runner JobRunner, j domain.Job) {
	timeout := 3 * time.Minute
	if j.Kind == KindAnalisis {
		timeout = 30 * time.Minute
	}
	jctx, cancel := context.WithTimeout(ctx, timeout)
	runErr := runner.Run(jctx, j)
	cancel()

	var retry time.Duration
	if runErr != nil {
		slog.Warn("job gagal", "id", j.ID, "kind", j.Kind, "ref", j.RefID, "attempt", j.Attempts, "err", runErr)
		if !errors.Is(runErr, ErrPermanent) && j.Attempts < MaxAttempts {
			retry = time.Duration(j.Attempts) * 5 * time.Second
		}
	}
	if err := store.FinishJob(ctx, j.ID, runErr, retry); err != nil {
		slog.Error("simpan status job gagal", "id", j.ID, "err", err)
	}
}
