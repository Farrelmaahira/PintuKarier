package handlers

import (
	"context"
	"net/http"
	"strings"

	"pintukarier-backend/internal/domain"
	"pintukarier-backend/internal/usecase"
)

type ctxKey string

const (
	ctxUserID ctxKey = "userId"
	ctxRole   ctxKey = "role"
)

// ClaimsFromContext baca identitas yang diset RequireRole.
func ClaimsFromContext(ctx context.Context) (userID string, role domain.Role) {
	u, _ := ctx.Value(ctxUserID).(string)
	r, _ := ctx.Value(ctxRole).(domain.Role)
	return u, r
}

// RequireRole tolak tanpa token valid dengan 401, role salah dengan 403.
func RequireRole(secret string, allowed ...domain.Role) func(http.Handler) http.Handler {
	allow := map[domain.Role]bool{}
	for _, r := range allowed {
		allow[r] = true
	}
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			token := strings.TrimPrefix(r.Header.Get("Authorization"), "Bearer ")
			if token == "" || token == r.Header.Get("Authorization") {
				WriteError(w, http.StatusUnauthorized, "token wajib diisi")
				return
			}
			claims, err := usecase.Verify(strings.TrimSpace(token), secret)
			if err != nil {
				WriteError(w, http.StatusUnauthorized, "token tidak valid")
				return
			}
			if !allow[claims.Role] {
				WriteError(w, http.StatusForbidden, "akses ditolak untuk role ini")
				return
			}
			ctx := context.WithValue(r.Context(), ctxUserID, claims.UserID)
			ctx = context.WithValue(ctx, ctxRole, claims.Role)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}
