import { toAppKeys } from "@/lib/apiKeys";
import { ReadinessProfile } from "./types";

export const INITIAL_READINESS_PROFILE: ReadinessProfile = {
  studentId: "mhs-1",
  overallScore: 74.5,
  overallCategory: "Perlu Dipertimbangkan",
  targetPosition: "Frontend Developer",
  dimensions: [
    {
      name: "Skill Match",
      weight: 35.0,
      score: 78.0,
      evidence: "Proyek PBL Sistem Informasi Kampus & Portofolio Web",
      description: "Kemampuan teknis terbukti pada proyek nyata berbobot 35%",
    },
    {
      name: "Experience Match",
      weight: 25.0,
      score: 72.0,
      evidence: "Magang Industri 6 Bulan di PT Arunika Teknologi",
      description: "Relevansi dan durasi pengalaman kerja lapangan berbobot 25%",
    },
    {
      name: "Responsibility & Scope",
      weight: 20.0,
      score: 75.0,
      evidence: "Lead Frontend Tim PBL Mahasiswa (4 orang)",
      description: "Peran koordinasi dan kepemimpinan dalam tim berbobot 20%",
    },
    {
      name: "Education & Certification",
      weight: 10.0,
      score: 85.0,
      evidence: "D4 Teknik Informatika PNJ, IPK 3.65 & Sertifikasi BNSP",
      description: "Kesesuaian capaian pembelajaran lulusan vokasi berbobot 10%",
    },
    {
      name: "Added Value",
      weight: 10.0,
      score: 80.0,
      evidence: "Juara 2 Kompetisi Software Mahasiswa & Pengurus Himpunan",
      description: "Portofolio proyek terbuka dan keaktifan organisasi berbobot 10%",
    },
  ],
  competencies: [
    {
      name: "React & Next.js Framework",
      category: "Frontend Core",
      level: "Mahir (Siap Kerja)",
      progress: 88.0,
      evidenceSrc: "Proyek Tim PBL & Portofolio",
    },
    {
      name: "State Management & Custom Hooks",
      category: "Frontend Core",
      level: "Kompeten",
      progress: 78.0,
      evidenceSrc: "Jawaban AI Interview",
    },
    {
      name: "Automated Testing (Jest / Playwright)",
      category: "Quality Assurance",
      level: "Perlu Pengembangan",
      progress: 48.0,
      evidenceSrc: "Feedback Rekrutmen",
    },
    {
      name: "Git Workflow & CI/CD Basics",
      category: "Engineering Standards",
      level: "Kompeten",
      progress: 82.0,
      evidenceSrc: "Repositori GitHub",
    },
    {
      name: "REST API Integration & Error Handling",
      category: "Backend Integration",
      level: "Kompeten",
      progress: 80.0,
      evidenceSrc: "Jawaban AI Interview",
    },
  ],
  progressHistory: [
    {
      date: "14 Okt 2026",
      score: 62.0,
      change: 0.0,
      eventName: "Evaluasi Awal Seleksi Kerja",
      description: "Hasil penilaian seleksi perdana: terdeteksi kesenjangan di bidang testing dan arsitektur.",
    },
    {
      date: "21 Okt 2026",
      score: 68.0,
      change: 6.0,
      eventName: "Penyelesaian Modul Learning Hub",
      description: "Menyelesaikan modul latihan TypeScript & REST API di Learning Hub PNJ.",
    },
    {
      date: "28 Okt 2026",
      score: 74.5,
      change: 6.5,
      eventName: "Simulasi AI Interview Mandiri",
      description: "Menjalani mode latihan interview mandiri untuk studi kasus penanganan bug produksi.",
    },
  ],
  actionRecommendations: [
    {
      id: "rec-1",
      title: "Latihan Kuis: Automated Unit Testing dengan Jest",
      type: "Learning Hub Quiz",
      potentialUp: 5,
      actionUrl: "/mahasiswa/interview?mode=latihan",
      priority: "Tinggi",
    },
    {
      id: "rec-2",
      title: "Simulasi Wawancara: Menjelaskan Penanganan Konflik Git & CI/CD",
      type: "AI Interview Practice",
      potentialUp: 4,
      actionUrl: "/mahasiswa/interview?mode=latihan",
      priority: "Sedang",
    },
    {
      id: "rec-3",
      title: "Kaji Ulang RPS: Rekayasa Perangkat Lunak Terapan",
      type: "Materi Perkuliahan",
      potentialUp: 3,
      actionUrl: "/mahasiswa/feedback",
      priority: "Rekomendasi Dosen",
    },
  ],
};

