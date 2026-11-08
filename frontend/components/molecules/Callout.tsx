import type { ReactNode } from "react";
import ui from "@/styles/ui.module.css";

interface CalloutProps {
  /** `plain`: tanpa bingkai dan latar, hanya judul dan teks. */
  tone?: "info" | "warn" | "error" | "plain";
  title?: ReactNode;
  icon?: ReactNode;
  children: ReactNode;
}

/** Kotak catatan dengan garis tepi kiri; `warn` dan `error` memakai latar lembut. */
export function Callout({ tone = "info", title, icon, children }: CalloutProps) {
  return (
    <div className={`${ui.callout} ${tone !== "info" ? ui[`callout-${tone}`] : ""}`} role={tone === "error" ? "alert" : undefined}>
      {title && (
        <div className={ui.calloutTitle}>
          {icon}
          {title}
        </div>
      )}
      {children}
    </div>
  );
}
