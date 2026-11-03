export const MAX_CV_MB = 5;
export const ALLOWED_CV_TYPES = ["application/pdf", "image/jpeg", "image/png"];

/** Pesan error kalau file CV tidak boleh diunggah, atau null kalau lolos. */
export function validateCvFile(file: File): string | null {
  if (!ALLOWED_CV_TYPES.includes(file.type)) return "Formatnya PDF atau gambar (JPG/PNG) ya.";
  if (file.size > MAX_CV_MB * 1024 * 1024) return `Maksimal ${MAX_CV_MB} MB. Coba kompres dulu.`;
  return null;
}
