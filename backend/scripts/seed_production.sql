-- ============================================================
-- SQL Seed Akun Produksi Pintu Karier (1 Akun per Role)
-- Hash password dihitung menggunakan PBKDF2-SHA256 (600.000 iterasi)
-- Format: pbkdf2$<iter>$<salt_base64>$<key_base64>
-- Sesuai dengan spesifikasi usecase.CheckPassword backend Pintu Karier
-- ============================================================

-- Role 1: admin
-- Email         : admin@pintukarier.id
-- Password Bawaan: Pintu KarierProd2026!
INSERT INTO users (id, email, password_hash, peran, nama, instansi, nim, kampus, semester, ipk, ringkasan, skill, created_at)
VALUES (
    'u-prod-admin',
    'admin@pintukarier.id',
    'pbkdf2$600000$X8eDC2nMMnNe0v9yglL13w$fCgMPhklHjIvcewWxC+q1dKMggEyElRt4lhI3yxgW2M',
    'admin',
    'Administrator Pintu Karier',
    'Pintu Karier System',
    '',
    '',
    0,
    0.00,
    '',
    '[]'::jsonb,
    NOW()
) ON CONFLICT (email) DO NOTHING;

-- Role 2: hrd
-- Email         : hrd@mitra.pintukarier.id
-- Password Bawaan: Pintu KarierProd2026!
INSERT INTO users (id, email, password_hash, peran, nama, instansi, nim, kampus, semester, ipk, ringkasan, skill, created_at)
VALUES (
    'u-prod-hrd',
    'hrd@mitra.pintukarier.id',
    'pbkdf2$600000$Zx8WBKxbQVemKLz9dioQbA$j4Ef3kKbo5Ldh3hfCB4/PlqcIhMBZU4hBikCuyEAXB0',
    'hrd',
    'HRD Mitra Industri',
    'PT Mitra Industri',
    '',
    '',
    0,
    0.00,
    '',
    '[]'::jsonb,
    NOW()
) ON CONFLICT (email) DO NOTHING;

-- Role 3: prodi
-- Email         : prodi@kampus.ac.id
-- Password Bawaan: Pintu KarierProd2026!
INSERT INTO users (id, email, password_hash, peran, nama, instansi, nim, kampus, semester, ipk, ringkasan, skill, created_at)
VALUES (
    'u-prod-prodi',
    'prodi@kampus.ac.id',
    'pbkdf2$600000$BCI1iGXRlaP8jnUVvXu3WA$cND/7Q+4u57X+h7Zh1URXTwElyRVjJsBpoNNMLHQorw',
    'prodi',
    'Koordinator Prodi Vokasi',
    'D4 Teknik Informatika',
    '',
    '',
    0,
    0.00,
    '',
    '[]'::jsonb,
    NOW()
) ON CONFLICT (email) DO NOTHING;

-- Role 4: mahasiswa (5 Mahasiswa)
-- Password Bawaan Semua: Pintu KarierProd2026!
-- Mahasiswa 1:
INSERT INTO users (id, email, password_hash, peran, nama, instansi, nim, kampus, semester, ipk, ringkasan, skill, created_at)
VALUES (
    'u-prod-mahasiswa',
    'mahasiswa@kampus.ac.id',
    'pbkdf2$600000$IiUb3x45gWCNdH5WOGTuYA$aNug4EcW5Sgo5bFaAksYDiCGG0+WZ4bOWRj+u6Bn6oE',
    'mahasiswa',
    'Ahmad Fauzi',
    'D4 Teknik Informatika',
    '2104411001',
    'Politeknik Negeri',
    7,
    3.85,
    'Tertarik pada pengembangan frontend dan integrasi web modern.',
    '["React", "Next.js", "TypeScript"]'::jsonb,
    NOW()
) ON CONFLICT (email) DO NOTHING;

