import { toAppKeys } from "@/lib/apiKeys";
import { ReadinessProfile } from "./types";

export const INITIAL_READINESS_PROFILE: ReadinessProfile = {
  studentId: "mhs-1",
  overallScore: 74.5,
  overallCategory: "Perlu Dipertimbangkan",
  targetPosition: "Junior Frontend Engineer (React/Next.js)",
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

export async function fetchStudentReadiness(): Promise<ReadinessProfile> {
  try {
    const res = await fetch("/api/me/readiness", { method: "GET" });
    if (!res.ok) return INITIAL_READINESS_PROFILE;
    const data = await res.json();
    return toAppKeys(data) as ReadinessProfile;
  } catch {
    return INITIAL_READINESS_PROFILE;
  }
}
