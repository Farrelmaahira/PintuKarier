import { getJobStatus, type BackgroundJob } from "./actions/getJobStatus";

/** Tunggu job background selesai dengan polling; onStatus dipanggil tiap kali status dibaca. */
export async function waitForJob(id: string, onStatus?: (s: BackgroundJob["status"]) => void, timeoutMs = 180_000): Promise<BackgroundJob> {
  const until = Date.now() + timeoutMs;
  for (;;) {
    const r = await getJobStatus(id);
    if (!r.ok) throw new Error(r.error);
    onStatus?.(r.data.status);
    if (r.data.status === "succeeded" || r.data.status === "failed") return r.data;
    if (Date.now() > until) throw new Error("Prosesnya lebih lama dari biasanya. Cek lagi sebentar ya.");
    await new Promise((res) => setTimeout(res, 1500));
  }
}