-- Mahasiswa 2:
INSERT INTO users (id, email, password_hash, peran, nama, instansi, nim, kampus, semester, ipk, ringkasan, skill, created_at)
VALUES (
    'u-prod-mahasiswa-2',
    'mahasiswa2@kampus.ac.id',
    'pbkdf2$600000$IiUb3x45gWCNdH5WOGTuYA$aNug4EcW5Sgo5bFaAksYDiCGG0+WZ4bOWRj+u6Bn6oE',
    'mahasiswa',
    'Budi Santoso',
    'D4 Teknik Informatika',
    '2104411002',
    'Politeknik Negeri',
    7,
    3.75,
    'Fokus pada UI/UX responsif dan performa frontend aplikasi web.',
    '["HTML", "CSS", "Tailwind CSS", "React"]'::jsonb,
    NOW()
) ON CONFLICT (email) DO NOTHING;

-- Mahasiswa 3:
INSERT INTO users (id, email, password_hash, peran, nama, instansi, nim, kampus, semester, ipk, ringkasan, skill, created_at)
VALUES (
    'u-prod-mahasiswa-3',
    'mahasiswa3@kampus.ac.id',
    'pbkdf2$600000$IiUb3x45gWCNdH5WOGTuYA$aNug4EcW5Sgo5bFaAksYDiCGG0+WZ4bOWRj+u6Bn6oE',
    'mahasiswa',
    'Citra Dewi',
    'D4 Teknik Informatika',
    '2104411003',
    'Politeknik Negeri',
    7,
    3.90,
    'Antusias pada backend engineering, microservices, dan database relational.',
    '["Golang", "PostgreSQL", "Docker", "REST API"]'::jsonb,
    NOW()
) ON CONFLICT (email) DO NOTHING;

-- Mahasiswa 4:
INSERT INTO users (id, email, password_hash, peran, nama, instansi, nim, kampus, semester, ipk, ringkasan, skill, created_at)
VALUES (
    'u-prod-mahasiswa-4',
    'mahasiswa4@kampus.ac.id',
    'pbkdf2$600000$IiUb3x45gWCNdH5WOGTuYA$aNug4EcW5Sgo5bFaAksYDiCGG0+WZ4bOWRj+u6Bn6oE',
    'mahasiswa',
    'Dimas Pratama',
    'D4 Teknik Informatika',
    '2104411004',
    'Politeknik Negeri',
    7,
    3.65,
    'Tertarik pada sistem backend, perancangan API, dan arsitektur data terdistribusi.',
    '["Golang", "PostgreSQL", "Git", "Redis"]'::jsonb,
    NOW()
) ON CONFLICT (email) DO NOTHING;

-- Mahasiswa 5:
INSERT INTO users (id, email, password_hash, peran, nama, instansi, nim, kampus, semester, ipk, ringkasan, skill, created_at)
VALUES (
    'u-prod-mahasiswa-5',
    'mahasiswa5@kampus.ac.id',
    'pbkdf2$600000$IiUb3x45gWCNdH5WOGTuYA$aNug4EcW5Sgo5bFaAksYDiCGG0+WZ4bOWRj+u6Bn6oE',
    'mahasiswa',
    'Eka Rahmawati',
    'D4 Teknik Informatika',
    '2104411005',
    'Politeknik Negeri',
    7,
    3.80,
    'Memiliki minat tinggi dalam software quality assurance, automated testing, dan CI/CD pipeline.',
    '["Manual Testing", "Test Case Documentation", "Postman", "Cypress"]'::jsonb,
    NOW()
) ON CONFLICT (email) DO NOTHING;

-- ============================================================
-- Data Lowongan Produksi
-- Dibuat oleh HRD Mitra Industri (created_by: u-prod-hrd)
-- ============================================================

