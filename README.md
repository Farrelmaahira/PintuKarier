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

Kalau port 3000 sudah dipakai proyek lain, Next.js pindah sendiri ke 3001 dan seterusnya. Backend hanya menerima upload CV dari origin yang tertulis di `WEB_ORIGIN`, jadi tambahkan port yang dipakai ke variabel itu.

---

## 4. Akun Demo

Akun demo berisi data fiktif: 5 mahasiswa, 8 kandidat, lowongan, pertanyaan prescreening dan interview, serta 2 catatan prodi. Semua akun memakai password yang sama. Jangan dipakai untuk data nyata.

| Peran | Email | Nama | Password |
|---|---|---|---|
| Mahasiswa | `raka@demo.pintukarier.id` | Raka Demo | `demo12345` |
| HRD | `rani@demo.pintukarier.id` | Rani Demo | `demo12345` |
| Prodi | `anita@demo.pintukarier.id` | Anita Demo | `demo12345` |
| Admin | `admin@demo.pintukarier.id` | Admin Demo | `demo12345` |

Di halaman login ada tombol untuk mengisi email dan password peran yang dipilih. Nilainya ditulis di `frontend/components/organisms/LoginPanel.tsx`. Kalau password di backend diganti, ubah juga di file itu.

### Mengaktifkan akun demo

Akun tidak ada bawaan di kode. Backend membuatnya satu kali saat start jika `backend/.env` berisi:

```env
PINTUKARIER_SEED_DEMO=1

DEMO_MAHASISWA_EMAIL=raka@demo.pintukarier.id
DEMO_MAHASISWA_PASSWORD=demo12345
DEMO_MAHASISWA_NAMA=Raka Demo
DEMO_HRD_EMAIL=rani@demo.pintukarier.id
DEMO_HRD_PASSWORD=demo12345
DEMO_HRD_NAMA=Rani Demo
DEMO_PRODI_EMAIL=anita@demo.pintukarier.id
DEMO_PRODI_PASSWORD=demo12345
DEMO_PRODI_NAMA=Anita Demo
DEMO_ADMIN_EMAIL=admin@demo.pintukarier.id
DEMO_ADMIN_PASSWORD=demo12345
DEMO_ADMIN_NAMA=Admin Demo
```

- Akun admin hanya dibuat kalau `DEMO_ADMIN_EMAIL` diisi.
- Tiga variabel (email, password, nama) wajib lengkap untuk tiap peran. Kalau ada yang kosong, backend berhenti dengan daftar variabel yang kurang.
- Seed berjalan sekali. Kalau `u-demo-hrd` sudah ada di database, seed dilewati. Untuk mengganti akun, reset database.
- Akun produksi (`PROD_*` dengan `PINTUKARIER_SEED_PROD=1`) terpisah dari akun demo dan tidak dicantumkan di sini. Passwordnya diisi lewat env.

---

## 5. Pengujian

Hasil di bawah dijalankan pada 8 November 2026, dari working tree di atas commit `e4c20d4` (termasuk perubahan yang belum di-commit).

| Komponen | Alat | Versi |
|---|---|---|
| Backend | Go | 1.26.0 |
| AI Engine | Python, pytest | 3.12.15, 9.0.3 |
| Frontend | Node.js, Next.js | 26.12.1, 16.4.3 |
| Database tes | PostgreSQL | 16 (Azure Database for PostgreSQL Flexible Server) |

### 5.1 Ringkasan hasil

| Lapis | Perintah | Hasil |
|---|---|---|
| Backend, analisis statis | `go vet ./...` | Bersih |
| Backend, tes otomatis | `go test ./...` | 63 tes dan 4 subtes lulus, 0 gagal, 0 dilewati |
| AI Engine, tes otomatis | `pytest` | 40 tes lulus, 0 gagal |
| AI Engine, tipe | `mypy app` | 0 masalah di 17 berkas |
| Frontend, tipe | `tsc --noEmit` | Bersih |
| Uji asap deploy Azure | Lihat 5.3 | 28 kasus uji (35 pemeriksaan, karena beberapa kasus mencakup lebih dari satu langkah) semuanya sesuai harapan |
| AI Engine, lint | `ruff check .` | 2 temuan, belum diperbaiki (5.5) |
| Frontend, lint | `eslint .` | 10 error dan 5 peringatan, belum diperbaiki (5.5) |

