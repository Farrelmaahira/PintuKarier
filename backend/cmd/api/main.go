package main

import (
	"context"
	"errors"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"strconv"
	"syscall"
	"time"

	"pintukarier-backend/internal/adapter/aiengine"
	httpadapter "pintukarier-backend/internal/adapter/http"
	"pintukarier-backend/internal/adapter/http/handlers"
	"pintukarier-backend/internal/adapter/postgres"
	"pintukarier-backend/internal/adapter/storage"
	"pintukarier-backend/internal/domain"
	"pintukarier-backend/internal/usecase"
)

func env(key, def string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return def
}

func main() {
	secret := os.Getenv("PINTUKARIER_SECRET")
	if len(secret) < 16 {
		if os.Getenv("PINTUKARIER_ENV") == "production" {
			slog.Error("PINTUKARIER_SECRET wajib minimal 16 karakter di production")
			os.Exit(1)
		}
		slog.Warn("PINTUKARIER_SECRET kosong, pakai secret dev; jangan dipakai di server sungguhan")
		secret = "dev-secret-minimal-16xx"
	}
	concurrency, _ := strconv.Atoi(env("AI_CONCURRENCY", "4"))

	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	store, err := postgres.Open(ctx, env("DATABASE_URL", "postgres://pintukarier:pintukarier_dev_password@localhost:5433/pintukarier?sslmode=disable"))
	if err != nil {
		slog.Error("buka database gagal", "err", err)
		os.Exit(1)
	}
	defer store.Close()
	if os.Getenv("PINTUKARIER_SEED_DEMO") == "1" {
		accounts, err := postgres.DemoAccountsFromEnv(os.Getenv)
		if err == nil {
			err = postgres.SeedDemo(ctx, store, accounts)
		}
		if err != nil {
			slog.Error("seed demo gagal", "err", err)
			os.Exit(1)
		}
	}
	if os.Getenv("PINTUKARIER_SEED_PROD") == "1" || os.Getenv("PINTUKARIER_SEED_PRODUCTION") == "1" {
		accounts, err := postgres.ProductionAccountsFromEnv(os.Getenv)
		if err == nil {
			err = postgres.SeedProduction(ctx, store, accounts)
		}
		if err != nil {
			slog.Error("seed production gagal", "err", err)
			os.Exit(1)
		}
		slog.Info("seed production berhasil: 1 akun per role siap digunakan")
	}

	files := storage.NewLocal(env("STORAGE_DIR", "./data/files"), domain.MaxUploadBytes)
	ai := aiengine.New(env("AI_ENGINE_URL", "http://localhost:8000"), os.Getenv("INTERNAL_API_KEY"), concurrency)
	usecase.RunWorkers(ctx, store, &usecase.Pipeline{Store: store, AI: ai, Files: files, Concurrency: concurrency}, 2)
	go usecase.RunBenchmarkRefresh(ctx, store, ai)

	d := &handlers.Deps{
		Secret: secret, Store: store, Files: files,
		PublicURL: env("PUBLIC_BASE_URL", "http://localhost:8080"),
		WebOrigin: env("WEB_ORIGIN", "http://localhost:3000"),
	}
	srv := &http.Server{
		Addr:              ":" + env("PORT", "8080"),
		Handler:           httpadapter.NewRouter(d),
		ReadHeaderTimeout: 10 * time.Second,
		ReadTimeout:       60 * time.Second,
		WriteTimeout:      60 * time.Second,
		IdleTimeout:       120 * time.Second,
	}
	go func() {
		<-ctx.Done()
		shutdown, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()
		_ = srv.Shutdown(shutdown)
	}()
	slog.Info("pintukarier-backend listening", "addr", srv.Addr)
	if err := srv.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
		slog.Error("server berhenti", "err", err)
		os.Exit(1)
	}
}
