import type { Tone } from "@/lib/tone";
import app from "@/styles/app.module.css";
import ui from "@/styles/ui.module.css";

interface ScoreBoxProps {
  value: number;
  tone: Tone;
  big?: boolean;
}

/** Skor akhir dalam kotak warna kategori. */
export function ScoreBox({ value, tone, big }: ScoreBoxProps) {
  return (
    <span className={`${app.score} ${big ? app.scoreBig : ""} ${ui[`tone-${tone}`]}`} aria-label={`Skor ${value} dari 100`}>
      {value}
    </span>
  );
}
