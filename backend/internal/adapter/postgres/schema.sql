-- shortcut: skema idempoten dijalankan saat start; ganti ke golang-migrate saat kolom mulai berubah.
CREATE TABLE IF NOT EXISTS users (
	id            TEXT PRIMARY KEY,
	email         TEXT NOT NULL UNIQUE,
	password_hash TEXT NOT NULL,
	peran         TEXT NOT NULL,
	nama          TEXT NOT NULL,
	instansi      TEXT NOT NULL DEFAULT '',
	nim           TEXT NOT NULL DEFAULT '',
	kampus        TEXT NOT NULL DEFAULT '',
	semester      INT NOT NULL DEFAULT 0,
	ipk           DOUBLE PRECISION NOT NULL DEFAULT 0,
	ringkasan     TEXT NOT NULL DEFAULT '',
	skill         JSONB NOT NULL DEFAULT '[]',
	created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS lowongan (
	id              TEXT PRIMARY KEY,
	posisi          TEXT NOT NULL,
	perusahaan      TEXT NOT NULL,
	bidang          TEXT NOT NULL,
	lokasi          TEXT NOT NULL DEFAULT '',
	tipe            TEXT NOT NULL,
	deskripsi       TEXT NOT NULL DEFAULT '',
	deadline        DATE,
	wajib           JSONB NOT NULL DEFAULT '[]',
	plus            JSONB NOT NULL DEFAULT '[]',
	prescreen_tanya JSONB NOT NULL DEFAULT '[]',
	interview_tanya JSONB NOT NULL DEFAULT '[]',
	created_by      TEXT NOT NULL REFERENCES users(id),
	created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS lamaran (
	id           TEXT PRIMARY KEY,
	lowongan_id  TEXT NOT NULL REFERENCES lowongan(id),
	mahasiswa_id TEXT NOT NULL REFERENCES users(id),
	tahap        TEXT NOT NULL,
	cv_key       TEXT NOT NULL DEFAULT '',
	cv_teks      TEXT NOT NULL DEFAULT '',
	profil       JSONB NOT NULL DEFAULT '{}',
	prescreen    JSONB NOT NULL DEFAULT '[]',
	created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
	updated_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
	UNIQUE (lowongan_id, mahasiswa_id)
);
CREATE INDEX IF NOT EXISTS lamaran_lowongan_tahap ON lamaran (lowongan_id, tahap);

CREATE TABLE IF NOT EXISTS jawaban_interview (
	lamaran_id TEXT NOT NULL REFERENCES lamaran(id),
	nomor      INT NOT NULL,
	tanya      TEXT NOT NULL,
	audio_key  TEXT NOT NULL,
	transkrip  TEXT NOT NULL DEFAULT '',
	durasi     INT NOT NULL DEFAULT 0,
	PRIMARY KEY (lamaran_id, nomor)
);

-- Hasil AI dan keputusan HRD satu baris per lamaran. kategori_ai dan kategori_hrd
-- disimpan terpisah untuk mengukur kesepakatan AI dan HRD (README bagian 6).
CREATE TABLE IF NOT EXISTS hasil (
	lamaran_id      TEXT PRIMARY KEY REFERENCES lamaran(id),
	dimensi         JSONB NOT NULL,
	total           DOUBLE PRECISION NOT NULL,
	kategori_ai     TEXT NOT NULL,
	wajib_hilang    BOOLEAN NOT NULL,
	alasan          TEXT NOT NULL,
	bukti           JSONB NOT NULL,
	peringatan      TEXT NOT NULL DEFAULT '',
	draft_feedback  JSONB NOT NULL DEFAULT '{}',
	versi           TEXT NOT NULL DEFAULT '',
	dinilai_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
	kategori_hrd    TEXT NOT NULL DEFAULT '',
	alasan_koreksi  TEXT NOT NULL DEFAULT '',
	keputusan       TEXT NOT NULL DEFAULT 'Belum diputuskan',
	feedback        JSONB,
	feedback_oleh   TEXT NOT NULL DEFAULT '',
	feedback_at     TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS jobs (
	id         TEXT PRIMARY KEY,
	kind       TEXT NOT NULL,
	ref_id     TEXT NOT NULL,
	idem_key   TEXT NOT NULL UNIQUE,
	status     TEXT NOT NULL,
	attempts   INT NOT NULL DEFAULT 0,
	error      TEXT NOT NULL DEFAULT '',
	run_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
	created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS jobs_ready ON jobs (status, run_at);

CREATE TABLE IF NOT EXISTS catatan (
	id         TEXT PRIMARY KEY,
	prodi      TEXT NOT NULL,
	kompetensi TEXT NOT NULL,
	matkul     TEXT NOT NULL DEFAULT '',
	aksi       TEXT NOT NULL,
	oleh       TEXT NOT NULL,
	status     TEXT NOT NULL,
	created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Hasil benchmark model AI terakhir, satu baris saja. Backend yang mengisinya dari AI Engine
-- (instance Cloud Run bisa mati kapan saja, jadi hasilnya tidak boleh hanya di memori).
CREATE TABLE IF NOT EXISTS benchmark (
	id        INT PRIMARY KEY CHECK (id = 1),
	hasil     JSONB NOT NULL,
	diukur_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Bukti verifikasi per item klaim sertifikasi / kompetensi di CV mahasiswa.
CREATE TABLE IF NOT EXISTS claim_evidences (
	id                 TEXT PRIMARY KEY,
	application_id     TEXT NOT NULL REFERENCES lamaran(id) ON DELETE CASCADE,
	student_id         TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
	claim_type         TEXT NOT NULL DEFAULT 'sertifikasi',
	title              TEXT NOT NULL,
	issuer             TEXT NOT NULL DEFAULT '',
	year               TEXT NOT NULL DEFAULT '',
	context            TEXT NOT NULL DEFAULT '',
	file_key           TEXT NOT NULL DEFAULT '',
	file_name          TEXT NOT NULL DEFAULT '',
	status             TEXT NOT NULL DEFAULT 'pending_upload',
	match_confidence   DOUBLE PRECISION NOT NULL DEFAULT 0,
	verification_notes TEXT NOT NULL DEFAULT '',
	created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
	updated_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS claim_evidences_student ON claim_evidences (student_id);
CREATE INDEX IF NOT EXISTS claim_evidences_app ON claim_evidences (application_id);

