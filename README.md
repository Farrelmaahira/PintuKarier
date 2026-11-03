# Pintu Karier

**Platform AI Berbasis Bukti yang Menghubungkan Seleksi Kerja, Jalur Belajar Mahasiswa, dan Pemutakhiran Kurikulum Vokasi**

Politeknik Negeri Jakarta

---

## 1. Tentang Pintu Karier

Pintu Karier adalah platform kecerdasan talenta terintegrasi (*Talent Intelligence Platform*) yang mengubah dinamika rekrutmen konvensional menjadi siklus pengembangan kompetensi yang berkelanjutan. Di rekrutmen biasa, penolakan sering kali menjadi jalan buntu tanpa alasan jelas bagi kandidat. Di Pintu Karier, setiap hasil seleksi dianalisis secara objektif berbasis bukti (*Evidence-Based*) dan diubah menjadi rekomendasi pembelajaran yang terukur.

Pintu Karier menyatukan empat pilar utama dalam satu ekosistem:
1. **Mahasiswa**: Melamar lowongan, menjalani wawancara AI (*AI Interview*), menerima analisis umpan balik transparan, mengakses *Learning Hub* dengan latihan studi kasus interaktif, serta memantau peningkatan *Readiness Tracker*.
2. **HRD Mitra Industri**: Memasang lowongan kerja, menyaring ratusan kandidat dalam hitungan menit menggunakan *Evidence-Based Scoring* 5 dimensi dengan kutipan bukti nyata dari CV & wawancara, mengoreksi kategori secara adil, dan mengirimkan feedback terstruktur dengan 1-klik.
3. **Program Studi & Jurusan**: Memantau peringkat kesenjangan kompetensi (*Competency Gap Index*) per periode rekrutmen untuk penyempurnaan RPS dan CPL berbasis data nyata industri, dengan proteksi privasi ketat ($k \ge 10$).
4. **Pusat Karier (Admin Kampus)**: Memegang akses pengawasan makro ke seluruh 7 jurusan di universitas untuk memonitor daya serap kerja, mengawal SLA kepatuhan pengiriman feedback mitra, dan mengelola jaringan kemitraan industri.

---

## 2. Struktur Proyek

```
frontend/          Aplikasi Web (Next.js 16, App Router, Atomic Design, Motion)
backend/           Layanan REST API (Golang, Auth HMAC, RBAC, Job Worker)
ai-engine/         Mesin Pemrosesan Cerdas (FastAPI Python, Evidence Scoring, Prompt Guard)
docker-compose.yml Layanan lokal (PostgreSQL + pgvector & AI Engine)
```

---

## 3. Menjalankan Lingkungan Lokal

1. **Jalankan Database dan Layanan Pendukung:**
   ```bash
   docker compose up -d
   ```

2. **Jalankan Backend (Golang API):**
   ```bash
   cd backend
   go run cmd/api/main.go
   ```

3. **Jalankan Frontend (Next.js):**
   ```bash
   cd frontend
   npm run dev
   ```

Akses aplikasi di browser melalui `http://localhost:3000`.
