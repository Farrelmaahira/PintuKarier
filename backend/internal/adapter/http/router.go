package httpadapter

import (
	"net/http"

	"pintukarier-backend/internal/adapter/http/handlers"
)

// NewRouter rakit rute sesuai README section 5.4.
func NewRouter(d *handlers.Deps) http.Handler {
	mux := http.NewServeMux()
	mux.HandleFunc("/health", func(w http.ResponseWriter, _ *http.Request) {
		w.WriteHeader(http.StatusOK)
		_, _ = w.Write([]byte("ok"))
	})
	handlers.RegisterRoutes(mux, d)
	mux.HandleFunc("/", func(w http.ResponseWriter, _ *http.Request) {
		handlers.WriteError(w, http.StatusNotFound, "rute tidak ditemukan")
	})
	return mux
}
