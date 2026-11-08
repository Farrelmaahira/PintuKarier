package handlers

import (
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"pintukarier-backend/internal/domain"
	"pintukarier-backend/internal/usecase"
)

func issue(t *testing.T, role domain.Role) string {
	t.Helper()
	tok, err := usecase.Issue("u-1", role, "secret-test-1234567890", time.Hour)
	if err != nil {
		t.Fatalf("Issue: %v", err)
	}
	return tok
}

func TestRequireRole(t *testing.T) {
	ok := RequireRole("secret-test-1234567890", domain.RoleHRD)(http.HandlerFunc(func(w http.ResponseWriter, _ *http.Request) {
		w.WriteHeader(http.StatusOK)
	}))

	cases := []struct {
		name string
		role domain.Role
		auth func() string
		want int
	}{
		{"hrd allowed", domain.RoleHRD, func() string { return "Bearer " + issue(t, domain.RoleHRD) }, http.StatusOK},
		{"mahasiswa forbidden", domain.RoleMahasiswa, func() string { return "Bearer " + issue(t, domain.RoleMahasiswa) }, http.StatusForbidden},
		{"missing token", "", func() string { return "" }, http.StatusUnauthorized},
		{"tampered token", "", func() string { return "Bearer abc.def.ghi" }, http.StatusUnauthorized},
	}
	for _, c := range cases {
		req := httptest.NewRequest(http.MethodGet, "/", nil)
		if h := c.auth(); h != "" {
			req.Header.Set("Authorization", h)
		}
		rec := httptest.NewRecorder()
		ok.ServeHTTP(rec, req)
		if rec.Code != c.want {
			t.Errorf("%s: got %d, want %d", c.name, rec.Code, c.want)
		}
	}
}
