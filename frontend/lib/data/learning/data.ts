import { toAppKeys } from "@/lib/apiKeys";
import { ILearningOverview, IDrillSubmissionResult } from "./types";

export const BASELINE_LEARNING_OVERVIEW: ILearningOverview = {
  studentId: "mhs-001",
  totalModules: 5,
  completedModules: 1,
  inProgressModules: 1,
  totalScoreBoost: 15,
  recommendedCategory: "Database & Arsitektur Sistem",
  modules: [
    {
      id: "mod-sql-indexing",
      title: "Optimasi Kueri PostgreSQL & Indexing B-Tree",
      category: "Database",
      difficulty: "Menengah",
      durationMinutes: 45,
      summary: "Pahami cara kerja EXPLAIN ANALYZE, indeks komposit, dan pencegahan sequential scan pada dataset skala besar.",
      competenciesCovered: ["PostgreSQL", "Database Indexing", "Query Optimization"],
      estimatedGain: 8,
      status: "recommended",
      externalResourceUrl: "https://www.postgresql.org/docs/current/indexes-types.html",
    },
    {
      id: "mod-clean-arch",
      title: "Arsitektur Bersih & Boundary Ports-Adapters",
      category: "Arsitektur Sistem",
      difficulty: "Lanjutan",
      durationMinutes: 60,
      summary: "Pisahkan logika domain dari HTTP dan framework database agar sistem modular, mudah diuji, dan minim coupling.",
      competenciesCovered: ["Clean Architecture", "Hexagonal Architecture", "Domain Modeling"],
      estimatedGain: 10,
      status: "in_progress",
      externalResourceUrl: "https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html",
    },
    {
      id: "mod-docker-ci",
      title: "Containerization Multi-Stage & Orchestration Docker",
      category: "Cloud & DevOps",
      difficulty: "Menengah",
      durationMinutes: 40,
      summary: "Bangun image Docker yang ramping dan aman dengan multi-stage builds untuk Golang dan Node.js vokasi.",
      competenciesCovered: ["Docker", "Container Security", "CI/CD Pipeline"],
      estimatedGain: 6,
      status: "recommended",
      externalResourceUrl: "https://docs.docker.com/build/building/multi-stage/",
    },
    {
      id: "mod-api-security",
      title: "Proteksi API: HMAC Signing, Rate Limiting & OWASP",
      category: "Keamanan Sistem",
      difficulty: "Lanjutan",
      durationMinutes: 50,
      summary: "Cegah kerentanan IDOR, Mass Assignment, dan serangan brute-force dengan middleware keamanan standar industri.",
      competenciesCovered: ["API Security", "OWASP Top 10", "HMAC Auth", "IDOR Prevention"],
      estimatedGain: 9,
      status: "recommended",
      externalResourceUrl: "https://owasp.org/www-project-api-security/",
    },
    {
      id: "mod-tech-collab",
      title: "Komunikasi Teknis & Code Review Asinkron",
      category: "Soft Skill & Kolaborasi",
      difficulty: "Dasar",
      durationMinutes: 30,
      summary: "Teknik merumuskan Pull Request yang jelas, memfasilitasi review kode berbobot, dan dokumentasi arsitektur.",
      competenciesCovered: ["Technical Communication", "Git Workflow", "Code Review"],
      estimatedGain: 5,
      status: "completed",
      externalResourceUrl: "https://google.github.io/eng-practices/review/",
    },
  ],
  activeDrills: [
    {
      id: "drill-pg-perf",
      moduleId: "mod-sql-indexing",
      scenario: "Tabel lamaran telah memiliki 500.000 baris. Kueri pencarian berdasarkan mahasiswa_id dan created_at mengalami lonjakan latency hingga 850ms.",
      problemStatement: "Indeks manakah yang paling efektif dan hemat I/O untuk mempercepat kueri tersebut?",
      options: [
        { index: 0, text: "Membuat dua single-column index terpisah pada mahasiswa_id dan created_at." },
        { index: 1, text: "Membuat composite index (mahasiswa_id, created_at DESC) agar matching equality dan sorting terlayani dalam satu index scan." },
        { index: 2, text: "Menjalankan VACUUM FULL pada tabel lamaran secara berkala setiap 5 menit." },
        { index: 3, text: "Menghapus constraint foreign key agar insert dan read tidak memeriksa integritas data." },
      ],
      correctIndex: 1,
      explanation: "Composite index (mahasiswa_id, created_at DESC) memungkinkan PostgreSQL melakukan Index Scan langsung untuk filter equality mahasiswa_id sekaligus urutan created_at tanpa sorting tambahan di memori.",
      readinessBoost: 8,
      targetCompetency: "PostgreSQL Optimization",
    },
    {
      id: "drill-clean-boundary",
      moduleId: "mod-clean-arch",
      scenario: "Seorang engineer memanggil langsung sql.DB.Exec('INSERT INTO ...') di dalam fungsi handler HTTP gin/net-http controller.",
      problemStatement: "Prinsip clean architecture mana yang dilanggar dan bagaimana refaktor yang tepat?",
      options: [
        { index: 0, text: "Tidak ada pelanggaran; memanggil SQL langsung di handler mempercepat waktu respons API." },
        { index: 1, text: "Pelanggaran Separation of Concerns; HTTP handler harus memanggil port Usecase, dan operasi persistensi diisolasi di package Adapter/Postgres." },
        { index: 2, text: "Handler harus diubah menjadi class abstract agar mendukung pewarisan bertingkat." },
        { index: 3, text: "Cukup menambahkan komentar dokumentasi di atas pemanggilan SQL." },
      ],
      correctIndex: 1,
      explanation: "Dalam Clean Architecture, presentation layer (HTTP) tidak boleh bergantung langsung pada persistensi (SQL). Alur dependensi harus mengarah ke dalam melalui antarmuka (ports).",
      readinessBoost: 10,
      targetCompetency: "Clean Architecture",
    },
  ],
};

export async function fetchStudentLearning(): Promise<ILearningOverview> {
  try {
    const res = await fetch("/api/me/learning", {
      cache: "no-store",
    });
    if (!res.ok) {
      return BASELINE_LEARNING_OVERVIEW;
    }
    const data = await res.json();
    return toAppKeys(data) as ILearningOverview;
  } catch {
    return BASELINE_LEARNING_OVERVIEW;
  }
}

export async function submitDrillAnswer(drillId: string, optionIndex: number): Promise<IDrillSubmissionResult> {
  try {
    const res = await fetch("/api/me/learning/drill", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ drill_id: drillId, option_index: optionIndex }),
    });
    if (!res.ok) {
      throw new Error("Gagal mengirim jawaban drill");
    }
    const data = await res.json();
    return toAppKeys(data) as IDrillSubmissionResult;
  } catch {
    // Fallback evaluasi lokal
    const drill = BASELINE_LEARNING_OVERVIEW.activeDrills.find((d) => d.id === drillId);
    const isCorrect = drill ? drill.correctIndex === optionIndex : false;
    return {
      isCorrect,
      pointsEarned: isCorrect ? (drill?.readinessBoost ?? 5) : 0,
      explanation: drill?.explanation ?? "Hasil evaluasi studi kasus tercatat.",
      newOverallScore: isCorrect ? 86 : 78,
    };
  }
}
