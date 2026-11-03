import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import type { ReactNode } from "react";
import { Button } from "../atoms/Button";
import app from "@/styles/app.module.css";

interface OverviewModuleCardProps {
  icon: ReactNode;
  title: string;
  badge: ReactNode;
  description: string;
  href: string;
  cta: string;
  children?: ReactNode;
}

/** Kartu akses cepat ke satu modul Dasbor Prodi: judul, badge, penjelasan, ringkasan, dan tombol buka. */
export function OverviewModuleCard({ icon, title, badge, description, href, cta, children }: OverviewModuleCardProps) {
  return (
    <div style={{ border: "var(--border)", background: "var(--surface)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      <div style={{ padding: 20, display: "grid", gap: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {icon}
            <strong style={{ fontSize: 17 }}>{title}</strong>
          </div>
          {badge}
        </div>
        <p className={app.meta}>{description}</p>
        {children}
      </div>
      <div style={{ padding: 14, borderTop: "var(--border)", background: "var(--surface-raised)" }}>
        <Button href={href} size="sm" block icon={<ArrowUpRight size={18} />}>
          {cta}
        </Button>
      </div>
    </div>
  );
}