-- Lowongan 1: Frontend Developer Intern
INSERT INTO lowongan (
    id, posisi, perusahaan, bidang, lokasi, tipe, deskripsi, deadline, wajib, plus, prescreen_tanya, interview_tanya, created_by, created_at
) VALUES (
    'low-prod-fe',
    'Frontend Developer Intern',
    'PT Mitra Industri',
    'Frontend Development',
    'Jakarta Selatan (Hybrid)',
    'Magang',
    'Program magang intensif Frontend Developer yang berfokus pada pengembangan antarmuka web modern, responsif, dan terintegrasi dengan REST API backend.',
    '2026-12-31',
    '["React atau Next.js", "Git dan kolaborasi tim", "HTML/CSS responsif"]'::jsonb,
    '["TypeScript", "Integrasi REST API", "Testing"]'::jsonb,
    '["Kapan Anda bisa mulai magang?", "Bersedia hybrid di Jakarta Selatan?", "Tautan portofolio atau profil GitHub Anda?"]'::jsonb,
    '["Ceritakan satu proyek frontend yang paling Anda banggakan dan peran Anda di proyek tersebut.", "Pernah menemukan bug layout atau rendering yang rumit? Bagaimana Anda menyelesaikannya?", "Bagaimana pendekatan Anda saat mengintegrasikan API dengan penanganan error yang baik?"]'::jsonb,
    'u-prod-hrd',
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- Lowongan 2: Backend Developer Intern
INSERT INTO lowongan (
    id, posisi, perusahaan, bidang, lokasi, tipe, deskripsi, deadline, wajib, plus, prescreen_tanya, interview_tanya, created_by, created_at
) VALUES (
    'low-prod-be',
    'Backend Developer Intern',
    'PT Mitra Industri',
    'Backend Development',
    'Jakarta Selatan (Hybrid)',
    'Magang',
    'Program magang backend engineer untuk membangun layanan RESTful microservices, perancangan basis data PostgreSQL, dan integrasi kecerdasan buatan.',
    '2026-12-31',
    '["Golang", "Relational Database / PostgreSQL", "REST API design"]'::jsonb,
    '["Docker", "Redis", "Unit Testing"]'::jsonb,
    '["Kapan Anda bisa mulai magang?", "Pernah membangun REST API menggunakan Golang?", "Tautan repository backend yang pernah Anda kerjakan?"]'::jsonb,
    '["Jelaskan arsitektur API atau skema database yang pernah Anda rancang dari awal.", "Bagaimana Anda menangani konkurensi atau transaksi data yang tinggi di Golang?", "Apa strategi Anda dalam menulis unit test dan debugging error di production?"]'::jsonb,
    'u-prod-hrd',
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- Lowongan 3: QA Engineer Intern
INSERT INTO lowongan (
    id, posisi, perusahaan, bidang, lokasi, tipe, deskripsi, deadline, wajib, plus, prescreen_tanya, interview_tanya, created_by, created_at
) VALUES (
    'low-prod-qa',
    'QA Engineer Intern',
    'PT Mitra Industri',
    'Quality Assurance',
    'Jakarta Selatan (Onsite)',
    'Magang',
    'Program magang Quality Assurance untuk menguji kelayakan fungsional sistem, perancangan skenario pengujian (manual & automation), serta pengujian API.',
    '2026-12-31',
    '["Manual Testing", "Test Case Documentation", "Dasar Automation"]'::jsonb,
    '["Cypress atau Playwright", "API Testing (Postman)"]'::jsonb,
    '["Kapan Anda bisa mulai magang?", "Pernah membuat test plan atau skenario pengujian komprehensif?", "Tools pengujian apa saja yang pernah Anda gunakan?"]'::jsonb,
    '["Bagaimana langkah Anda saat menemukan bug kritis beberapa jam sebelum rilis?", "Ceritakan pengalaman Anda membuat test case dan dokumentasi bug di issue tracker.", "Bagaimana Anda memvalidasi response API untuk skenario edge cases?"]'::jsonb,
    'u-prod-hrd',
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- Data Lamaran Produksi
-- Menghubungkan mahasiswa dengan lowongan pekerjaan/magang
-- ============================================================

-- Lamaran 1: Ahmad Fauzi melamar Frontend Developer Intern (tahap: interview_done)
INSERT INTO lamaran (
    id, lowongan_id, mahasiswa_id, tahap, cv_key, cv_teks, profil, prescreen, created_at, updated_at
) VALUES (
    'lam-prod-1',
    'low-prod-fe',
    'u-prod-mahasiswa',
    'interview_done',
    'prod/cv/lam-prod-1.pdf',
    'Curriculum Vitae Ahmad Fauzi. Mahasiswa D4 Teknik Informatika dengan keahlian React, Next.js, dan TypeScript. Mengembangkan proyek sistem portal akademik berbasis web.',
    '{
        "ringkasan": "Mahasiswa D4 TI dengan fokus frontend web modern.",
        "skill": ["React", "Next.js", "TypeScript", "Tailwind CSS", "Git"],
        "pengalaman": [
            {"peran": "Frontend Intern", "tempat": "Lab Rekayasa Perangkat Lunak", "waktu": "Feb 2026 - Jun 2026", "poin": "Membangun komponen antarmuka responsif"}
        ],
        "proyek": [
            {"peran": "Lead Frontend", "tempat": "Proyek Capstone Kampus", "waktu": "Agu 2025 - Des 2025", "poin": "Implementasi SSR dengan Next.js"}
        ],
        "organisasi": [],
        "sertifikasi": ["Frontend Web Developer Certificate"]
    }'::jsonb,
    '[
        {"tanya": "Kapan Anda bisa mulai magang?", "jawab": "Dapat segera mulai awal semester depan (November 2026)."},
        {"tanya": "Bersedia hybrid di Jakarta Selatan?", "jawab": "Ya, saya bersedia dan memiliki domisili yang fleksibel."},
        {"tanya": "Tautan portofolio atau profil GitHub Anda?", "jawab": "https://github.com/ahmadfauzi-dev"}
    ]'::jsonb,
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- Lamaran 2: Budi Santoso melamar Frontend Developer Intern (tahap: prescreening_done)
INSERT INTO lamaran (
    id, lowongan_id, mahasiswa_id, tahap, cv_key, cv_teks, profil, prescreen, created_at, updated_at
) VALUES (
    'lam-prod-2',
    'low-prod-fe',
    'u-prod-mahasiswa-2',
    'prescreening_done',
    'prod/cv/lam-prod-2.pdf',
    'Curriculum Vitae Budi Santoso. Mahasiswa D4 Teknik Informatika, peminatan UI/UX dan implementasi frontend responsif menggunakan React dan Tailwind CSS.',
    '{
        "ringkasan": "Spesialisasi dalam responsive web design dan interaksi antarmuka pengguna.",
        "skill": ["HTML", "CSS", "Tailwind CSS", "React", "Figma"],
        "pengalaman": [],
        "proyek": [
            {"peran": "UI Designer & Frontend", "tempat": "Proyek Magang Mandiri", "waktu": "Jan 2026 - Mei 2026", "poin": "Membuat dashboard analitik responsif"}
        ],
        "organisasi": [],
        "sertifikasi": []
    }'::jsonb,
    '[
        {"tanya": "Kapan Anda bisa mulai magang?", "jawab": "Bisa mulai segera."},
        {"tanya": "Bersedia hybrid di Jakarta Selatan?", "jawab": "Sangat bersedia."},
        {"tanya": "Tautan portofolio atau profil GitHub Anda?", "jawab": "https://github.com/budisantoso-ui"}
    ]'::jsonb,
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- Lamaran 3: Citra Dewi melamar Backend Developer Intern (tahap: scored)
INSERT INTO lamaran (
    id, lowongan_id, mahasiswa_id, tahap, cv_key, cv_teks, profil, prescreen, created_at, updated_at
) VALUES (
    'lam-prod-3',
    'low-prod-be',
    'u-prod-mahasiswa-3',
    'scored',
    'prod/cv/lam-prod-3.pdf',
    'Curriculum Vitae Citra Dewi. Backend Developer dengan keahlian Golang, PostgreSQL, Docker, dan arsitektur REST API.',
    '{
        "ringkasan": "Backend Engineer fokus pada REST API scalable menggunakan Golang dan PostgreSQL.",
        "skill": ["Golang", "PostgreSQL", "Docker", "REST API", "Git"],
        "pengalaman": [
            {"peran": "Backend Contributor", "tempat": "Open Source Campus Project", "waktu": "Sep 2025 - Jan 2026", "poin": "Optimasi database query dan query indexing"}
        ],
        "proyek": [
            {"peran": "Backend Lead", "tempat": "Sistem Informasi Kemahasiswaan", "waktu": "Feb 2026 - Jul 2026", "poin": "Merancang RESTful API dan schema migrations"}
        ],
        "organisasi": [],
        "sertifikasi": ["Database Administration Essentials"]
    }'::jsonb,
    '[
        {"tanya": "Kapan Anda bisa mulai magang?", "jawab": "Bisa mulai 1 Desember 2026."},
        {"tanya": "Pernah membangun REST API menggunakan Golang?", "jawab": "Pernah, menggunakan standar library net/http dan framework Chi dengan PostgreSQL."},
        {"tanya": "Tautan repository backend yang pernah Anda kerjakan?", "jawab": "https://github.com/citradewi-backend"}
    ]'::jsonb,
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- Lamaran 4: Dimas Pratama melamar Backend Developer Intern (tahap: cv_uploaded)
INSERT INTO lamaran (
    id, lowongan_id, mahasiswa_id, tahap, cv_key, cv_teks, profil, prescreen, created_at, updated_at
) VALUES (
    'lam-prod-4',
    'low-prod-be',
    'u-prod-mahasiswa-4',
    'cv_uploaded',
    'prod/cv/lam-prod-4.pdf',
    'Curriculum Vitae Dimas Pratama. Mahasiswa semester 7 D4 Teknik Informatika dengan minat perancangan sistem backend dan basis data.',
    '{
        "ringkasan": "Pengembang perangkat lunak backend pemula dengan dasar ilmu komputer kuat.",
        "skill": ["Golang", "PostgreSQL", "Git", "Redis"],
        "pengalaman": [],
        "proyek": [
            {"peran": "Developer", "tempat": "Tugas Besar Basis Data", "waktu": "Okt 2025 - Des 2025", "poin": "Implementasi schema relational dan query tuning"}
        ],
        "organisasi": [],
        "sertifikasi": []
    }'::jsonb,
    '[]'::jsonb,
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- Lamaran 5: Eka Rahmawati melamar QA Engineer Intern (tahap: applied)
INSERT INTO lamaran (
    id, lowongan_id, mahasiswa_id, tahap, cv_key, cv_teks, profil, prescreen, created_at, updated_at
) VALUES (
    'lam-prod-5',
    'low-prod-qa',
    'u-prod-mahasiswa-5',
    'applied',
    '',
    'Curriculum Vitae Eka Rahmawati. Peminatan Software Quality Assurance, pengujian manual dan otomasi.',
    '{
        "ringkasan": "Antusias dalam memastikan kualitas perangkat lunak bebas dari cacat dan sesuai spesifikasi.",
        "skill": ["Manual Testing", "Test Case Documentation", "Postman", "Cypress"],
        "pengalaman": [],
        "proyek": [
            {"peran": "QA Tester", "tempat": "Proyek Aplikasi Mobile Kampus", "waktu": "Feb 2026 - Mei 2026", "poin": "Membuat dokumen test scenario dan bug report"}
        ],
        "organisasi": [],
        "sertifikasi": []
    }'::jsonb,
    '[]'::jsonb,
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

