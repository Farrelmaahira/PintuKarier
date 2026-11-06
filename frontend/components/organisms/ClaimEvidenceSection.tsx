"use client";

import { useClaimEvidence } from "@/lib/hooks/useClaimEvidence";
import { Panel } from "../molecules/Panel";
import { Notice } from "../molecules/Notice";
import { EmptyState } from "../molecules/EmptyState";
import { ClaimEvidenceCard } from "../molecules/ClaimEvidenceCard";
import rows from "@/styles/rows.module.css";

export interface ClaimEvidenceSectionProps {
  studentName?: string;
}

export function ClaimEvidenceSection({ studentName }: ClaimEvidenceSectionProps) {
  const { claims, loading, uploadingId, error, uploadAndVerify } = useClaimEvidence();

  const verifiedCount = claims.filter((c) => c.status === "verified").length;

  return (
    <Panel
      title="Validasi Bukti Sertifikasi & Portofolio"
      tag={claims.length > 0 ? `${verifiedCount}/${claims.length} Terverifikasi` : undefined}
      flush
    >
      {error && (
        <div style={{ padding: "12px 20px" }}>
          <Notice tone="error">{error}</Notice>
        </div>
      )}

      {loading && claims.length === 0 ? (
        <div style={{ padding: "24px 20px", fontSize: "14px", color: "var(--muted)" }}>
          Memuat daftar klaim sertifikasi dari CV...
        </div>
      ) : claims.length === 0 ? (
        <div style={{ padding: "20px" }}>
          <EmptyState
            title="Belum ada sertifikasi yang terdeteksi"
            img="undraw/empty"
          >
            Unggah CV kamu di menu sebelah kanan untuk mengekstrak sertifikasi dan portofolio secara otomatis.
          </EmptyState>
        </div>
      ) : (
        <div className={rows.list}>
          {claims.map((claim) => (
            <ClaimEvidenceCard
              key={claim.id}
              claim={claim}
              uploading={uploadingId === claim.id}
              onUpload={uploadAndVerify}
            />
          ))}
        </div>
      )}
    </Panel>
  );
}

