package main

import (
	"context"
	"flag"
	"fmt"
	"log"
	"os"
	"strings"
	"time"

	"pintukarier-backend/internal/adapter/postgres"
	"pintukarier-backend/internal/domain"
	"pintukarier-backend/internal/usecase"
)

func main() {
	sqlOnly := flag.Bool("sql", false, "Hanya cetak query SQL INSERT dengan hash PBKDF2 valid, tanpa konek ke database")
	strictEnv := flag.Bool("env", false, "Wajibkan variabel env PROD_* (gagal jika env tidak lengkap)")
	defaultPass := flag.String("password", "Pintu KarierProd2026!", "Password default jika PROD_*_PASSWORD tidak diisi di env")
	dbURL := flag.String("db", "", "URL database Postgres (default baca dari DATABASE_URL)")
	flag.Parse()

	var accounts []postgres.SeedAccount
	var err error

	// 1. Coba baca dari env bila disediakan atau strict
	if *strictEnv {
		accounts, err = postgres.ProductionAccountsFromEnv(os.Getenv)
		if err != nil {
			log.Fatalf("Error membaca konfigurasi env: %v", err)
		}
	} else {
		accounts, err = postgres.ProductionAccountsFromEnv(os.Getenv)
		if err != nil {
			// Jika env belum lengkap dan bukan strict, pakai default production accounts
			accounts = postgres.DefaultProductionAccounts(*defaultPass)
		}
	}

	// 2. Mode cetak SQL
	if *sqlOnly {
		fmt.Println("-- ============================================================")
		fmt.Println("-- SQL Seed Akun Produksi Pintu Karier (1 Akun per Role)")
		fmt.Println("-- Hash password dihitung menggunakan PBKDF2-SHA256 (600.000 iterasi)")
		fmt.Println("-- Sesuai dengan spesifikasi usecase.CheckPassword backend")
		fmt.Println("-- ============================================================")
		fmt.Println()

		for _, a := range accounts {
			hash, err := usecase.HashPassword(a.Password)
			if err != nil {
				log.Fatalf("Gagal hash password role %s: %v", a.Role, err)
			}
			id := "u-prod-" + string(a.Role)
			fmt.Printf("-- Role: %s | Email: %s | Plain Password: %s\n", a.Role, a.Email, a.Password)
			fmt.Printf(`INSERT INTO users (id, email, password_hash, peran, nama, instansi, nim, kampus, semester, ipk, ringkasan, skill, created_at)
VALUES (
    '%s',
    '%s',
    '%s',
    '%s',
    '%s',
    '%s',
    '%s',
    '%s',
    %d,
    %.2f,
    '',
    '[]'::jsonb,
    NOW()
) ON CONFLICT (email) DO NOTHING;
`, id, a.Email, hash, a.Role, escapeSQL(a.Nama), escapeSQL(a.Institution), a.NIM, escapeSQL(a.Campus), a.Semester, a.IPK)
			fmt.Println()
		}
		return
	}

	// 3. Mode eksekusi langsung ke Postgres
	resolvedURL := *dbURL
	if resolvedURL == "" {
		resolvedURL = os.Getenv("DATABASE_URL")
	}
	if resolvedURL == "" {
		resolvedURL = "postgres://pintukarier:pintukarier_dev_password@localhost:5433/pintukarier?sslmode=disable"
	}

	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	store, err := postgres.Open(ctx, resolvedURL)
	if err != nil {
		log.Fatalf("Gagal membuka koneksi database (%s): %v", resolvedURL, err)
	}
	defer store.Close()

	if err := postgres.SeedProduction(ctx, store, accounts); err != nil {
		log.Fatalf("Gagal melakukan seed produksi: %v", err)
	}

	fmt.Println("============================================================")
	fmt.Println("  SEED AKUN PRODUKSI BERHASIL (1 AKUN PER ROLE)")
	fmt.Println("============================================================")
	for _, a := range accounts {
		fmt.Printf("Role    : %-10s | %s\n", a.Role, a.Nama)
		fmt.Printf("Email   : %s\n", a.Email)
		fmt.Printf("Password: %s\n", a.Password)
		fmt.Printf("Instansi: %s\n", a.Institution)
		if a.Role == domain.RoleMahasiswa {
			fmt.Printf("NIM/IPK : %s / %.2f (Semester %d)\n", a.NIM, a.IPK, a.Semester)
		}
		fmt.Println("------------------------------------------------------------")
	}
}

func escapeSQL(s string) string {
	return strings.ReplaceAll(s, "'", "''")
}
