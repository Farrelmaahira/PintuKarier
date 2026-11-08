import { useId, type ReactNode } from "react";
import ui from "@/styles/ui.module.css";

interface SelectFieldProps {
  label: string;
  value: string | number;
  onChange: (v: string) => void;
  options: { value: string | number; label: string }[];
  helper?: ReactNode;
  /** Aksi kecil sejajar label (mis. tombol "Acak"). */
  labelAction?: ReactNode;
}

/** Padanan Field untuk <select>, memakai gaya input dan label yang sama. */
export function SelectField({ label, value, onChange, options, helper, labelAction }: SelectFieldProps) {
  const id = useId();
  return (
    <div className={ui.field}>
      <div className={ui.labelRow}>
        <label htmlFor={id} className={ui.label}>
          {label}
        </label>
        {labelAction}
      </div>
      <select id={id} className={ui.input} value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {helper && <span className={ui.helper}>{helper}</span>}
    </div>
  );
}
