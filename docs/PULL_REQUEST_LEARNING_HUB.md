# Permohonan Pull Request: Integrasi Learning Hub & Interactive Competency Drills

**Target Branch:** `main` (Repository: `Farrelmaahira/PintuKarier`)  
**Source Branch:** `feat/learning-hub`  
**Direct PR URL:** [Buat Pull Request di GitHub](https://github.com/Farrelmaahira/PintuKarier/pull/new/feat/learning-hub)

---

## 📌 Deskripsi Pull Request

Pull Request ini menghadirkan fitur **Learning Hub** bagi mahasiswa vokasi, yang berfungsi sebagai jembatan penutup kesenjangan kompetensi (*Competency Gap Closure*) yang terdeteksi secara otomatis dari hasil seleksi industri dan evaluasi **Readiness Tracker**.

### 🌟 Fitur Baru & Peningkatan:

1. **Learning Hub Dashboard (`/mahasiswa/learning-hub`)**:
   - Menampilkan total poin kesiapan kerja yang diperoleh dari penyelesaian drill.
   - Menyediakan katalog kurasi materi industri berdasarkan kategori relevan (*Database*, *Arsitektur Sistem*, *Cloud & DevOps*, *Keamanan Sistem*, *Soft Skill*).
   - Indikator estimasi penambahan skor per modul materi.

2. **Interactive Drill Engine**:
   - Menyajikan skenario studi kasus riil industri (misal: optimasi indexing PostgreSQL pada 500k baris, boundary clean architecture pada handler HTTP).
   - Pemilihan opsi terstruktur dengan evaluasi instan di backend (`POST /me/learning/drill`).
   - Penjelasan teknis mendalam dan penambahan skor kesiapan kerja secara interaktif.

3. **Backend Robustness & Data Persistence**:
   - `backend/internal/domain/learning.go`: Entitas domain modul belajar dan drill interaktif.
   - `backend/internal/adapter/postgres/store_learning.go`: Kueri terparameterisasi dengan dukungan korelasi profil program studi mahasiswa PNJ.
   - `backend/internal/adapter/http/handlers/handlers_learning.go`: Proteksi peran mahasiswa dengan validasi ketat payload JSON.

4. **Kepatuhan Antislop & Aturan Rekayasa**:
   - Kontrak data frontend murni `interface` (tanpa `type`).
   - Seluruh logika terisolasi di custom hook `useLearningHub`.
   - Gaya antarmuka brutalis monokrom konsisten dengan Pintu Karier.

---

## 🔗 Tautan Review Langsung
- Cabang: `https://github.com/Farrelmaahira/PintuKarier/tree/feat/learning-hub`
- Perbandingan & Merge: `https://github.com/Farrelmaahira/PintuKarier/compare/main...feat/learning-hub`
