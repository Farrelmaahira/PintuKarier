"use client";

import { useClaimEvidence } from "@/lib/hooks/useClaimEvidence";
import { Panel } from "../molecules/Panel";
import { Notice } from "../molecules/Notice";
import { EmptyState } from "../molecules/EmptyState";
import { ClaimEvidenceCard } from "../molecules/ClaimEvidenceCard";
import app from "@/styles/app.module.css";
import dashboard from "@/styles/dashboard.module.css";
import rows from "@/styles/rows.module.css";
import ui from "@/styles/ui.module.css";

export interface ClaimEvidenceSectionProps {
  studentName?: string;
}

export function ClaimEvidenceSection({
  studentName,
}: ClaimEvidenceSectionProps) {
  const { claims, loading, uploadingId, error, uploadAndVerify } =
    useClaimEvidence();

  const verifiedCount = claims.filter((c) => c.status === "verified").length;

  return (
    <Panel
      title="Validasi Bukti Sertifikasi & Portofolio"
      tag={
        claims.length > 0
          ? `${verifiedCount}/${claims.length} Terverifikasi`
          : undefined
      }
      flush
    >
      {error && (
        <div className={ui.panelToolbar}>
          <Notice tone="error">{error}</Notice>
        </div>
      )}

      {loading && claims.length === 0 ? (
        <p className={`${app.meta} ${dashboard.prodiNote}`}>
          Memuat daftar klaim sertifikasi dari CV...
        </p>
      ) : claims.length === 0 ? (
        <EmptyState
          title="Belum ada sertifikasi yang terdeteksi"
          img="undraw/empty"
        >
          Unggah CV kamu di menu sebelah kanan untuk mengekstrak sertifikasi dan
          portofolio secara otomatis.
        </EmptyState>
      ) : (
        <ul className={rows.list}>
          {claims.map((claim) => (
            <ClaimEvidenceCard
              key={claim.id}
              claim={claim}
              uploading={uploadingId === claim.id}
              onUpload={uploadAndVerify}
            />
          ))}
        </ul>
      )}
    </Panel>
  );
}
