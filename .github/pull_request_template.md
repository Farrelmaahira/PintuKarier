## 🎯 Ringkasan Pull Request (PR)

### 📌 Jenis Perubahan
- [x] **Fitur Baru (New Feature)**: Modul & Layanan Baru
- [x] **Penyempurnaan Arsitektur & Perbaikan (Improvement & Refactoring)**
- [x] **Dokumentasi & API Contract**

---

## 🚀 Fitur Baru & Peningkatan yang Diimplementasikan

### 1. **Readiness Tracker Mahasiswa (`/mahasiswa/readiness`)**
- Visualisasi skor kesiapan kerja (0–100) dan tier status kesiapan vokasi.
- Evaluasi berbasis **5 Dimensi Bukti Portofolio** (Relevansi Matkul, Riwayat Proyek PBL, Kesiapan Interview Teknis, Soft Skill & Komunikasi, Sertifikasi Industri).
- Matriks gap kompetensi teknis & soft skills terperinci dengan status `mastered`, `in-progress`, dan `gap`.
- Riwayat linimasa kenaikan skor dan rekomendasi tindakan taktis.

### 2. **Learning Hub & Interactive Drills (`/mahasiswa/learning-hub`)**
- Kurasi materi industri terarah berdasarkan kesenjangan kompetensi hasil seleksi.
- Filter kategori adaptif: *Database*, *Arsitektur Sistem*, *Cloud & DevOps*, *Keamanan Sistem*, dan *Soft Skill*.
- **Interactive Drill Modal**: Studi kasus nyata industri (*real-world engineering scenarios*) dengan opsi jawaban, evaluasi terparameterisasi di backend, umpan balik komprehensif, dan instant readiness score boost.

### 3. **Admin Pusat Karier Kampus (`/admin`)**
- Pemantauan makro lintas **7 Jurusan Politeknik Negeri Jakarta** (Teknik Informatika & Komputer, Teknik Sipil, Teknik Mesin, Teknik Elektro, Teknik Grafika dan Penerbitan, Akuntansi, Administrasi Niaga).
- Dashboard kemitraan industri dan audit SLA respons feedback mahasiswa.

---

## 🛡️ Standar Kualitas & Keamanan (Security & Antislop)

- [x] **Backend Security**:
  - Parameterized Queries (`$1`, `$2`) untuk mencegah SQL Injection.
  - Role-Based Access Control (`mhsOnly`, `adminOnly`) untuk mencegah IDOR.
  - MIME-type & ukuran file validasi pada upload endpoint.
- [x] **Frontend Engineering Standards**:
  - 100% data contract menggunakan `interface` (tanpa `type`).
  - Pemisahan total logika ke Custom Hook (`useReadinessTracker`, `useLearningHub`, `useAdminCareerCenter`).
  - Reusable Atomic Components berorientasi performa.
  - Standar visual Pintu Karier: `#f7f7f7` paper, `#000f1d` ink, `2px solid` border, tanpa drop shadow generik atau AI gradients.
  - Deklarasi fungsi React konsisten (`export function`).

---

## 🧪 Panduan Pengujian Lokal (Verification Steps)

1. Jalankan layanan:
   ```bash
   docker compose up -d
   ```
2. Jalankan Backend Golang:
   ```bash
   cd backend && go run cmd/api/main.go
   ```
3. Jalankan Frontend Next.js:
   ```bash
   cd frontend && npm run dev
   ```
4. Login menggunakan akun demo mahasiswa:
   - Email: `raka@demo.pintukarier.id`
   - Password: `demo12345`
5. Buka `/mahasiswa/readiness` dan `/mahasiswa/learning-hub`. Coba selesaikan satu Interactive Drill untuk memverifikasi penambahan skor kesiapan kerja secara real-time.