Tes backend yang butuh database tidak dilewati. Tes itu membuat database sementara, menjalankan skema, lalu menghapusnya. Setelah run selesai tidak ada database sementara yang tersisa di server.

### 5.2 Tes otomatis

**Backend (Go)**

| Paket | Tes | Yang diperiksa |
|---|---|---|
| `internal/domain` | 8 | Ambang kategori skor, bobot dimensi berjumlah 100, hasil skor sama dengan contoh di proposal, bukti wajib punya kutipan, minimum 10 kandidat, validasi peran, periode, pemetaan mata kuliah |
| `internal/usecase` | 31 (+4 subtes) | Token HMAC (terbit, kedaluwarsa, dirusak, peran tidak valid), hash password, validasi email, link upload bertanda tangan, koreksi kategori oleh HRD, skor dari keluaran AI (bukti kosong, bukti tidak valid, syarat wajib kosong), filter peringkat prodi di bawah 10 kandidat, membuat dan mengubah lowongan, melamar, pipeline analisis (tunggu transkrip, error permanen tidak diulang) |
| `internal/adapter/http` | 2 | Rute tidak dikenal mengembalikan JSON, `/health` |
| `internal/adapter/http/handlers` | 4 | Setiap rute menolak peran lain, middleware peran, CORS hanya untuk origin terdaftar, alur penuh tiga peran dengan AI palsu |
| `internal/adapter/postgres` | 13 | CRUD dan job di Postgres sungguhan, benchmark, seed demo, seed produksi (akun, lowongan, lamaran, referensi JSON valid, dijalankan dua kali tanpa error) |
| `internal/adapter/storage` | 5 | Menolak file lebih dari batas, ekstensi tidak diizinkan, path traversal; menerima PDF; baca ulang file |

**AI Engine (pytest)**

| Berkas | Tes | Yang diperiksa |
|---|---|---|
| `test_score.py` | 9 | Kutipan bukti harus ada di teks sumber, kutipan karangan diturunkan statusnya, satu probe per dimensi, kontrak respons skor, injeksi prompt ditandai dengan teks persisnya, keluaran model rusak menghasilkan 502 |
| `test_prompt_guard.py` | 8 | CV biasa lolos; instruksi menimpa, penanda korpus dengan huruf mirip, pemisah penyamaran, leetspeak, dan instruksi bahasa Indonesia ditolak |
| `test_security.py` | 4 | Tanpa key dan key salah ditolak, gagal tertutup bila server tanpa key, `/healthz` dan `/readyz` tidak dikunci |
| `test_questions_feedback.py` | 6 | Tiga pertanyaan per kelompok, fallback bila model rusak, struktur feedback draf, 502 bila malformed, validasi dan batas ukuran file |
| `test_parse_cv.py` | 5 | Parse profil, identitas (NIM, kampus, semester, IPK) yang tidak tertulis di CV dibuang, JSON rusak jatuh ke kosong, transkripsi gambar |
| `test_ocr_validator.py` | 5 | Karakter lebar nol dibuang, bukti terverifikasi, perlu ditinjau bila cocok sebagian, injeksi prompt ditolak, fallback untuk teks yang tidak bisa dipindai |
| `test_benchmark.py` | 2 | Benchmark per fitur, semua model gagal mengembalikan 502 |
| `test_health.py` | 1 | `/healthz` |

Tes AI Engine mengganti provider dengan kelas palsu (`_Fake` di tiap berkas tes, lewat `monkeypatch`). Tidak ada tes yang memanggil Groq atau Gemini sungguhan.

### 5.3 Uji asap di Azure

Dijalankan lewat `curl` terhadap backend dan AI Engine yang sudah ter-deploy. `$API` adalah URL backend, `$ML` URL AI Engine. Seluruh tabel dijalankan ulang setelah backend di-deploy pada 8 November 2026 pukul 13:01 UTC, dengan hasil yang sama. TC-24 sampai TC-28 ditambahkan untuk fitur ubah dan hapus lowongan di deploy itu. TC-25 dan TC-28 memakai lowongan buatan penguji yang dihapus di akhir, jadi data demo tidak berubah.

