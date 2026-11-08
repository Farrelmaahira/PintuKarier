import { ArrowUpRight, Buildings, MapPin } from "@phosphor-icons/react/dist/ssr";
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
    <div className={`${app.jobCard} ${closed ? app.jobCardClosed : ""}`}>
      <div className={app.jobCardTop}>
        <span className={app.meta} style={{ fontWeight: 500 }}>
          {vacancy.type}
        </span>
        {closed ? <Badge>Ditutup</Badge> : <span className={`${app.meta} num`}>Batas: {vacancy.deadline}</span>}
      </div>

      <div className={app.jobCardBody}>
        <div className={app.jobCardTitle}>
          <strong className={app.name} style={{ display: "block", fontSize: 20 }}>
            {vacancy.position}
          </strong>
          <div className={app.jobCardMeta}>
            <span>
              <Buildings size={15} aria-hidden />
              {vacancy.company}
            </span>
            <span>
              <MapPin size={15} aria-hidden />
              {vacancy.location}
            </span>
          </div>
        </div>

        {vacancy.tags.length > 0 && <ChipList items={vacancy.tags} style={{ marginTop: "auto" }} />}

        <div className={app.jobCardCount}>
          <span>Total pelamar</span>
          <span className="num">{vacancy.applicants} orang</span>
        </div>
      </div>

      <div className={app.jobCardFooter}>
        {closed ? (
          <span className={app.meta}>Pendaftaran berakhir</span>
        ) : (
          <Button href={`/mahasiswa/lamar?lowongan=${vacancy.id}`} size="sm" block icon={<ArrowUpRight size={18} />}>
            Lamar posisi ini
          </Button>
        )}
      </div>
    </div>
  );
}
