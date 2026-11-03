package usecase

import (
	"crypto/hmac"
	"crypto/pbkdf2"
	"crypto/rand"
	"crypto/sha256"
	"crypto/subtle"
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"regexp"
	"strconv"
	"strings"
	"time"

	"pintukarier-backend/internal/domain"
)

// Claims token sesi. Exp Unix detik.
type Claims struct {
	UserID string      `json:"uid"`
	Role   domain.Role `json:"role"`
	Exp    int64       `json:"exp"`
}

// Issue terbitkan token HMAC-SHA256. Ganti ke JWT lib saat butuh interoperabilitas.
func Issue(userID string, role domain.Role, secret string, ttl time.Duration) (string, error) {
	if userID == "" {
		return "", errors.New("user id wajib diisi")
	}
	if !role.Valid() {
		return "", errors.New("role tidak dikenal")
	}
	if len(secret) < 16 {
		return "", errors.New("secret minimal 16 karakter")
	}
	payload, _ := json.Marshal(Claims{UserID: userID, Role: role, Exp: time.Now().Add(ttl).Unix()})
	body := base64.RawURLEncoding.EncodeToString(payload)
	mac := hmac.New(sha256.New, []byte(secret))
	mac.Write([]byte(body))
	sig := base64.RawURLEncoding.EncodeToString(mac.Sum(nil))
	return body + "." + sig, nil
}

// Verify cek tanda tangan dan masa berlaku.
func Verify(token, secret string) (Claims, error) {
	var c Claims
	parts := strings.Split(token, ".")
	if len(parts) != 2 {
		return c, errors.New("format token salah")
	}
	mac := hmac.New(sha256.New, []byte(secret))
	mac.Write([]byte(parts[0]))
	want := base64.RawURLEncoding.EncodeToString(mac.Sum(nil))
	if !hmac.Equal([]byte(parts[1]), []byte(want)) {
		return c, errors.New("tanda tangan token salah")
	}
	raw, err := base64.RawURLEncoding.DecodeString(parts[0])
	if err != nil {
		return c, errors.New("payload token rusak")
	}
	if err := json.Unmarshal(raw, &c); err != nil {
		return c, errors.New("payload token rusak")
	}
	if !c.Role.Valid() {
		return c, errors.New("role token tidak dikenal")
	}
	if time.Now().Unix() > c.Exp {
		return c, errors.New("token kedaluwarsa")
	}
	return c, nil
}

const pbkdf2Iter = 600_000

// emailRe sama dengan format di frontend/lib/validateEmail.ts: TLD minimal 2 huruf, jadi "gmail.c0m" ditolak.
var emailRe = regexp.MustCompile(`(?i)^[^\s@]+@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}$`)

// ValidEmail cek format alamat email (tanpa nama tampilan) dan panjang maksimal RFC 5321.
func ValidEmail(email string) bool {
	return len(email) <= 254 && emailRe.MatchString(email)
}

// HashPassword PBKDF2-SHA256 dari stdlib, format "pbkdf2$iter$salt$hash".
func HashPassword(password string) (string, error) {
	if len(password) < 8 {
		return "", errors.New("password minimal 8 karakter")
	}
	salt := make([]byte, 16)
	if _, err := rand.Read(salt); err != nil {
		return "", err
	}
	key, err := pbkdf2.Key(sha256.New, password, salt, pbkdf2Iter, 32)
	if err != nil {
		return "", err
	}
	enc := base64.RawStdEncoding
	return fmt.Sprintf("pbkdf2$%d$%s$%s", pbkdf2Iter, enc.EncodeToString(salt), enc.EncodeToString(key)), nil
}

// CheckPassword bandingkan waktu konstan supaya tidak bocor lewat timing.
func CheckPassword(hash, password string) bool {
	parts := strings.Split(hash, "$")
	if len(parts) != 4 || parts[0] != "pbkdf2" {
		return false
	}
	iter, err := strconv.Atoi(parts[1])
	if err != nil || iter < 1 {
		return false
	}
	enc := base64.RawStdEncoding
	salt, err1 := enc.DecodeString(parts[2])
	want, err2 := enc.DecodeString(parts[3])
	if err1 != nil || err2 != nil {
		return false
	}
	got, err := pbkdf2.Key(sha256.New, password, salt, iter, len(want))
	return err == nil && subtle.ConstantTimeCompare(got, want) == 1
}
