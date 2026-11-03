import type { VacancySummary, Vacancy } from "./data/student";

const TONE = [
  "var(--cat-lilac)",
  "var(--accent)",
  "var(--cat-green)",
  "var(--cat-yellow)",
  "var(--cat-cyan)",
  "var(--cat-orange)",
];

/** Ubah lowongan API ke bentuk kartu yang dipakai VacancyCard dan VacancyRow. */
export function toVacancySummary(l: Vacancy, i: number): VacancySummary {
  const deadline = l.closed
    ? "Ditutup"
    : l.deadline
      ? new Date(`${l.deadline}T00:00:00`).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "Tanpa batas";
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
  };
}
