import type { VacancySummary, Vacancy } from "./data/student";

const TONE = [
  "var(--cat-lilac)",
  "var(--accent)",
  "var(--cat-green)",
  "var(--cat-yellow)",
  "var(--cat-cyan)",
  "var(--cat-orange)",
];

/** Tanggal ISO batas lamar ke teks pendek; kosong berarti tanpa batas. */
export const formatDeadline = (iso: string) =>
  iso ? new Date(`${iso}T00:00:00`).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "Tanpa batas";

/** Ubah lowongan API ke bentuk kartu yang dipakai VacancyCard dan VacancyRow. */
export function toVacancySummary(l: Vacancy, i: number): VacancySummary {
  const deadline = l.closed ? "Ditutup" : formatDeadline(l.deadline);
  return {
    id: l.id,
    position: l.position,
    company: l.company,
    location: l.location,
    type: l.type,
    applicants: l.applicants,
    tags: l.tags,
    tone: TONE[i % TONE.length]!,
    deadline,
    deadlineDate: l.deadline || undefined,
  };
}
