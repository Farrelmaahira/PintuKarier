package usecase

import (
	"testing"
	"time"
)

func TestIssueAndVerify(t *testing.T) {
	tok, err := Issue("u-1", "mahasiswa", "secret-test-1234567890", time.Hour)
	if err != nil {
		t.Fatalf("Issue: %v", err)
	}
	c, err := Verify(tok, "secret-test-1234567890")
	if err != nil {
		t.Fatalf("Verify: %v", err)
	}
	if c.UserID != "u-1" || string(c.Role) != "mahasiswa" {
		t.Fatalf("claims = %+v", c)
	}
}

func TestIssueRejectsInvalidRole(t *testing.T) {
	if _, err := Issue("u-1", "dosen", "secret-test-1234567890", time.Hour); err == nil {
		t.Fatal("expected error for invalid role")
	}
}

func TestVerifyRejectsExpired(t *testing.T) {
	tok, err := Issue("u-1", "hrd", "secret-test-1234567890", -time.Minute)
	if err != nil {
		t.Fatalf("Issue: %v", err)
	}
	if _, err := Verify(tok, "secret-test-1234567890"); err == nil {
		t.Fatal("expected expiry error")
	}
}

func TestVerifyRejectsTampered(t *testing.T) {
	tok, err := Issue("u-1", "hrd", "secret-test-1234567890", time.Hour)
	if err != nil {
		t.Fatalf("Issue: %v", err)
	}
	if _, err := Verify(tok+"x", "secret-test-1234567890"); err == nil {
		t.Fatal("expected tamper error")
	}
	if _, err := Verify(tok, "wrong-secret"); err == nil {
		t.Fatal("expected wrong secret error")
	}
}

func TestValidEmail(t *testing.T) {
	for _, e := range []string{"nama@kampus.ac.id", "a.b+c@gmail.com", "x@sub-domain.co"} {
		if !ValidEmail(e) {
			t.Errorf("%q harus valid", e)
		}
	}
	for _, e := range []string{"yutaagra@gm4il.c0m", "a@gmail.c", "a@-x.com", "a@x..com", "a b@x.com", "Nama <a@x.com>", "a@x", "@x.com"} {
		if ValidEmail(e) {
			t.Errorf("%q harus ditolak", e)
		}
	}
}

func TestPasswordHash(t *testing.T) {
	h, err := HashPassword("sandi-uji-1")
	if err != nil {
		t.Fatal(err)
	}
	if !CheckPassword(h, "sandi-uji-1") || CheckPassword(h, "sandi-uji-2") || CheckPassword("rusak", "sandi-uji-1") {
		t.Fatal("CheckPassword salah")
	}
	if _, err := HashPassword("pendek"); err == nil {
		t.Fatal("password < 8 harus ditolak")
	}
}

func TestSignedUpload(t *testing.T) {
	now := time.Now()
	q := SignUpload("secret-test-1234567890", "cv-lam-1-ab.pdf", now.Add(time.Minute))
	if err := VerifyUpload("secret-test-1234567890", "cv-lam-1-ab.pdf", q.Get("exp"), q.Get("sig"), now); err != nil {
		t.Fatalf("valid: %v", err)
	}
	if VerifyUpload("secret-test-1234567890", "cv-lam-2-ab.pdf", q.Get("exp"), q.Get("sig"), now) == nil {
		t.Fatal("key lain harus ditolak")
	}
	if VerifyUpload("secret-test-1234567890", "cv-lam-1-ab.pdf", q.Get("exp"), q.Get("sig"), now.Add(2*time.Minute)) == nil {
		t.Fatal("kedaluwarsa harus ditolak")
	}
}
