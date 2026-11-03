import { CandidateBoard } from "./CandidateBoard";
import { api } from "@/lib/api";
import type { Candidate } from "@/lib/data/candidate";
import type { Vacancy } from "@/lib/data/student";

interface CandidateBoardSectionProps {
  searchParams: Promise<{ lowongan?: string | string[] }>;
}

export async function CandidateBoardSection({ searchParams }: CandidateBoardSectionProps) {
  // `lowongan` adalah nama parameter di URL (/hrd?lowongan=...), jadi tidak ikut diganti.
  const { lowongan: selectedId } = await searchParams;
  const vacancies = await api<Vacancy[]>("/lowongan");
  const activeVacancy = vacancies.find((vacancy) => vacancy.id === selectedId) ?? vacancies[0] ?? null;
  const candidates = activeVacancy
    ? await api<Candidate[]>(`/lowongan/${encodeURIComponent(activeVacancy.id)}/kandidat`)
    : [];
  return <CandidateBoard vacancies={vacancies} activeVacancy={activeVacancy} candidates={candidates} />;
}
