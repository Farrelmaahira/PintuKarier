export interface ClaimEvidenceItem {
  id: string;
  applicationId: string;
  studentId: string;
  claimType: string;
  title: string;
  issuer?: string;
  year?: string;
  context?: string;
  fileKey?: string;
  fileName?: string;
  status: "pending_upload" | "verifying" | "verified" | "needs_manual_review" | "rejected";
  matchConfidence: number;
  verificationNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClaimListResponse {
  claims: ClaimEvidenceItem[];
  total: number;
}

export interface ClaimUploadResponse {
  uploadUrl: string;
  key: string;
}

export interface ClaimVerifyResponse extends ClaimEvidenceItem {}

