package httpadapter

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"pintukarier-backend/internal/adapter/http/handlers"
)

func decodeBody(rec *httptest.ResponseRecorder, v any) error {
	return json.Unmarshal(rec.Body.Bytes(), v)
}

func TestNotFoundJSON(t *testing.T) {
	r := NewRouter(&handlers.Deps{Secret: "secret-test-1234567890"})
	req := httptest.NewRequest(http.MethodGet, "/rute-tidak-ada", nil)
	rec := httptest.NewRecorder()
	r.ServeHTTP(rec, req)
	if rec.Code != http.StatusNotFound {
		t.Fatalf("got %d, want 404", rec.Code)
	}
	var body map[string]string
	if err := decodeBody(rec, &body); err != nil {
		t.Fatalf("decode: %v", err)
	}
	if body["error"] == "" {
		t.Fatal("expected {error} envelope")
	}
}
