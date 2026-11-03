import { FilePdf } from "@phosphor-icons/react";
import { Meter } from "../atoms/Meter";
import { StepList } from "./StepList";
import app from "@/styles/app.module.css";

interface CvParseProgressProps {
  fileName: string | null;
  step: number;
  steps: string[];
}

export function CvParseProgress({
  fileName,
  step,
  steps,
}: CvParseProgressProps) {
  return (
    <div className={app.parse} aria-live="polite">
      <div className={app.fileChip}>
        <FilePdf size={22} aria-hidden /> {fileName}
      </div>
      <Meter value={(step / steps.length) * 100} label="Progres ekstraksi CV" />
      <StepList steps={steps} current={step} />
    </div>
  );
}
