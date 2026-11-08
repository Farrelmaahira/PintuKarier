import { notFound } from "next/navigation";
import { api } from "@/lib/api";
import type { Vacancy } from "@/lib/data/student";
import { VacancyEditor } from "./VacancyEditor";

/** Ambil lowongan yang diubah; 404 dan 403 (milik HRD lain) tampil sebagai tidak ditemukan. */
export async function VacancyEditSection({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const vacancy = await api<Vacancy>(`/lowongan/${encodeURIComponent(id)}`).catch((e: Error) => {
    if (e.cause === 404 || e.cause === 403) notFound();
    throw e;
  });
  return <VacancyEditor vacancy={vacancy} />;
}
