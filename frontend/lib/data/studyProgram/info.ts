/** Dasbor Prodi (Fitur 4). Semua angka fiktif, hanya agregat. */
export const STUDY_PROGRAM = {
  name: "D4 Teknik Informatika",
  department: "Jurusan Teknik Informatika dan Komputer",
  campus: "Politeknik Negeri Jakarta",
  /** Kelompok dengan kandidat di bawah angka ini tidak ditampilkan. */
  minCandidates: 10,
};

export const PERIODS = [
  "Gasal 2026/2027",
  "Genap 2025/2026",
  "Gasal 2025/2026",
];

export const POSITIONS = [
  "Semua posisi",
  "Software Developer",
  "Data & Analitik",
  "Jaringan & Infrastruktur",
  "QA & Testing",
];

/** Mata kuliah yang paling dekat dengan tiap kompetensi, buat saran tindak lanjut. */
export const COURSE_BY_COMPETENCY: Record<string, string> = {
  "Testing otomatis": "Pengujian Perangkat Lunak",
  TypeScript: "Pemrograman Web Lanjut",
  "Git dan code review": "Proyek Perangkat Lunak (PBL)",
  "SQL lanjutan": "Basis Data Lanjut",
  "Integrasi REST API": "Pemrograman Web Lanjut",
  "Visualisasi data": "Visualisasi Data",
  "Statistik inferensial": "Statistika dan Probabilitas",
  "Cloud dasar (AWS/GCP)": "Komputasi Awan",
  "Docker dan deployment": "Komputasi Awan",
  "Konfigurasi VLAN": "Jaringan Komputer Lanjut",
  "Keamanan jaringan": "Keamanan Informasi",
  "Linux server": "Sistem Operasi",
  "Komunikasi teknis": "Bahasa Indonesia untuk Komunikasi Ilmiah",
  "Python untuk data": "Pemrograman Python",
};
