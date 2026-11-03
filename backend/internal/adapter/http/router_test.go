package httpadapter

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"pintukarier-backend/internal/adapter/http/handlers"
)

func TestHealth(t *testing.T) {
	r := NewRouter(&handlers.Deps{Secret: "secret-test-1234567890"})
	req := httptest.NewRequest(http.MethodGet, "/health", nil)
	rec := httptest.NewRecorder()
	r.ServeHTTP(rec, req)
	if rec.Code != http.StatusOK {
		t.Fatalf("got %d, want 200", rec.Code)
	}
}
