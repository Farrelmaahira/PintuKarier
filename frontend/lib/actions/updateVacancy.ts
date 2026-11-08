"use server";

import { refresh } from "next/cache";
import { api } from "../api";
import { attempt } from "../attempt";
import type { Vacancy } from "../data/student";
import type { NewVacancy } from "./createVacancy";

/** Ubah isi lowongan milik HRD; lamaran yang sudah masuk tidak tersentuh. */
export async function updateVacancy(id: string, input: NewVacancy) {
  const result = await attempt(() => api<Vacancy>(`/lowongan/${encodeURIComponent(id)}`, { method: "PATCH", body: input }));
  if (result.ok) refresh();
  return result;
}
