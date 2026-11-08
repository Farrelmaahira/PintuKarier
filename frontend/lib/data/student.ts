export interface VacancySummary {
  id: string;
  position: string;
  company: string;
  location: string;
  type: "Magang" | "Full-time" | "Kontrak";
  deadline: string;
  /** Tanggal ISO batas lamar; kosong untuk lowongan tanpa batas. */
  deadlineDate?: string;
  applicants: number;
  tone: string;
  tags: string[];
}

/** Urutan tahap lamaran (user flow mahasiswa, concept paper bagian 7). */
export const APPLICATION_STAGES = ["Unggah CV", "Pre-screening", "AI Interview", "Dianalisis AI", "Ditinjau HRD", "Keputusan"];

/** Bentuk GET /lowongan dan GET /lowongan/{id} dari Golang API. */
export interface Vacancy extends Omit<VacancySummary, "tone" | "deadline" | "deadlineDate"> {
  jobField: string;
  /** Tanggal ISO (YYYY-MM-DD) atau kosong. */
  deadline: string;
  closed: boolean;
  description: string;
  mustHave: string[];
  niceToHave: string[];
  prescreenQuestions: string[];
  interviewQuestions: string[];
}

export interface Application {
  id: string;
  /** Kode tahap backend, dipakai untuk melanjutkan alur lamaran. */
  stageCode: string;
  vacancy: string;
  /** Indeks TAHAP yang sedang berjalan. */
  stage: number;
  status: "Lengkapi lamaran" | "AI Interview" | "Dianalisis AI" | "Ditinjau HRD" | "Lolos" | "Belum lolos";
  lastUpdate: string;
  note: string;
}

export interface ProfileEntry {
  role: string;
  place: string;
  period: string;
  points: string;
}

/** Profil hasil ekstraksi CV (GET /lamaran/{id}/profil). */
export interface CvProfile {
  summary: string;
  skills: string[];
  experience: ProfileEntry[];
  projects: ProfileEntry[];
  organizations: ProfileEntry[];
  certifications: string[];
}

/** Profil akun mahasiswa (GET /me/profil). */
export interface StudentAccount {
  name: string;
  studentNumber: string;
  studyProgram: string;
  campus: string;
  semester: number;
  gpa: number;
  summary: string;
  skills: string[];
}

export interface FeedbackData {
  id: string;
  vacancy: string;
  company: string;
  position: string;
  sender: string;
  date: string;
  category: "Memenuhi Kriteria" | "Perlu Dipertimbangkan" | "Perlu Pengembangan" | "Tidak Memenuhi Syarat";
  dimensions: readonly [number, number, number, number, number];
  summary: string;
  strengths: string[];
  area: {
    competency: string;
    why: string;
    advice: string;
    course: string;
  }[];
  closing: string;
}

