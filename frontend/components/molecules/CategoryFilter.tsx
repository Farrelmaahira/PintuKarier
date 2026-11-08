import type { ReactNode } from "react";
import app from "@/styles/app.module.css";

interface CategoryFilterProps {
  options: { label: string; count: number; tone: string }[];
  value: string;
  onChange: (value: string) => void;
  /** Aksi di kanan filter, mis. DateFilter. */
  action?: ReactNode;
}

/** Filter kategori berbentuk grid tab: label, jumlah, dan warna kategori saat aktif. */
export function CategoryFilter({
  options,
  value,
  onChange,
  action,
}: CategoryFilterProps) {
  return (
    <div className={app.catRow}>
    <div className={app.catFilter} role="group" aria-label="Filter kategori">
      {options.map((option) => (
        <button
          key={option.label}
          type="button"
          aria-pressed={option.label === value}
          style={{ "--tone": option.tone } as React.CSSProperties}
          onClick={() => onChange(option.label)}
        >
          <span>{option.label}</span>
          <span className={app.catCount}>{option.count}</span>
        </button>
      ))}
    </div>
    {action}
    </div>
  );
}
