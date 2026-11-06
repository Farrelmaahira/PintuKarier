"use client";

import { ChangeEvent, useRef } from "react";
import { Certificate, FileText, UploadSimple } from "@phosphor-icons/react";
import { ClaimEvidenceItem } from "@/lib/data/claim";
import { ClaimBadge } from "../atoms/ClaimBadge";
import { Button } from "../atoms/Button";
import app from "@/styles/app.module.css";
import rows from "@/styles/rows.module.css";

export interface ClaimEvidenceCardProps {
  claim: ClaimEvidenceItem;
  uploading: boolean;
  onUpload: (claimId: string, file: File) => void;
}

export function ClaimEvidenceCard({ claim, uploading, onUpload }: ClaimEvidenceCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(claim.id, file);
    }
  };

  const handleTriggerUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={rows.row} style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: "10px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px", width: "100%" }}>
        <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
          <div
            style={{
              width: "36px",
              height: "36px",
              display: "grid",
              placeItems: "center",
              background: "var(--surface-warm)",
              border: "1px solid var(--ink)",
              flexShrink: 0,
            }}
          >
            <Certificate size={20} />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
              <strong style={{ fontSize: "15px" }}>{claim.title}</strong>
              <ClaimBadge status={claim.status} />
            </div>
            {(claim.issuer || claim.year) && (
              <span className={app.meta} style={{ marginTop: "2px", display: "block" }}>
                {claim.issuer} {claim.year ? `· ${claim.year}` : ""}
              </span>
            )}
          </div>
        </div>

        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.png,.jpg,.jpeg,.webp"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          <Button
            size="sm"
            variant={claim.status === "verified" ? "plain" : "primary"}
            loading={uploading}
            disabled={uploading}
            onClick={handleTriggerUpload}
            icon={<UploadSimple size={16} />}
          >
            {claim.fileKey ? "Unggah Ulang" : "Unggah Bukti"}
          </Button>
        </div>
      </div>

      {claim.context && (
        <div
          style={{
            fontSize: "13px",
            color: "var(--muted)",
            background: "var(--surface-warm)",
            padding: "8px 12px",
            borderLeft: "3px solid var(--ink)",
          }}
        >
          <span style={{ fontWeight: 600 }}>Konteks CV: </span>
          {claim.context}
        </div>
      )}

      {claim.verificationNotes && (
        <div style={{ fontSize: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
          <FileText size={16} />
          <span>{claim.verificationNotes}</span>
          {claim.matchConfidence > 0 && (
            <span style={{ fontWeight: 600 }}>({Math.round(claim.matchConfidence * 100)}% match)</span>
          )}
        </div>
      )}
    </div>
  );
}

