# PintuKarier (TITIAN)

**Platform AI Jembatan Kompetensi yang Mengubah Hasil Seleksi Kerja Menjadi Jalur Belajar bagi Lulusan Vokasi**

TITIAN: *Talent Intelligence Through Industry-Academia Network*  
Politeknik Negeri Jakarta

---

## 1. Tentang PintuKarier

Setiap tahun, lulusan vokasi menghadapi kenyataan seleksi kerja di mana penolakan kerap datang tanpa alasan yang transparan. Di sisi lain, program studi kesulitan memperbarui kurikulum secara riil karena minimnya data kompetensi terkini dari dunia industri.

PintuKarier menghubungkan empat pilar dalam satu ekosistem terpadu:
1. **Mahasiswa**: Melamar kerja, mengikuti AI Interview, menerima feedback transparan, lalu melanjutkan ke *Learning Hub* dengan latihan kuis AI dan pemantauan *Readiness Tracker*.
2. **HRD Mitra**: Memasang lowongan, meninjau kandidat berdasarkan *Evidence-Based Scoring* 5 dimensi dengan kutipan bukti riil, mengoreksi kategori secara berkeadilan, dan mengirim feedback 1-klik.
3. **Program Studi & Jurusan**: Memantau peringkat kesenjangan kompetensi per periode untuk evaluasi RPS dan CPL secara anonim (dengan perlindungan batas privasi $k \ge 10$).
4. **Pusat Karier (Admin Kampus)**: Memiliki akses makro ke seluruh 7 jurusan di universitas untuk memantau serapan kerja, mengawal SLA pengiriman feedback mitra, dan mengelola kemitraan industri.

---

## 2. Struktur Proyek

```
frontend/        Aplikasi Next.js (App Router, Tailwind/CSS Modules)
backend/         Golang REST API (Auth HMAC, RBAC, Job Worker, Signed URLs)
ai-engine/       FastAPI Python Engine (Evidence Scoring, Prompt Guard, Learning Generator)
docker-compose.yml Layanan lokal (PostgreSQL & AI Engine)
```

---

## 3. Menjalankan Lingkungan Lokal

1. Jalankan database dan layanan pendukung:
   ```bash
   docker compose up -d
   ```
2. Jalankan Backend (Golang):
   ```bash
   cd backend
   go run cmd/api/main.go
   ```
3. Jalankan Frontend (Next.js):
   ```bash
   cd frontend
   npm run dev
   ```
