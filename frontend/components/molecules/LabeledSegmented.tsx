import { Segmented } from "./Segmented";
import app from "@/styles/app.module.css";

interface LabeledSegmentedProps {
  title: string;
  label: string;
  options: string[];
  counts?: Record<string, number>;
  value: string;
  onChange: (value: string) => void;
}

/** Pilihan satu-dari-banyak dengan judul di atasnya. */
export function LabeledSegmented({ title, ...segmented }: LabeledSegmentedProps) {
  return (
    <div className={app.labeled}>
      <span className={app.label}>{title}</span>
      <Segmented {...segmented} />
    </div>
  );
}