export const TARGET_CAREER_TRACKS = [
  "Frontend Developer",
  "Backend Developer",
  "Mobile Developer",
  "DevOps & Cloud Engineer",
] as const;

export const CAREER_READINESS_PROFILES: Record<string, ReadinessProfile> = {
  "Frontend Developer": INITIAL_READINESS_PROFILE,
  "Backend Developer": {
    studentId: "mhs-1",
    overallScore: 78.0,
    overallCategory: "Perlu Dipertimbangkan",
    targetPosition: "Backend Developer",
    dimensions: [
      {
        name: "Skill Match",
        weight: 35.0,
        score: 82.0,
        evidence: "Proyek Sistem Informasi Akademik & API Server Golang",
        description: "Kemampuan teknis terbukti pada proyek nyata berbobot 35%",
      },
      {
        name: "Experience Match",
        weight: 25.0,
        score: 75.0,
        evidence: "Magang Backend Engineer 6 Bulan di PT Arunika Teknologi",
        description: "Relevansi dan durasi pengalaman kerja lapangan berbobot 25%",
      },
      {
        name: "Responsibility & Scope",
        weight: 20.0,
        score: 76.0,
        evidence: "Backend Lead Tim PBL Mahasiswa (Integrasi Basis Data)",
        description: "Peran koordinasi dan kepemimpinan dalam tim berbobot 20%",
      },
      {
        name: "Education & Certification",
        weight: 10.0,
        score: 85.0,
        evidence: "D4 Teknik Informatika PNJ & Sertifikasi Basis Data",
        description: "Kesesuaian capaian pembelajaran lulusan vokasi berbobot 10%",
      },
      {
        name: "Added Value",
        weight: 10.0,
        score: 74.0,
        evidence: "Kontributor API Open Source Kampus & Anggota Tim Robotika",
        description: "Portofolio proyek terbuka dan keaktifan organisasi berbobot 10%",
      },
    ],
    competencies: [
      {
        name: "Optimasi Kueri PostgreSQL & Indexing B-Tree",
        category: "Database Engineering",
        level: "Mahir (Siap Kerja)",
        progress: 88.0,
        evidenceSrc: "Jawaban Drill Kasus & Proyek PBL",
      },
      {
        name: "Arsitektur Bersih & Boundary Ports-Adapters",
        category: "Software Architecture",
        level: "Kompeten",
        progress: 78.0,
        evidenceSrc: "Studi Kasus Drill & Code Review",
      },
      {
        name: "Containerization Multi-Stage Docker",
        category: "DevOps & Deployment",
        level: "Kompeten",
        progress: 82.0,
        evidenceSrc: "Dockerfile Repositori Proyek",
      },
      {
        name: "Proteksi API: HMAC Signing & Rate Limiting",
        category: "System Security",
        level: "Kompeten",
        progress: 74.0,
        evidenceSrc: "Jawaban AI Interview",
      },
      {
        name: "Unit & Integration Testing (Testify / Mockery)",
        category: "Quality Assurance",
        level: "Perlu Pengembangan",
        progress: 52.0,
        evidenceSrc: "Feedback Rekrutmen",
      },
    ],
    progressHistory: [
      {
        date: "15 Okt 2026",
        score: 65.0,
        change: 0.0,
        eventName: "Evaluasi Awal Backend Engineering",
        description: "Penilaian perdana portofolio API dan struktur skema basis data PostgreSQL.",
      },
      {
        date: "22 Okt 2026",
        score: 72.0,
        change: 7.0,
        eventName: "Tuntas Drill Optimasi PostgreSQL",
        description: "Menuntaskan studi kasus EXPLAIN ANALYZE dan indeks komposit di Learning Hub.",
      },
      {
        date: "29 Okt 2026",
        score: 78.0,
        change: 6.0,
        eventName: "Simulasi Drill Clean Architecture",
        description: "Latihan refactoring logika domain HTTP ke ports & adapters mandiri.",
      },
    ],
    actionRecommendations: [
      {
        id: "rec-b1",
        title: "Drill Kasus: Optimasi Index PostgreSQL (+8 Poin)",
        type: "Interactive Drill",
        potentialUp: 8,
        actionUrl: "/mahasiswa/learning-hub?topik=database",
        priority: "Tinggi",
      },
      {
        id: "rec-b2",
        title: "Latihan Wawancara: Penjelasan Hexagonal Architecture",
        type: "AI Interview Practice",
        potentialUp: 5,
        actionUrl: "/mahasiswa/interview?mode=latihan",
        priority: "Sedang",
      },
      {
        id: "rec-b3",
        title: "Kaji Ulang RPS: Sistem Terdistribusi & Keamanan Jaringan",
        type: "Materi Perkuliahan",
        potentialUp: 3,
        actionUrl: "/mahasiswa/feedback",
        priority: "Rekomendasi Dosen",
      },
    ],
  },
  "Mobile Developer": {
    studentId: "mhs-1",
    overallScore: 72.0,
    overallCategory: "Perlu Dipertimbangkan",
    targetPosition: "Mobile Developer",
    dimensions: [
      {
        name: "Skill Match",
        weight: 35.0,
        score: 75.0,
        evidence: "Aplikasi Mobile PBL Kampus & Portofolio Flutter",
        description: "Kemampuan teknis terbukti pada proyek nyata berbobot 35%",
      },
      {
        name: "Experience Match",
        weight: 25.0,
        score: 70.0,
        evidence: "Magang Mobile Developer 4 Bulan di Startup Edutech",
        description: "Relevansi dan durasi pengalaman kerja lapangan berbobot 25%",
      },
      {
        name: "Responsibility & Scope",
        weight: 20.0,
        score: 72.0,
        evidence: "Developer Fitur Mobile Tim PBL",
        description: "Peran koordinasi dan kepemimpinan dalam tim berbobot 20%",
      },
      {
        name: "Education & Certification",
        weight: 10.0,
        score: 85.0,
        evidence: "D4 Teknik Informatika PNJ",
        description: "Kesesuaian capaian pembelajaran lulusan vokasi berbobot 10%",
      },
      {
        name: "Added Value",
        weight: 10.0,
        score: 70.0,
        evidence: "Publikasi Aplikasi di Internal Kampus",
        description: "Portofolio proyek terbuka dan keaktifan organisasi berbobot 10%",
      },
    ],
    competencies: [
      {
        name: "Flutter Framework & Dart SDK",
        category: "Mobile Core",
        level: "Mahir (Siap Kerja)",
        progress: 85.0,
        evidenceSrc: "Proyek Tim PBL & Repositori",
      },
      {
        name: "State Management (Bloc / Riverpod)",
        category: "Mobile Architecture",
        level: "Kompeten",
        progress: 75.0,
        evidenceSrc: "Jawaban AI Interview",
      },
      {
        name: "Offline-First Storage (Isar / SQLite)",
        category: "Local Persistence",
        level: "Perlu Pengembangan",
        progress: 55.0,
        evidenceSrc: "Feedback Rekrutmen",
      },
      {
        name: "REST API Client & Interceptor",
        category: "Networking",
        level: "Kompeten",
        progress: 80.0,
        evidenceSrc: "Kode Repositori",
      },
    ],
    progressHistory: [
      {
        date: "14 Okt 2026",
        score: 64.0,
        change: 0.0,
        eventName: "Evaluasi Awal Mobile Development",
        description: "Penilaian awal aplikasi Flutter tugas akhir dan struktur kode modul UI.",
      },
      {
        date: "28 Okt 2026",
        score: 72.0,
        change: 8.0,
        eventName: "Sertifikasi Latihan State Management",
        description: "Menyelesaikan modul Bloc pattern dan testing widget mandiri.",
      },
    ],
    actionRecommendations: [
      {
        id: "rec-m1",
        title: "Latihan: Implementasi Offline Sync SQLite",
        type: "Learning Hub Quiz",
        potentialUp: 6,
        actionUrl: "/mahasiswa/learning-hub?topik=mobile",
        priority: "Tinggi",
      },
      {
        id: "rec-m2",
        title: "Simulasi Wawancara: State Lifecycle & Native Bridge",
        type: "AI Interview Practice",
        potentialUp: 4,
        actionUrl: "/mahasiswa/interview?mode=latihan",
        priority: "Sedang",
      },
    ],
  },
  "DevOps & Cloud Engineer": {
    studentId: "mhs-1",
    overallScore: 70.5,
    overallCategory: "Perlu Dipertimbangkan",
    targetPosition: "DevOps & Cloud Engineer",
    dimensions: [
      {
        name: "Skill Match",
        weight: 35.0,
        score: 72.0,
        evidence: "Setup Server CI/CD Kampus & Docker Swarm Lab",
        description: "Kemampuan teknis terbukti pada proyek nyata berbobot 35%",
      },
      {
        name: "Experience Match",
        weight: 25.0,
        score: 68.0,
        evidence: "Asisten Lab Jaringan & Server PNJ",
        description: "Relevansi dan durasi pengalaman kerja lapangan berbobot 25%",
      },
      {
        name: "Responsibility & Scope",
        weight: 20.0,
        score: 72.0,
        evidence: "Pengelola Pipeline GitHub Actions PBL",
        description: "Peran koordinasi dan kepemimpinan dalam tim berbobot 20%",
      },
      {
        name: "Education & Certification",
        weight: 10.0,
        score: 85.0,
        evidence: "D4 Teknik Informatika PNJ & Sertifikasi CCNA/Cloud",
        description: "Kesesuaian capaian pembelajaran lulusan vokasi berbobot 10%",
      },
      {
        name: "Added Value",
        weight: 10.0,
        score: 70.0,
        evidence: "Otomasi Script Bash Lab Kampus",
        description: "Portofolio proyek terbuka berbobot 10%",
      },
    ],
    competencies: [
      {
        name: "Linux Shell Scripting & System Administration",
        category: "Operating System",
        level: "Mahir (Siap Kerja)",
        progress: 84.0,
        evidenceSrc: "Proyek Lab & Repositori",
      },
      {
        name: "Docker Multi-stage Builds & Security",
        category: "Containerization",
        level: "Kompeten",
        progress: 80.0,
        evidenceSrc: "Dockerfile Analisis",
      },
      {
        name: "CI/CD Pipeline GitHub Actions",
        category: "Automation",
        level: "Kompeten",
        progress: 74.0,
        evidenceSrc: "Workflow YAML",
      },
      {
        name: "Monitoring & Observability (Prometheus/Grafana)",
        category: "Observability",
        level: "Perlu Pengembangan",
        progress: 46.0,
        evidenceSrc: "Feedback Rekrutmen",
      },
    ],
    progressHistory: [
      {
        date: "16 Okt 2026",
        score: 63.0,
        change: 0.0,
        eventName: "Evaluasi Awal Infrastruktur Cloud",
        description: "Analisis pemahaman sistem Linux dan arsitektur container.",
      },
      {
        date: "27 Okt 2026",
        score: 70.5,
        change: 7.5,
        eventName: "Penyelesaian Modul Docker Security",
        description: "Tuntas latihan modul keamanan image dan non-root container.",
      },
    ],
    actionRecommendations: [
      {
        id: "rec-d1",
        title: "Drill Kasus: Konfigurasi Logging & Prometheus Alert",
        type: "Interactive Drill",
        potentialUp: 8,
        actionUrl: "/mahasiswa/learning-hub?topik=devops",
        priority: "Tinggi",
      },
    ],
  },
};

export async function fetchStudentReadiness(position?: string): Promise<ReadinessProfile> {
  try {
    const url = position
      ? `/api/me/readiness?posisi=${encodeURIComponent(position)}`
      : "/api/me/readiness";
    const res = await fetch(url, { method: "GET" });
    if (!res.ok) {
      if (position && CAREER_READINESS_PROFILES[position]) {
        return CAREER_READINESS_PROFILES[position];
      }
      return INITIAL_READINESS_PROFILE;
    }
    const data = await res.json();
    return toAppKeys(data) as ReadinessProfile;
  } catch {
    if (position && CAREER_READINESS_PROFILES[position]) {
      return CAREER_READINESS_PROFILES[position];
    }
    return INITIAL_READINESS_PROFILE;
  }
}