| No | Skenario | Harapan | Hasil |
|---|---|---|---|
| TC-01 | `GET $API/health` | 200 | 200 |
| TC-02 | `GET $ML/healthz` | 200 | 200 |
| TC-03 | Login mahasiswa demo | 200, peran `mahasiswa` | Sesuai |
| TC-04 | Login HRD demo | 200, peran `hrd` | Sesuai |
| TC-05 | Login prodi demo | 200, peran `prodi` | Sesuai |
| TC-06 | Login admin demo | 200, peran `admin` | Sesuai |
| TC-07 | Login 4 akun produksi (1 per peran) | 200 | 200 semua |
| TC-08 | Login dengan password salah | 401 | 401 |
| TC-09 | `GET /admin/overview` tanpa token | 401 | 401 |
| TC-10 | `GET /admin/overview` dengan token mahasiswa | 403 | 403 |
| TC-11 | `GET /admin/overview` dengan token admin | 200 | 200 |
| TC-12 | AI Engine `POST /v1/questions` tanpa key | 401 | 401 |
| TC-13 | AI Engine dengan `X-Internal-Api-Key` salah | 401 | 401 |
| TC-14 | AI Engine dengan key benar dan body kosong | 422 (lolos auth, body ditolak) | 422 |
| TC-15 | Preflight CORS dari origin yang terdaftar | Header `Access-Control-Allow-Origin` ada | Ada |
| TC-16 | Preflight CORS dari origin asing | Header tidak ada | Tidak ada |
| TC-17 | Minta link upload 6 MB | 413 | 413 |
| TC-18 | Minta link upload `cv.exe` | 400 | 400 |
| TC-19 | `PUT` dengan tanda tangan link diubah | 403 | 403 |
| TC-20 | `PUT` berkas `.pdf` yang isinya teks biasa | 415 | 415 |
| TC-21 | `PUT` PDF valid | 201 | 201 |
| TC-22 | `PUT` ulang ke link yang sama | 409 | 409 |
| TC-23 | Selesai upload lalu pantau job ekstrak CV profil | Job `succeeded` | `succeeded` dalam 3,9 detik |
| TC-24 | `PATCH /lowongan/{id}` dengan token mahasiswa | 403 | 403 |
| TC-25 | HRD membuat lowongan, mengubah posisi, lokasi, dan tipe, lalu `GET` lowongan itu | 201, 200, dan `GET` menampilkan nilai baru | Sesuai |
| TC-26 | `PATCH` dengan deadline berformat `31-12-2026`, tipe `Freelance`, atau syarat wajib kosong | 400 untuk ketiganya | 400 untuk ketiganya |
| TC-27 | `DELETE /lowongan/{id}` dengan token mahasiswa | 403 | 403 |
| TC-28 | HRD pemilik menghapus lowongan, lalu `GET` lowongan itu | 204, lalu 404 | 204, lalu 404 |

Untuk mengulang TC-21 sampai TC-23: login, `POST /me/cv` dengan `{"nama":"cv.pdf","ukuran":<byte>}`, `PUT` berkas ke `uploadUrl` dari respons, `POST /me/cv/selesai` dengan `{"key":"<key>"}`, lalu `GET /jobs/<id>` sampai statusnya `succeeded` atau `failed`.

### 5.4 Temuan selama pengujian

