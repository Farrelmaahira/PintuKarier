import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import type { ReactNode } from "react";
import { Button } from "../atoms/Button";
import app from "@/styles/app.module.css";
import ui from "@/styles/ui.module.css";

interface OverviewModuleCardProps {
  icon: ReactNode;
  title: string;
  badge: ReactNode;
  description: string;
  href: string;
  cta: string;
  children?: ReactNode;
}

/** Kartu akses cepat ke satu modul Dasbor Prodi, satu keluarga dengan VacancyCard: header, isi, dan tombol buka. */
export function OverviewModuleCard({ icon, title, badge, description, href, cta, children }: OverviewModuleCardProps) {
  return (
    <div className={app.jobCard}>
      <div className={app.jobCardTop}>
        <span className={ui.itemHead} style={{ alignItems: "center" }}>
          {icon}
          <strong className={app.name}>{title}</strong>
        </span>
        {badge}
      </div>
      <div className={app.jobCardBody}>
        <p className={app.meta}>{description}</p>
        {children}
      </div>
      <div className={app.jobCardFooter}>
        <Button href={href} size="sm" block icon={<ArrowUpRight size={18} />}>
          {cta}
        </Button>
      </div>
    </div>
  );
}
