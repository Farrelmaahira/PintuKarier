import { notFound } from "next/navigation";
import { connection } from "next/server";
import { ActiveCandidateBoard } from "./ActiveCandidateBoard";
import { api } from "@/lib/api";
import type { Candidate } from "@/lib/data/candidate";
import type { Vacancy } from "@/lib/data/student";

/** Pelamar satu lowongan; 404 dan 403 (milik HRD lain) tampil sebagai tidak ditemukan. */
export async function VacancyApplicants({ params }: { params: Promise<{ id: string }> }) {
  await connection();
  const { id } = await params;
  const vacancy = await api<Vacancy>(`/lowongan/${encodeURIComponent(id)}`).catch((e: Error) => {
    if (e.cause === 404 || e.cause === 403) notFound();
    throw e;
  });
  const candidates = await api<Candidate[]>(`/lowongan/${encodeURIComponent(vacancy.id)}/kandidat`);
  return <ActiveCandidateBoard vacancies={[vacancy]} activeVacancy={vacancy} candidates={candidates} />;
}