| No | Temuan | Dampak | Status |
|---|---|---|---|
| 1 | `backend/internal/adapter/postgres/testdb.go` membuat database sementara dengan nama berawalan huruf besar tanpa kutip. Postgres melipatnya jadi huruf kecil, sedangkan URL koneksi peka huruf. | 7 tes integrasi gagal di Postgres mana pun, bukan hanya di Azure | Diperbaiki: awalan jadi `pintukarier_tmp_` |
| 2 | `rapidfuzz` dipakai `ai-engine/app/ocr_validator.py` tetapi tidak ada di `requirements.txt` | `test_ocr_validator.py` gagal saat dikumpulkan | Diperbaiki: `rapidfuzz==3.14.6` ditambahkan |
| 3 | `test_ground_identitas_keeps_only_what_the_cv_says` masih mengharapkan semester kosong. Sejak commit `3614cbb` parser mengambil semester dari teks CV. | 1 tes gagal | Diperbaiki: ekspektasi jadi `semester=6`, sama dengan yang tertulis di CV uji |
| 4 | Worker job di backend Azure berhenti mengambil job, padahal proses masih melayani HTTP. Job `parse_cv` mengantre lebih dari 4 menit dengan `attempts = 0`. Hidup lagi setelah restart. | Pengguna melihat "Menunggu antrean AI" sangat lama | Dimitigasi: operasi klaim dan penutupan job diberi batas 20 detik (`worker.go`), pool koneksi diberi masa pakai. Dugaan penyebab adalah koneksi DB yang putus diam-diam. Belum terbukti, jadi pantau log. |
| 5 | Upload CV dari browser gagal dengan "failed to fetch" karena origin frontend (`localhost:3001`) tidak ada di `WEB_ORIGIN` backend | Ekstrak CV tidak bisa dipakai dari FE lokal | Diperbaiki: origin ditambahkan di pengaturan Azure |
| 6 | Contoh perintah tes di `backend/README.md` memuat URL koneksi yang rusak (`Pintu Karier:Pintu Karier@...`) | Perintah tidak bisa dijalankan | Diperbaiki |

### 5.5 Masalah yang belum diperbaiki

- **ESLint frontend:** 10 error dan 5 peringatan. Error: `any` eksplisit di `app/files/[key]/route.ts` dan `ProdiStudentManager.tsx`, interface kosong di `lib/data/claim.ts`, dan `setState` sinkron di dalam `useEffect` pada `ProdiStudentManager.tsx` serta lima hook (`useAdminCareerCenter`, `useAdminLearningManager`, `useClaimEvidence`, `useLearningHub`, `useReadinessTracker`). Peringatan: variabel dan impor tidak terpakai, satu `<img>`, satu dependensi `useEffect` yang kurang.
- **Ruff AI Engine:** impor tidak terpakai di `app/ocr_validator.py` (`_normalize_for_detection`) dan `tests/test_ocr_validator.py` (`pytest`). Bisa diperbaiki dengan `ruff check --fix`.
- **`app/ocr_validator.py`** lulus semua tesnya, tetapi belum diimpor oleh router mana pun di AI Engine. Validasi bukti klaim belum berjalan di layanan yang ter-deploy.

### 5.6 Yang belum diuji

- Tidak ada tes otomatis untuk frontend (unit maupun end-to-end), `cmd/api`, `cmd/seed`, dan klien `internal/adapter/aiengine`.
- Alur lengkap lamaran, analisis AI, penilaian HRD, sampai feedback belum dijalankan di Azure. Yang diuji di Azure baru login, otorisasi per peran, dan ekstrak CV profil.
- Hapus lowongan yang sudah punya pelamar (harus 409) dan ubah atau hapus lowongan milik HRD lain (ditolak oleh `ownedVacancy`) belum dicoba di Azure. Dua kasus itu hanya terbaca dari kodenya.
- Upload dari browser sungguhan belum diuji. Skenario TC-15 sampai TC-22 meniru permintaan browser lewat `curl`.
- Kualitas keluaran model Groq dan Gemini yang asli tidak diukur oleh tes mana pun.
- Beban 500 kandidat dalam 30 menit (target di `backend/README.md`) belum diukur.

### 5.7 Menjalankan tes

```bash
# Backend. Postgres dari docker compose, user pintukarier, port 5433.
cd backend
go vet ./...
PINTUKARIER_TEST_DATABASE_URL='postgres://pintukarier:pintukarier_dev_password@localhost:5433/postgres?sslmode=disable' go test ./...

# AI Engine. Python 3.12.
cd ai-engine
pip install -r requirements-dev.txt
pytest
mypy app
ruff check .

# Frontend
cd frontend
npm run typecheck
npm run lint
```

Tanpa `PINTUKARIER_TEST_DATABASE_URL`, tes backend yang butuh database dilewati, bukan gagal. Akun database harus boleh membuat database (`CREATEDB`).
