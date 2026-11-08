package postgres

import (
	"context"
	"net/url"

	"github.com/jackc/pgx/v5"

	"pintukarier-backend/internal/usecase"
)

// OpenTemp buat database sementara di server baseURL dan buka Store di atasnya.
// Untuk tes integrasi: data tes tidak pernah menyentuh database dev. Panggil drop setelah selesai.
func OpenTemp(ctx context.Context, baseURL string) (s *Store, drop func(), err error) {
	admin, err := pgx.Connect(ctx, baseURL)
	if err != nil {
		return nil, nil, err
	}
	// Huruf kecil: CREATE DATABASE tanpa kutip melipat nama ke huruf kecil, sedangkan nama di URL koneksi peka huruf.
	name := "pintukarier_tmp_" + usecase.NewID("")
	if _, err := admin.Exec(ctx, "CREATE DATABASE "+name); err != nil {
		_ = admin.Close(ctx)
		return nil, nil, err
	}
	dropDB := func() {
		_, _ = admin.Exec(context.Background(), "DROP DATABASE "+name+" WITH (FORCE)")
		_ = admin.Close(context.Background())
	}
	u, err := url.Parse(baseURL)
	if err != nil {
		dropDB()
		return nil, nil, err
	}
	u.Path = "/" + name
	if s, err = Open(ctx, u.String()); err != nil {
		dropDB()
		return nil, nil, err
	}
	return s, func() { s.Close(); dropDB() }, nil
}
