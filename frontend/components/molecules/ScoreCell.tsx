import type { ReactNode } from "react";
import ui from "@/styles/ui.module.css";

interface ScoreCellProps {
  value: ReactNode;
  label: string;
}

/** Kolom skor di ujung kanan baris daftar: angka mono dengan keterangan kecil di bawahnya. */
export function ScoreCell({ value, label }: ScoreCellProps) {
  return (
    <div className={ui.scoreCell}>
      <span className={ui.scoreCellValue}>{value}</span>
      <span className={ui.scoreCellLabel}>{label}</span>
    </div>
  );
}
