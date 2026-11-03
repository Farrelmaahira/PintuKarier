package storage

import (
	"context"
	"errors"
	"io"
	"os"
	"path/filepath"
	"strings"
)

// Allowlist sesuai README: PDF dan image untuk CV plus audio/video interview.
var allowedExt = map[string]bool{
	".pdf": true, ".jpg": true, ".jpeg": true, ".png": true,
	".mp3": true, ".mp4": true, ".webm": true,
}

// Local simpan file di disk untuk tahap awal.
// Migrasi ke S3 cukup ganti implementasi interface usecase.Storage.
type Local struct {
	Dir      string
	MaxBytes int64
}

func NewLocal(dir string, maxBytes int64) *Local {
	return &Local{Dir: dir, MaxBytes: maxBytes}
}

func (s *Local) Save(_ context.Context, name string, r io.Reader, size int64, _ string) (string, error) {
	if size > s.MaxBytes {
		return "", errors.New("ukuran file melebihi batas 5 MB")
	}
	ext := strings.ToLower(filepath.Ext(name))
	if !allowedExt[ext] {
		return "", errors.New("tipe file tidak didukung")
	}
	base := filepath.Base(name)
	if base != name || strings.Contains(name, "..") {
		return "", errors.New("nama file tidak valid")
	}
	if err := os.MkdirAll(s.Dir, 0o755); err != nil {
		return "", err
	}
	dst := filepath.Join(s.Dir, base)
	f, err := os.OpenFile(dst, os.O_WRONLY|os.O_CREATE|os.O_EXCL, 0o644)
	if err != nil {
		return "", err
	}
	defer f.Close()
	if _, err := io.CopyN(f, r, size); err != nil && err != io.EOF {
		_ = os.Remove(dst)
		return "", err
	}
	return dst, nil
}

// Read baca file yang sudah disimpan, untuk dikirim worker ke AI Engine.
func (s *Local) Read(_ context.Context, name string) ([]byte, error) {
	if filepath.Base(name) != name || strings.Contains(name, "..") {
		return nil, errors.New("nama file tidak valid")
	}
	return os.ReadFile(filepath.Join(s.Dir, name))
}
