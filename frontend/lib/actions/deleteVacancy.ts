"use server";

import { refresh } from "next/cache";
import { api } from "../api";
import { attempt } from "../attempt";

/** Hapus lowongan; backend menolak bila sudah ada pelamar. */
export async function deleteVacancy(id: string) {
  const result = await attempt(() => api<null>(`/lowongan/${encodeURIComponent(id)}`, { method: "DELETE" }));
  if (result.ok) refresh();
  return result;
}
