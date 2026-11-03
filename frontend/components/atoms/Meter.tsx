import ui from "@/styles/ui.module.css";

interface MeterProps {
  value: number;
  label: string;
  tone?: string;
}

/** Bar horizontal 0-100 dengan isi yang memanjang dari kiri (transition CSS). */
export function Meter({ value, label, tone = "var(--accent)" }: MeterProps) {
  return (
    <div className={ui.progressBar} role="meter" aria-valuemin={0} aria-valuemax={100} aria-valuenow={value} aria-label={label}>
      <span className={ui.progressFill} style={{ transform: `scaleX(${value / 100})`, background: tone }} />
    </div>
  );
}
