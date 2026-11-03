"use server";

import { refresh } from "next/cache";
import { api } from "../api";
import { attempt } from "../attempt";
import type { Vacancy } from "../data/student";

export type NewVacancy = { position: string; jobField: string; location: string; type: string; deadline: string; description: string; mustHave: string[]; niceToHave: string[] };

/** Buat lowongan; pertanyaan seleksinya dibuat AI di background. */
export async function createVacancy(input: NewVacancy) {
  const r = await attempt(() => api<Vacancy>("/lowongan", { method: "POST", body: input }));
  if (r.ok) refresh();
  return r;
}
