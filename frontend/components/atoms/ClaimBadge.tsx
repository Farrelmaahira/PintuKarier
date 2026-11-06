import { Badge } from "./Badge";

export interface ClaimBadgeProps {
  status: "pending_upload" | "verifying" | "verified" | "needs_manual_review" | "rejected";
}

export function ClaimBadge({ status }: ClaimBadgeProps) {
  switch (status) {
    case "verified":
      return <Badge tone="green">Terverifikasi</Badge>;
    case "needs_manual_review":
      return <Badge tone="yellow">Review Manual</Badge>;
    case "verifying":
      return <Badge tone="cyan">Memverifikasi...</Badge>;
    case "rejected":
      return <Badge tone="orange">Tidak Cocok</Badge>;
    case "pending_upload":
    default:
      return <Badge tone="none">Belum Ada Berkas</Badge>;
  }
}
