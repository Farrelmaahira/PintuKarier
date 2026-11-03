import { useId, type ReactNode } from "react";
import ui from "@/styles/ui.module.css";
import app from "@/styles/app.module.css";

interface FieldProps {
  label: string;
  value?: string;
  onChange?: (v: string) => void;
  name?: string;
  type?: "text" | "email" | "password" | "date" | "number";
  required?: boolean;
  min?: number;
  max?: number;
  step?: string;
  defaultValue?: string;
  autoComplete?: string;
  placeholder?: string;
  helper?: ReactNode;
  error?: string | null;
  multiline?: boolean;
}

/**
 * Input atau textarea kotak dengan label di atas, helper dan error di bawah.
 * Controlled lewat value/onChange, atau uncontrolled lewat name/defaultValue untuk form server action.
 */
export function Field({
  label,
  value,
  onChange,
  name,
  type = "text",
  required,
  min,
  max,
  step,
  defaultValue,
  autoComplete = "off",
  placeholder,
  helper,
  error,
  multiline,
}: FieldProps) {
  const id = useId();
  const common = {
    id,
    name,
    value,
    defaultValue,
    placeholder,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": helper ? `${id}-help` : undefined,
  };
  return (
    <div className={ui.field}>
      <label htmlFor={id} className={ui.label}>
        {label}
      </label>
      {multiline ? (
        <textarea {...common} className={`${ui.input} ${app.textarea}`} rows={4} onChange={onChange && ((e) => onChange(e.target.value))} />
      ) : (
        <input {...common} type={type} className={ui.input} autoComplete={autoComplete} required={required} min={min} max={max} step={step} onChange={onChange && ((e) => onChange(e.target.value))} />
      )}
      {helper && (
        <span id={`${id}-help`} className={ui.helper}>
          {helper}
        </span>
      )}
      {error && (
        <span className={ui.fieldError} role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
