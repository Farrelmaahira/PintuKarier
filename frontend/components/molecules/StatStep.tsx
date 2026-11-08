import landing from "@/styles/landing.module.css";

interface StatStepProps {
  value: number;
  suffix: string;
  decimals: number;
  label: string;
  tone: string;
}

/** Angka masalah di section gelap; angka dihitung naik oleh Motion (data-count). */
export function StatStep({ value, suffix, decimals, label, tone }: StatStepProps) {
  const text = value.toLocaleString("id-ID", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  return (
    <li className={landing.step} style={{ "--tone": tone } as React.CSSProperties}>
      <span className={landing.stepChip} aria-hidden />
      <div className={landing.rail}>
        <div className={landing.railInner}>
          <div className={landing.statCell}>
            <strong data-count={value} data-suffix={suffix} data-decimals={decimals}>
              {text}
              {suffix}
            </strong>
            <span>{label}</span>
          </div>
        </div>
      </div>
    </li>
  );
}
