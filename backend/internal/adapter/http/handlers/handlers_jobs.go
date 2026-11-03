package handlers

import "net/http"

func HandleJobGet(d *Deps) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		j, err := d.Store.Job(r.Context(), r.PathValue("id"))
		if err != nil {
			fail(w, err, "job")
			return
		}
		WriteJSON(w, http.StatusOK, jobResponse(j))
	}
}

// HandleBenchmark publik untuk halaman depan: hasil benchmark terakhir dari database. Daftar kosong berarti
// belum pernah terukur; pengukurannya dijalankan usecase.RunBenchmarkRefresh di latar belakang.
func HandleBenchmark(d *Deps) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		rows, _, err := d.Store.LatestBenchmark(r.Context())
		if err != nil {
			fail(w, err, "benchmark")
			return
		}
		WriteJSON(w, http.StatusOK, rows)
	}
}
