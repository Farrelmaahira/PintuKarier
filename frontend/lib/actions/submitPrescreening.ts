"use server";

import { api } from "../api";
import { attempt } from "../attempt";

/** Kirim tiga jawaban pre-screening; backend memasangkannya dengan pertanyaan lowongan. */
export async function submitPrescreening(applicationId: string, answers: string[]) {
  return attempt(() => api(`/lamaran/${encodeURIComponent(applicationId)}/prescreening`, { method: "POST", body: { answers } }));
}
