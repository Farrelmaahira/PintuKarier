"use server";

import { api } from "../api";
import { attempt } from "../attempt";
import { ClaimEvidenceItem, ClaimListResponse, ClaimUploadResponse, ClaimVerifyResponse } from "../data/claim";

export async function getClaimsAction() {
  return attempt(() => api<ClaimListResponse>("/me/claims"));
}

export async function requestClaimUploadAction(
  claimId: string,
  fileName: string,
  fileSize: number,
) {
  return attempt(() =>
    api<ClaimUploadResponse>(`/me/claims/${encodeURIComponent(claimId)}/upload`, {
      method: "POST",
      body: { fileName, fileSize },
    }),
  );
}

export async function verifyClaimAction(claimId: string, fileKey: string) {
  return attempt(() =>
    api<ClaimVerifyResponse>(`/me/claims/${encodeURIComponent(claimId)}/verify`, {
      method: "POST",
      body: { fileKey },
    }),
  );
}

