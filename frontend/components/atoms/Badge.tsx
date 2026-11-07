import type { ReactNode } from "react";
import type { Tone } from "@/lib/tone";
import ui from "@/styles/ui.module.css";

interface BadgeProps {
  tone?: Tone;
  title?: string;
  children: ReactNode;
}

/** Label status kotak; satu warna per makna (lib/tone.ts). */
export function Badge({ tone = "none", title, children }: BadgeProps) {
  return (
    <span className={`${ui.badge} ${ui[`tone-${tone}`]}`} title={title}>
      {children}
    </span>
  );
}
