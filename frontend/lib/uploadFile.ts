import { requestUpload } from "./actions/requestUpload";
import { completeUpload } from "./actions/completeUpload";

/**
 * Alur upload diagram direkrut-AI: minta link bertanda tangan, PUT langsung dari browser ke storage,
 * lalu konfirmasi ke API. Mengembalikan id job background yang dimulai backend.
 */
export async function uploadFile(applicationId: string | null, questionNumber: number | null, file: Blob, name: string, duration = 0): Promise<string> {
  const link = await requestUpload(applicationId, questionNumber, name, file.size);
  if (!link.ok) throw new Error(link.error);
  const res = await fetch(link.data.uploadUrl, { method: "PUT", body: file, headers: { "Content-Type": file.type || "application/octet-stream" } });
  if (!res.ok) {
    const d = await res.json().catch(() => null);
    throw new Error(d?.error ?? "Upload gagal, coba lagi.");
  }
  const done = await completeUpload(applicationId, questionNumber, link.data.key, duration);
  if (!done.ok) throw new Error(done.error);
  return done.data.id;
}
