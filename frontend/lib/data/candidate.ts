export type EvidenceStatus = "Terpenuhi" | "Sebagian" | "Tidak ditemukan";

export interface Evidence {
  requirement: string;
  mustHave: boolean;
  status: EvidenceStatus;
  quote?: string;
  source?: "CV" | "AI Interview" | "Pre-screening";
}

export type Decision = "Belum diputuskan" | "Lolos" | "Belum lolos";

export interface Candidate {
  id: string;
  name: string;
  studyProgram: string;
  cohortYear: number;
  gpa: number;
  appliedOn: string;
  /** Skor per dimensi (0-100), urutannya sama dengan DIMENSI. */
  dimensions: [number, number, number, number, number];
  category:
    | "Memenuhi Kriteria"
    | "Perlu Dipertimbangkan"
    | "Perlu Pengembangan"
    | "Tidak Memenuhi Syarat";
  reason: string;
  evidence: Evidence[];
  prescreenAnswers: string[];
  transcript: { answer: string; duration: string; audioUrl?: string; snapshotUrl?: string }[];
  /** Diisi kalau sistem menemukan instruksi tersembunyi di CV. */
  warning?: string;
  decision: Decision;
  feedback: string;
  /** Field berikut hanya ada di respons API. */
  vacancy?: string;
  position?: string;
  campus?: string;
  /** Rekomendasi asli AI; `kategori` sudah memuat koreksi HRD bila ada. */
  aiCategory?: Candidate["category"];
  correctionReason?: string;
  prescreenQuestions?: string[];
  interviewQuestions?: string[];
  feedbackSent?: boolean;
  prodiVerified?: boolean;
}
