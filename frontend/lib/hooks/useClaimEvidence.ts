"use client";

import { useCallback, useEffect, useState } from "react";
import { ClaimEvidenceItem } from "../data/claim";
import {
  getClaimsAction,
  requestClaimUploadAction,
  verifyClaimAction,
} from "../actions/claimActions";

export interface UseClaimEvidenceState {
  claims: ClaimEvidenceItem[];
  loading: boolean;
  uploadingId: string | null;
  error: string | null;
  refreshClaims: () => Promise<void>;
  uploadAndVerify: (claimId: string, file: File) => Promise<void>;
}

export function useClaimEvidence(initialClaims: ClaimEvidenceItem[] = []): UseClaimEvidenceState {
  const [claims, setClaims] = useState<ClaimEvidenceItem[]>(initialClaims);
  const [loading, setLoading] = useState(false);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refreshClaims = useCallback(async () => {
    setLoading(true);
    setError(null);
    const res = await getClaimsAction();
    if (res.ok) {
      setClaims(res.data.claims ?? []);
    } else {
      setError(res.error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (initialClaims.length === 0) {
      refreshClaims();
    }
  }, [initialClaims.length, refreshClaims]);

  const uploadAndVerify = useCallback(async (claimId: string, file: File) => {
    setUploadingId(claimId);
    setError(null);
    try {
      const uploadReq = await requestClaimUploadAction(claimId, file.name, file.size);
      if (!uploadReq.ok) {
        throw new Error(uploadReq.error);
      }

      const uploadRes = await fetch(uploadReq.data.uploadUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type || "application/octet-stream",
        },
      });

      if (!uploadRes.ok) {
        const errorJson = await uploadRes.json().catch(() => null);
        throw new Error(errorJson?.error ?? "Gagal mengunggah berkas bukti");
      }

      const verifyRes = await verifyClaimAction(claimId, uploadReq.data.key);
      if (!verifyRes.ok) {
        throw new Error(verifyRes.error);
      }

      setClaims((prev) =>
        prev.map((item) => (item.id === claimId ? verifyRes.data : item)),
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan saat memverifikasi bukti.";
      setError(msg);
    } finally {
      setUploadingId(null);
    }
  }, []);

  return {
    claims,
    loading,
    uploadingId,
    error,
    refreshClaims,
    uploadAndVerify,
  };
}

