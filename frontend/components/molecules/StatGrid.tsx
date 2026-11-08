import type { ReactNode } from "react";
import ui from "@/styles/ui.module.css";

interface StatGridProps {
  children: ReactNode;
  cols?: number;
}

export function StatGrid({ children, cols = 3 }: StatGridProps) {
  return (
    <div className={ui.statGrid} data-cols={cols} style={{ "--cols": cols } as React.CSSProperties}>
      {children}
    </div>
  );
}
