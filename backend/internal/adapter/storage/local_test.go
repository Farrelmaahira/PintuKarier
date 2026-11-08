package storage

import (
	"bytes"
	"context"
	"testing"
)

func TestSaveRejectsOversize(t *testing.T) {
	s := NewLocal(t.TempDir(), 10)
	_, err := s.Save(context.Background(), "cv.pdf", bytes.NewReader(make([]byte, 11)), 11, "application/pdf")
	if err == nil {
		t.Fatal("expected oversize error")
	}
}

func TestSaveRejectsBadExtension(t *testing.T) {
	s := NewLocal(t.TempDir(), 1024)
	_, err := s.Save(context.Background(), "run.exe", bytes.NewReader([]byte("x")), 1, "application/octet-stream")
	if err == nil {
		t.Fatal("expected extension error")
	}
}

func TestSaveRejectsTraversal(t *testing.T) {
	s := NewLocal(t.TempDir(), 1024)
	_, err := s.Save(context.Background(), "../evil.pdf", bytes.NewReader([]byte("x")), 1, "application/pdf")
	if err == nil {
		t.Fatal("expected traversal error")
	}
}

func TestSaveAcceptsPDF(t *testing.T) {
	s := NewLocal(t.TempDir(), 1024)
	p, err := s.Save(context.Background(), "cv-falih.pdf", bytes.NewReader([]byte("%PDF-1.4")), 8, "application/pdf")
	if err != nil {
		t.Fatalf("Save: %v", err)
	}
	if p == "" {
		t.Fatal("expected non-empty path")
	}
}

func TestReadRoundTripAndTraversal(t *testing.T) {
	s := NewLocal(t.TempDir(), 1024)
	if _, err := s.Save(context.Background(), "a.webm", bytes.NewReader([]byte("abc")), 3, "audio/webm"); err != nil {
		t.Fatal(err)
	}
	if b, err := s.Read(context.Background(), "a.webm"); err != nil || string(b) != "abc" {
		t.Fatalf("read = %q %v", b, err)
	}
	if _, err := s.Read(context.Background(), "../a.webm"); err == nil {
		t.Fatal("expected traversal error")
	}
}
