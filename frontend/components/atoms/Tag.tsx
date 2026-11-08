import type { ReactNode } from "react";
import ui from "@/styles/ui.module.css";

interface TagProps {
  children: ReactNode;
  sim?: boolean;
}

/** Chip mono kecil. `sim` menandai sesuatu yang disimulasikan di demo. */
export function Tag({ children, sim }: TagProps) {
  return <span className={`${ui.tag} ${sim ? ui.tagSim : ""}`}>{children}</span>;
}
