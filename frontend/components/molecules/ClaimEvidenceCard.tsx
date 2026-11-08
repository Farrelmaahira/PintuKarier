"use client";

import { ChangeEvent, useRef } from "react";
import { Certificate, FileText, UploadSimple } from "@phosphor-icons/react";
import { ClaimEvidenceItem } from "@/lib/data/claim";
import { ClaimBadge } from "../atoms/ClaimBadge";
import { Button } from "../atoms/Button";
import { Callout } from "./Callout";
import app from "@/styles/app.module.css";
import rows from "@/styles/rows.module.css";
import ui from "@/styles/ui.module.css";

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
    <li className={`${rows.row} ${rows.cornered}`}>
      <div className={rows.main}>
        <div className={ui.itemHead}>
          <span className={ui.iconTile}>
            <Certificate size={20} aria-hidden />
          </span>
          <div className={ui.itemHeadText}>
            <strong>{claim.title}</strong>
            {(claim.issuer || claim.year) && (
              <span className={app.meta}>
                {claim.issuer} {claim.year ? `· ${claim.year}` : ""}
              </span>
            )}
          </div>
        </div>

        {claim.context && <Callout tone="plain" title="Konteks CV">{claim.context}</Callout>}

        {claim.verificationNotes && (
          <span className={ui.itemNote}>
            <FileText size={16} aria-hidden />
            {claim.verificationNotes}
            {claim.matchConfidence > 0 && <strong>({Math.round(claim.matchConfidence * 100)}% match)</strong>}
          </span>
        )}
      </div>

      <div className={rows.corner}>
        <ClaimBadge status={claim.status} />
      </div>

      <div className={rows.actions}>
        <input ref={fileInputRef} type="file" accept=".pdf,.png,.jpg,.jpeg,.webp" hidden onChange={handleFileChange} />
        <Button size="sm" variant={claim.status === "verified" ? "plain" : "primary"} loading={uploading} disabled={uploading} onClick={handleTriggerUpload} icon={<UploadSimple size={16} />}>
          {claim.fileKey ? "Unggah Ulang" : "Unggah Bukti"}
        </Button>
      </div>
    </li>
  );
}
