import type { ReactNode } from "react";
import type { Tone } from "@/lib/tone";
import ui from "@/styles/ui.module.css";

interface BadgeProps {
  tone?: Tone;
  children: ReactNode;
}

/** Label status kotak; satu warna per makna (lib/tone.ts). */
export function Badge({ tone = "none", children }: BadgeProps) {
  return <span className={`${ui.badge} ${ui[`tone-${tone}`]}`}>{children}</span>;
}
