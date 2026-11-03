"use server";

import { api } from "../api";
import { attempt } from "../attempt";
import type { BackgroundJob } from "./getJobStatus";

/** Konfirmasi file sudah terunggah; backend memulai parse CV atau transkripsi di background. */
export async function completeUpload(
  applicationId: string | null,
  questionNumber: number | null,
  key: string,
  duration = 0,
) {
  const path =
    applicationId === null
      ? "/me/cv"
      : `/lamaran/${encodeURIComponent(applicationId)}/${questionNumber === null ? "cv" : `interview/${questionNumber}`}`;
  return attempt(() =>
    api<BackgroundJob>(`${path}/selesai`, { method: "POST", body: { key, duration } }),
  );
}
