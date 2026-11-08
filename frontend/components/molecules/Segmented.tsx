import app from "@/styles/app.module.css";

interface SegmentedProps {
  label: string;
  options: string[];
  /** Jumlah item per opsi; ditampilkan sebagai chip di sebelah label. */
  counts?: Record<string, number>;
  value: string;
  onChange: (value: string) => void;
}

/** Grup tombol pilih satu (filter periode, posisi, kategori). */
export function Segmented({ label, options, counts, value, onChange }: SegmentedProps) {
  return (
    <div className={app.segment} role="group" aria-label={label}>
      {options.map((option) => (
        <button key={option} type="button" aria-pressed={option === value} onClick={() => onChange(option)}>
          {option}
          {counts?.[option] !== undefined && <span className={`${app.catCount} ${app.segCount}`}>{counts[option]}</span>}
        </button>
      ))}
    </div>
  );
}
