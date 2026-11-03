import type { BackgroundJob } from "./actions/getJobStatus";

/** Langkah progres ekstraksi CV menurut status job background (0 = mengunggah sudah dilewati). */
export const parseStepOf = (status: BackgroundJob["status"]) => (status === "queued" ? 1 : status === "running" ? 2 : 3);

/**
 * Error untuk job ekstraksi CV yang gagal. Pesan 4xx dari AI Engine sudah ramah (mis. PDF hasil scan);
 * error lain cukup pesan umum.
 */
export function cvParseFailure(job: BackgroundJob, advice: string): Error {
  const detail = /membalas 4\d\d: (.*)$/.exec(job.error ?? "")?.[1];
  return new Error(`CV kamu belum kebaca otomatis.${detail ? ` ${detail}.` : ""} ${advice}`);
}
