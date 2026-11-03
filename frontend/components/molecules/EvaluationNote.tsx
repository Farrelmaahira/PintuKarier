import type { ReactNode } from "react";

interface EvaluationNoteProps {
  color: string;
  title: string;
  children: ReactNode;
}

/** Catatan evaluasi dengan garis tepi berwarna (hijau untuk kekuatan, oranye untuk saran). */
export function EvaluationNote({ color, title, children }: EvaluationNoteProps) {
  return (
    <div style={{ padding: 12, borderLeft: `4px solid ${color}`, background: "var(--surface)" }}>
      <strong style={{ color: "var(--ink)", display: "block", fontSize: 14 }}>{title}</strong>
      <span style={{ fontSize: 14, color: "var(--text-muted)" }}>{children}</span>
    </div>
  );
}
