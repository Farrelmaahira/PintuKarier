"use server";

import { api } from "../api";
import { attempt } from "../attempt";

export type BackgroundJob = {
  id: string;
  kind: string;
  status: "queued" | "running" | "succeeded" | "failed";
  error?: string;
};

export async function getJobStatus(id: string) {
  return attempt(() => api<BackgroundJob>(`/jobs/${encodeURIComponent(id)}`));
}
