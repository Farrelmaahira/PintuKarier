import { RecDot } from "../atoms/RecDot";
import app from "@/styles/app.module.css";

interface RecordingIndicatorProps {
  live: boolean;
  seconds: number;
}

/** Indikator perekaman + sisa waktu jawaban (Halaman AI Interview). */
export function RecordingIndicator({ live, seconds }: RecordingIndicatorProps) {
  const mm = Math.floor(seconds / 60);
  const ss = String(seconds % 60).padStart(2, "0");
  return (
    <div className={app.rec} data-live={live} role="status" aria-live="polite">
      <RecDot live={live} />
      <span>{live ? "Merekam" : "Siap merekam"}</span>
      <span className="num">
        {mm}:{ss}
      </span>
    </div>
  );
}
