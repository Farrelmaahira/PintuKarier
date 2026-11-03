"use server";

import { api } from "../api";
import { attempt } from "../attempt";
import type { CvProfile } from "../data/student";

/** Profil hasil ekstraksi CV setelah job parse_cv selesai. */
export async function getApplicationProfile(applicationId: string) {
  return attempt(() => api<CvProfile>(`/lamaran/${encodeURIComponent(applicationId)}/profil`));
}
