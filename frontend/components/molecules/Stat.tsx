import type { ReactNode } from "react";
import ui from "@/styles/ui.module.css";

interface StatProps {
  label: string;
  value: ReactNode;
}

export function Stat({ label, value }: StatProps) {
  return (
    <div className={ui.stat}>
      <span className={ui.statLabel}>{label}</span>
      <span className={ui.statValue}>{value}</span>
    </div>
  );
}
