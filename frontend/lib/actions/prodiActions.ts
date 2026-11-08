"use server";

import { api } from "../api";
import { attempt } from "../attempt";
import type { StudentSummary } from "@/components/organisms/ProdiStudentManager";

export async function getProdiStudentsAction(prodiId = "d4-teknik-informatika") {
  return attempt(() => api<StudentSummary[]>(`/prodi/${encodeURIComponent(prodiId)}/mahasiswa`));
}

export async function verifyClaimByProdiAction(prodiId: string, claimId: string, verified: boolean, notes: string) {
  return attempt(() =>
    api<{ ok: boolean; claimId: string; verified: boolean }>(
      `/prodi/${encodeURIComponent(prodiId)}/claims/${encodeURIComponent(claimId)}/verify`,
      {
        method: "POST",
        body: { verified, notes },
      },
    ),
  );
}

