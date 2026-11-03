import { Segmented } from "./Segmented";
import app from "@/styles/app.module.css";

interface LabeledSegmentedProps {
  title: string;
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}

/** Pilihan satu-dari-banyak dengan judul di atasnya. */
export function LabeledSegmented({ title, ...segmented }: LabeledSegmentedProps) {
  return (
    <div className={app.stack}>
      <span className={app.label}>{title}</span>
      <Segmented {...segmented} />
    </div>
  );
}
