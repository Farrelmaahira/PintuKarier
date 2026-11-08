import { Meter } from "../atoms/Meter";
import { StepList } from "./StepList";
import app from "@/styles/app.module.css";

const ANALYSIS_STEPS = [
  "Masuk antrean analisis",
  "Menilai bukti tiap kandidat (CV, pre-screening, interview)",
  "Menyusun draf feedback",
];

interface AnalysisProgressProps {
  step: number;
}

/** Progres analisis AI untuk satu lowongan. */
export function AnalysisProgress({ step }: AnalysisProgressProps) {
  return (
    <div className={app.parse} aria-live="polite">
      <Meter value={((step + 1) / ANALYSIS_STEPS.length) * 100} label="Progres analisis" />
      <StepList steps={ANALYSIS_STEPS} current={step} />
    </div>
  );
}
