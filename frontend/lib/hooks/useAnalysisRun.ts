"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { startAnalysis } from "../actions/startAnalysis";
import { waitForJob } from "../waitForJob";

export type AnalysisMessage = { tone: "info" | "error" | "success"; text: string };

/** Menjalankan analisis AI satu lowongan dan menunggu job-nya; `step` -1 berarti tidak sedang berjalan. */
export function useAnalysisRun(vacancyId: string) {
  const router = useRouter();
  const [step, setStep] = useState(-1);
  const [message, setMessage] = useState<AnalysisMessage | null>(null);

  const run = async () => {
    setMessage(null);
    setStep(0);
    try {
      const started = await startAnalysis(vacancyId);
      if (!started.ok) throw new Error(started.error);
      if (!started.data.id) return setMessage({ tone: "info", text: "Belum ada kandidat baru yang selesai AI Interview." });
      const job = await waitForJob(started.data.id, (status) => setStep(status === "queued" ? 0 : 1), 30 * 60_000);
      if (job.status === "failed") throw new Error("Sebagian kandidat belum bisa dinilai. Coba jalankan lagi sebentar.");
      setStep(2);
      setMessage({ tone: "success", text: "Analisis selesai. Daftar kandidat sudah diperbarui." });
      router.refresh();
    } catch (e) {
      setMessage({ tone: "error", text: e instanceof Error ? e.message : "Analisis gagal dimulai." });
    } finally {
      setStep(-1);
    }
  };

  return { step, running: step >= 0, message, run };
}
