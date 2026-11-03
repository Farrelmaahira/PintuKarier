"use server";

import { api } from "../api";
import { attempt } from "../attempt";
import type { BackgroundJob } from "./getJobStatus";

/** Mulai analisis AI untuk lamaran yang sudah selesai interview. Id kosong berarti tidak ada yang perlu dinilai. */
export async function startAnalysis(vacancyId: string) {
  return attempt(() => api<BackgroundJob>(`/lowongan/${encodeURIComponent(vacancyId)}/analisis`, { method: "POST" }));
}
