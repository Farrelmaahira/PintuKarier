"use server";

import { api } from "../api";
import { attempt } from "../attempt";
import type { CvProfile } from "../data/student";

/** Simpan koreksi mahasiswa atas profil hasil ekstraksi CV. */
export async function saveApplicationProfile(
  applicationId: string,
  profile: CvProfile,
) {
  return attempt(() =>
    api<CvProfile>(`/lamaran/${encodeURIComponent(applicationId)}/profil`, {
      method: "PUT",
      body: profile,
    }),
  );
}
