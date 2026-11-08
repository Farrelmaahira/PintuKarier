# Backend Pintu Karier

Golang REST API. Clean architecture. Frontend hanya bicara ke API ini, tidak ke AI Engine langsung.

## Struktur

- `cmd/api` wiring dan start server.
- `internal/domain` entitas dan aturan: bobot scoring, kategori, evidence, `MinKandidat=10`, `MaxUploadBytes=5MB`.
- `internal/usecase` aturan bisnis plus port `Storage`, `Queue`, `AIService`, `JobRepo`.
- `internal/adapter/http` router, middleware role, upload bertanda tangan `PUT /files/{key}`.
- `internal/adapter/postgres` implementasi `usecase.Store` (pgx), skema, dan seed demo dari env.
- `internal/adapter/aiengine` client AI Engine (`usecase.AIService`).
- `internal/adapter/storage` file lokal; di Cloud Run direktori ini adalah mount Cloud Storage.
- `internal/usecase/pipeline.go` job parse_cv, transcribe, questions, analisis; `worker.go` retry 3x.

## Jalan

```bash
cd backend
go vet ./...
PINTUKARIER_TEST_DATABASE_URL='postgres://pintukarier:pintukarier_dev_password@localhost:5433/postgres?sslmode=disable' go test ./...
set -a && source .env && set +a && go run ./cmd/api
```

## Titik migrasi tunda

- Skema dijalankan saat start (`schema.sql`, idempoten). Ganti ke golang-migrate saat kolom mulai berubah.
- Token HMAC di `internal/usecase/auth.go` bisa ganti JWT lib tanpa ubah middleware; logout belum mencabut token.

## Baseline

- `go vet ./...` bersih.
- `go test ./...` hijau (domain, usecase, http, storage, postgres, alur penuh tiga peran dengan AI palsu).
- Target performa 500 kandidat < 30 menit diukur setelah repo Postgres dan worker tersedia.
