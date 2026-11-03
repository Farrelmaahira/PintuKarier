import type { CurriculumRecommendation } from "./types";

export const CURRICULUM_RECOMMENDATIONS: CurriculumRecommendation[] = [
  {
    id: "rec-test",
    competency: "Testing otomatis",
    course: "Pengujian Perangkat Lunak",
    semester: 5,
    deficit:
      "64% kandidat belum memiliki bukti unit testing atau e2e di portofolio",
    newModules: [
      {
        title: "Unit Testing & Mocking REST API",
        description:
          "Praktek penulisan test suite memakai Jest/Vitest pada komponen React dan handler endpoint API.",
        schedule: "Minggu 7–8 (4 SKS Lab)",
      },
      {
        title: "End-to-End Test Automation dengan Playwright",
        description:
          "Simulasi alur pengguna: login, submit form lamaran, dan validasi respons visual aplikasi.",
        schedule: "Minggu 11–12 (4 SKS Lab)",
      },
    ],
    pblProject:
      "Membuat CI Pipeline di GitHub Actions yang wajib lolos 80% code coverage sebelum merge PR di proyek PBL semester.",
    partnerCertification: "ISTQB Foundation Level / Cypress Automation Specialist",
  },
  {
    id: "rec-git",
    competency: "Git dan code review",
    course: "Proyek Perangkat Lunak (PBL)",
    semester: 6,
    deficit:
      "52% mahasiswa terbiasa commit langsung ke branch main tanpa peer review",
    newModules: [
      {
        title: "Trunk-Based Development & Feature Branching",
        description:
          "Standarisasi git branch naming, commit konvensional, dan resolusi merge conflict secara aman.",
        schedule: "Minggu 2–3 (Workshop Praktis)",
      },
      {
        title: "Prosedur Pull Request & Code Review Efektif",
        description:
          "Rubrik penilaian review kode teman sebaya (security, maintainability, readability) sebelum disetujui dosen pembimbing.",
        schedule: "Minggu 5–6 (Review berkala)",
      },
    ],
    pblProject:
      "Setiap tim proyek wajib mencantumkan tautan PR dengan minimal 2 review terdokumentasi dalam laporan akhir.",
    partnerCertification: "GitHub Foundations Certification",
  },
  {
    id: "rec-sql",
    competency: "SQL lanjutan",
    course: "Basis Data Lanjut",
    semester: 4,
    deficit: "47% kandidat gugur saat tes JOIN multi-tabel dan window function",
    newModules: [
      {
        title: "Analisis Agregasi Kompleks & Window Functions",
        description:
          "Penggunaan ROW_NUMBER(), RANK(), LEAD(), LAG(), dan PARTITION BY pada dataset riil transaksi perbankan mitra.",
        schedule: "Minggu 9–10 (Praktikum Basis Data)",
      },
      {
        title: "Indexing Strategy & Query Optimization",
        description:
          "Analisis EXPLAIN ANALYZE PostgreSQL untuk mencegah slow query pada tabel jutaan baris.",
        schedule: "Minggu 13–14 (Optimasi Query)",
      },
    ],
    pblProject:
      "Studi kasus optimasi query sistem pergudangan logistik mitra dengan perbaikan latensi respons minimal 40%.",
    partnerCertification: "PostgreSQL Certified Associate / Oracle Database SQL",
  },
];
