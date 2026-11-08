package postgres

import (
	"context"
	"errors"
	"fmt"
	"slices"
	"strconv"
	"strings"
	"time"

	"pintukarier-backend/internal/domain"
	"pintukarier-backend/internal/usecase"
)

// ProductionRoles daftar seluruh role resmi di sistem Pintu Karier.
var ProductionRoles = []domain.Role{
	domain.RoleAdmin,
	domain.RoleHRD,
	domain.RoleProdi,
	domain.RoleMahasiswa,
}

// SeedAccount mendefinisikan akun tunggal untuk seed produksi.
type SeedAccount struct {
	Role        domain.Role
	Email       string
	Password    string
	Nama        string
	Institution string
	NIM         string
	Campus      string
	Semester    int
	IPK         float64
}

// ProductionAccountsFromEnv membaca akun produksi untuk 4 role dari env:
// PROD_<ROLE>_EMAIL, PROD_<ROLE>_PASSWORD, PROD_<ROLE>_NAMA, PROD_<ROLE>_INSTANSI.
// Khusus mahasiswa bisa dilengkapi PROD_MAHASISWA_NIM, PROD_MAHASISWA_KAMPUS,
// PROD_MAHASISWA_SEMESTER, PROD_MAHASISWA_IPK.
func ProductionAccountsFromEnv(getenv func(string) string) ([]SeedAccount, error) {
	var out []SeedAccount
	var missing []string

	for _, role := range ProductionRoles {
		prefix := "PROD_" + strings.ToUpper(string(role)) + "_"
		email := strings.ToLower(strings.TrimSpace(getenv(prefix + "EMAIL")))
		pass := getenv(prefix + "PASSWORD")
		nama := strings.TrimSpace(getenv(prefix + "NAMA"))
		instansi := strings.TrimSpace(getenv(prefix + "INSTANSI"))

		if email == "" {
			missing = append(missing, prefix+"EMAIL")
		} else if !usecase.ValidEmail(email) {
			return nil, fmt.Errorf("format email %s tidak valid: %s", prefix+"EMAIL", email)
		}

		if pass == "" {
			missing = append(missing, prefix+"PASSWORD")
		} else if len(pass) < 8 {
			return nil, fmt.Errorf("password %s minimal 8 karakter", prefix+"PASSWORD")
		}

		if nama == "" {
			missing = append(missing, prefix+"NAMA")
		}

		if instansi == "" {
			// fallback instansi sesuai peran
			switch role {
			case domain.RoleAdmin:
				instansi = "Pintu Karier"
			case domain.RoleHRD:
				instansi = "PT Mitra Industri"
			case domain.RoleProdi, domain.RoleMahasiswa:
				instansi = "D4 Teknik Informatika"
			}
		}

		a := SeedAccount{
			Role:        role,
			Email:       email,
			Password:    pass,
			Nama:        nama,
			Institution: instansi,
		}

		if role == domain.RoleMahasiswa {
			a.NIM = strings.TrimSpace(getenv("PROD_MAHASISWA_NIM"))
			if a.NIM == "" {
				a.NIM = "2104411001"
			}
			a.Campus = strings.TrimSpace(getenv("PROD_MAHASISWA_KAMPUS"))
			if a.Campus == "" {
				a.Campus = "Politeknik Negeri"
			}
			if semStr := getenv("PROD_MAHASISWA_SEMESTER"); semStr != "" {
				a.Semester, _ = strconv.Atoi(semStr)
			}
			if a.Semester <= 0 {
				a.Semester = 7
			}
			if ipkStr := getenv("PROD_MAHASISWA_IPK"); ipkStr != "" {
				a.IPK, _ = strconv.ParseFloat(ipkStr, 64)
			}
			if a.IPK <= 0 {
				a.IPK = 3.85
			}
		}

		out = append(out, a)
	}

	if len(missing) > 0 {
		slices.Sort(missing)
		return nil, fmt.Errorf("env akun produksi belum diisi: %s", strings.Join(missing, ", "))
	}

	return out, nil
}

// DefaultProductionAccounts menghasilkan template 1 akun per role jika dijalankan tanpa env spesifik.
func DefaultProductionAccounts(defaultPassword string) []SeedAccount {
	if defaultPassword == "" {
		defaultPassword = "Pintu KarierProduction2026!"
	}
	return []SeedAccount{
		{
			Role:        domain.RoleAdmin,
			Email:       "admin@pintukarier.id",
			Password:    defaultPassword,
			Nama:        "Administrator Pintu Karier",
			Institution: "Pintu Karier System",
		},
		{
			Role:        domain.RoleHRD,
			Email:       "hrd@mitra.pintukarier.id",
			Password:    defaultPassword,
			Nama:        "HRD Mitra Industri",
			Institution: "PT Mitra Industri",
		},
		{
			Role:        domain.RoleProdi,
			Email:       "prodi@kampus.ac.id",
			Password:    defaultPassword,
			Nama:        "Koordinator Prodi Vokasi",
			Institution: "D4 Teknik Informatika",
		},
		{
			Role:        domain.RoleMahasiswa,
			Email:       "mahasiswa@kampus.ac.id",
			Password:    defaultPassword,
			Nama:        "Mahasiswa Pintu Karier",
			Institution: "D4 Teknik Informatika",
			NIM:         "2104411001",
			Campus:      "Politeknik Negeri",
			Semester:    7,
			IPK:         3.85,
		},
	}
}

// SeedProduction mengisikan akun awal produksi (1 akun per role).
// Operasi bersifat idempoten: jika email sudah terdaftar, akun tersebut dilewati tanpa error.
// Berbeda dari SeedDemo, fungsi ini TIDAK membuat data lamaran fiktif atau pelamar palsu.
func SeedProduction(ctx context.Context, s *Store, accounts []SeedAccount) error {
	now := time.Now()
	for _, a := range accounts {
		// Idempoten: cek apakah akun dengan email ini sudah ada
		if _, err := s.UserByEmail(ctx, a.Email); err == nil {
			continue
		} else if !errors.Is(err, usecase.ErrNotFound) {
			return fmt.Errorf("cek akun produksi %s (%s): %w", a.Role, a.Email, err)
		}

		hash, err := usecase.HashPassword(a.Password)
		if err != nil {
			return fmt.Errorf("hash password akun %s (%s): %w", a.Role, a.Email, err)
		}

		u := domain.User{
			ID:          "u-prod-" + string(a.Role),
			Email:       a.Email,
			PasswordHash: hash,
			Role:        a.Role,
			Name:        a.Nama,
			Institution: a.Institution,
			CreatedAt:   now,
		}

		if a.Role == domain.RoleMahasiswa {
			u.NIM = a.NIM
			u.Campus = a.Campus
			u.Semester = a.Semester
			u.IPK = a.IPK
		}

		// Jika ID sudah ada (misal diganti email tapi ID sama), gunakan ID acak
		if _, err := s.UserByID(ctx, u.ID); err == nil {
			u.ID = usecase.NewID("u-")
		}

		if _, err := s.CreateUser(ctx, u); err != nil {
			if errors.Is(err, usecase.ErrConflict) {
				continue
			}
			return fmt.Errorf("buat akun produksi %s (%s): %w", a.Role, a.Email, err)
		}
	}

	return nil
}
