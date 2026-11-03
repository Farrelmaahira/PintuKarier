/** Badge tone per meaning, used app-wide (one color per meaning, DESIGN.md section 8). */
export type Tone = "lilac" | "accent" | "yellow" | "cyan" | "green" | "orange" | "settled" | "none";

export const CATEGORY_TONE: Record<string, Tone> = {
  "Memenuhi Kriteria": "green",
  "Perlu Dipertimbangkan": "yellow",
  "Perlu Pengembangan": "accent",
  "Tidak Memenuhi Syarat": "orange",
};

export const EVIDENCE_TONE: Record<string, Tone> = {
  Terpenuhi: "green",
  Sebagian: "yellow",
  "Tidak ditemukan": "orange",
};

export const STATUS_TONE: Record<string, Tone> = {
  "Lengkapi lamaran": "none",
  "AI Interview": "lilac",
  "Dianalisis AI": "cyan",
  "Ditinjau HRD": "accent",
  Lolos: "green",
  "Belum lolos": "orange",
};

export const DECISION_TONE: Record<string, Tone> = {
  "Belum diputuskan": "none",
  Lolos: "green",
  "Belum lolos": "orange",
};
