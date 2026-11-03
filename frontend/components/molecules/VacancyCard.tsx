import { ArrowUpRight } from "@phosphor-icons/react";
import { Badge } from "../atoms/Badge";
import { Button } from "../atoms/Button";
import { ChipList } from "./ChipList";
import type { VacancySummary } from "@/lib/data/student";
import app from "@/styles/app.module.css";

interface VacancyCardProps {
  vacancy: VacancySummary;
}

/** Kartu lowongan di grid portal mahasiswa. */
export function VacancyCard({ vacancy }: VacancyCardProps) {
  const closed = vacancy.deadline === "Ditutup";

  return (
    <div className={app.jobCard} style={{ opacity: closed ? 0.6 : 1 }}>
      <div className={app.jobCardTop}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span className={app.swatch} style={{ background: vacancy.tone }} aria-hidden />
          <span className={app.meta} style={{ fontWeight: 500 }}>
            {vacancy.type}
          </span>
        </div>
        {closed ? (
          <Badge>Ditutup</Badge>
        ) : (
          <span style={{ fontSize: 12, fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}>Batas: {vacancy.deadline}</span>
        )}
      </div>

      <div className={app.jobCardBody}>
        <div>
          <strong className={app.name} style={{ display: "block", fontSize: 20 }}>
            {vacancy.position}
          </strong>
          <div className={app.meta} style={{ marginTop: 6, fontSize: 14 }}>
            {vacancy.company} · {vacancy.location}
          </div>
        </div>

        <ChipList items={vacancy.tags} style={{ marginTop: "auto" }} />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 13,
            color: "var(--text-muted)",
            paddingTop: 8,
            borderTop: "1px dashed var(--line)",
          }}
        >
          <span>Total pelamar</span>
          <span className="num" style={{ fontWeight: 500, color: "var(--ink)" }}>
            {vacancy.applicants} orang
          </span>
        </div>
      </div>

      <div className={app.jobCardFooter}>
        {closed ? (
          <span style={{ fontSize: 13, color: "var(--text-muted)" }}>Pendaftaran berakhir</span>
        ) : (
          <Button href={`/mahasiswa/lamar?lowongan=${vacancy.id}`} size="sm" block icon={<ArrowUpRight size={18} />}>
            Lamar posisi ini
          </Button>
        )}
      </div>
    </div>
  );
}
