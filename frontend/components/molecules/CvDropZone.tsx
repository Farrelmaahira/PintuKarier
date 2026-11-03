import { UploadSimple } from "@phosphor-icons/react";
import { ALLOWED_CV_TYPES, MAX_CV_MB, validateCvFile } from "@/lib/validateCvFile";
import app from "@/styles/app.module.css";

interface CvDropZoneProps {
  hint?: string;
  onFile: (file: File) => void;
  onError: (message: string) => void;
}

/** Zona tarik-dan-lepas atau klik untuk memilih CV; file yang tidak lolos validasi dilaporkan lewat onError. */
export function CvDropZone({ hint, onFile, onError }: CvDropZoneProps) {
  const pick = (file: File | undefined) => {
    if (!file) return;
    const error = validateCvFile(file);
    if (error) return onError(error);
    onFile(file);
  };

  return (
    <label
      className={app.drop}
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault();
        pick(event.dataTransfer.files[0]);
      }}
    >
      <UploadSimple size={36} aria-hidden />
      <strong>Tarik CV kamu ke sini, atau klik buat pilih</strong>
      <span>
        PDF atau gambar, maks {MAX_CV_MB} MB.{hint && ` ${hint}`}
      </span>
      <input type="file" accept={ALLOWED_CV_TYPES.join(",")} className="visually-hidden" onChange={(event) => pick(event.target.files?.[0])} />
    </label>
  );
}
