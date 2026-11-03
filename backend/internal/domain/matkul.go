package domain

import "strings"

// Matkul kompetensi ke mata kuliah terdekat, sama dengan COURSE_BY_COMPETENCY di frontend/lib/data/studyProgram/info.ts.
// shortcut: satu peta untuk D4 TI, pindah ke tabel per prodi saat prodi kedua bergabung.
var Matkul = map[string]string{
	"Testing otomatis":      "Pengujian Perangkat Lunak",
	"TypeScript":            "Pemrograman Web Lanjut",
	"Git dan code review":   "Proyek Perangkat Lunak (PBL)",
	"SQL lanjutan":          "Basis Data Lanjut",
	"Integrasi REST API":    "Pemrograman Web Lanjut",
	"Visualisasi data":      "Visualisasi Data",
	"Statistik inferensial": "Statistika dan Probabilitas",
	"Cloud dasar (AWS/GCP)": "Komputasi Awan",
	"Docker dan deployment": "Komputasi Awan",
	"Konfigurasi VLAN":      "Jaringan Komputer Lanjut",
	"Keamanan jaringan":     "Keamanan Informasi",
	"Linux server":          "Sistem Operasi",
	"Komunikasi teknis":     "Bahasa Indonesia untuk Komunikasi Ilmiah",
	"Python untuk data":     "Pemrograman Python",
}

// MatkulFor cocokkan nama kompetensi bebas ke peta, kosong bila tidak ada yang mirip.
func MatkulFor(kompetensi string) string {
	k := strings.ToLower(strings.TrimSpace(kompetensi))
	if k == "" {
		return ""
	}
	best, bestLen := "", 0
	for name, mk := range Matkul {
		n := strings.ToLower(name)
		if n == k {
			return mk
		}
		// Kata kunci terpanjang menang supaya "SQL" tidak kalah dari kecocokan acak.
		first := strings.Fields(n)[0]
		if (strings.Contains(k, n) || strings.Contains(n, k) || strings.Contains(k, first)) && len(n) > bestLen {
			best, bestLen = mk, len(n)
		}
	}
	return best
}

// Pertanyaan cadangan bila AI Engine gagal membuat pertanyaan per lowongan.
var (
	DefaultPrescreen = []string{
		"Kapan kamu bisa mulai bekerja atau magang?",
		"Oke dengan lokasi dan sistem kerja di lowongan ini? Ceritain singkat kondisimu.",
		"Link portofolio, GitHub, atau contoh hasil kerja kamu?",
	}
	DefaultInterview = []string{
		"Ceritain satu proyek yang paling kamu banggain dan relevan sama posisi ini. Peran kamu di situ apa?",
		"Pernah ketemu masalah teknis yang bikin pusing? Gimana cara kamu nemuin dan beresinnya?",
		"Kalau tenggat mepet dan kebutuhan berubah di tengah jalan, apa yang kamu lakuin?",
	}
)
