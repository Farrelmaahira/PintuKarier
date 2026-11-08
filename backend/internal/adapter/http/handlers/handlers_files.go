package handlers

import (
	"bytes"
	"errors"
	"fmt"
	"io"
	"net/http"
	"path/filepath"
	"strings"
	"time"

	"pintukarier-backend/internal/domain"
	"pintukarier-backend/internal/usecase"
)

// sniffed tipe isi sebenarnya per ekstensi; nama file saja tidak dipercaya.
var sniffed = map[string][]string{
	".pdf":  {"application/pdf"},
	".jpg":  {"image/jpeg"},
	".jpeg": {"image/jpeg"},
	".png":  {"image/png"},
	".webp": {"image/webp"},
	".webm": {"video/webm"},
	".mp3":  {"audio/mpeg"},
}

// HandleFilePut terima upload langsung dari browser lewat link bertanda tangan.
// Dipakai sekali: storage menolak menimpa key yang sudah ada.
func HandleFilePut(d *Deps) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		key := r.PathValue("key")
		q := r.URL.Query()
		if err := usecase.VerifyUpload(d.Secret, key, q.Get("exp"), q.Get("sig"), time.Now()); err != nil {
			WriteError(w, http.StatusForbidden, err.Error())
			return
		}
		if r.ContentLength <= 0 {
			WriteError(w, http.StatusLengthRequired, "ukuran file wajib dikirim")
			return
		}
		if r.ContentLength > domain.MaxUploadBytes {
			WriteError(w, http.StatusRequestEntityTooLarge, "ukuran file melebihi batas 5 MB")
			return
		}
		body := http.MaxBytesReader(w, r.Body, domain.MaxUploadBytes)
		head := make([]byte, 512)
		n, err := io.ReadFull(body, head)
		if err != nil && !errors.Is(err, io.ErrUnexpectedEOF) {
			WriteError(w, http.StatusBadRequest, "file tidak bisa dibaca")
			return
		}
		head = head[:n]
		ct := http.DetectContentType(head)
		ext := strings.ToLower(filepath.Ext(key))
		// Rekaman Safari (audio/mp4) memakai brand ftyp yang tidak dikenali DetectContentType;
		// semua MP4 diawali box "ftyp" di byte 4-8.
		isMP4 := ext == ".mp4" && len(head) >= 8 && string(head[4:8]) == "ftyp"
		if !isMP4 && !matches(sniffed[ext], ct) {
			WriteError(w, http.StatusUnsupportedMediaType, "isi file tidak sesuai tipenya")
			return
		}
		if _, err := d.Files.Save(r.Context(), key, io.MultiReader(bytes.NewReader(head), body), r.ContentLength, ct); err != nil {
			if _, tooBig := errors.AsType[*http.MaxBytesError](err); tooBig {
				WriteError(w, http.StatusRequestEntityTooLarge, "ukuran file melebihi batas 5 MB")
				return
			}
			WriteError(w, http.StatusConflict, "file sudah diunggah atau tidak bisa disimpan, minta link baru")
			return
		}
		w.WriteHeader(http.StatusCreated)
	}
}

func matches(allowed []string, ct string) bool {
	for _, a := range allowed {
		if strings.HasPrefix(ct, a) {
			return true
		}
	}
	return false
}

// HandleFileGet menyajikan file yang tersimpan (misal CV pdf, rekaman suara wawancara .webm/.mp3, atau snapshot).
func HandleFileGet(d *Deps) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		key := r.PathValue("key")
		if key == "" || filepath.Base(key) != key || strings.Contains(key, "..") {
			WriteError(w, http.StatusBadRequest, "key file tidak valid")
			return
		}
		data, err := d.Files.Read(r.Context(), key)
		if err != nil {
			WriteError(w, http.StatusNotFound, "file tidak ditemukan")
			return
		}
		ext := strings.ToLower(filepath.Ext(key))
		ct := "application/octet-stream"
		if allowed, ok := sniffed[ext]; ok && len(allowed) > 0 {
			ct = allowed[0]
		}
		w.Header().Set("Content-Type", ct)
		w.Header().Set("Cache-Control", "public, max-age=86400")

		// Jika parameter `filename` diberikan (misal dari frontend dengan nama rapi),
		// kirim header Content-Disposition agar browser mengunduh dengan nama tersebut.
		if fn := r.URL.Query().Get("filename"); fn != "" {
			cleanFn := filepath.Base(fn)
			cleanFn = strings.ReplaceAll(cleanFn, `"`, "")
			cleanFn = strings.ReplaceAll(cleanFn, "\r", "")
			cleanFn = strings.ReplaceAll(cleanFn, "\n", "")
			if cleanFn != "" {
				w.Header().Set("Content-Disposition", fmt.Sprintf(`inline; filename="%s"`, cleanFn))
			}
		}

		w.WriteHeader(http.StatusOK)
		_, _ = w.Write(data)
	}
}

// CORS hanya untuk /files/: browser upload lintas origin dari frontend.
// Endpoint lain dipanggil server Next.js, jadi tidak butuh CORS.
// origins dipisah koma, mis. domain Vercel produksi dan preview.
func CORS(origins string, next http.Handler) http.Handler {
	allowed := map[string]bool{}
	for _, o := range strings.Split(origins, ",") {
		if o = strings.TrimSpace(o); o != "" {
			allowed[o] = true
		}
	}
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if origin := r.Header.Get("Origin"); allowed[origin] {
			w.Header().Set("Access-Control-Allow-Origin", origin)
			w.Header().Set("Access-Control-Allow-Methods", "PUT")
			w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
			w.Header().Set("Access-Control-Max-Age", "600")
			w.Header().Add("Vary", "Origin")
		}
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}
		next.ServeHTTP(w, r)
	})
}
