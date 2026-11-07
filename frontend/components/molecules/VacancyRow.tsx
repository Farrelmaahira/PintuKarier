import { CheckCircle } from "@phosphor-icons/react/dist/ssr";
import { Badge } from "../atoms/Badge";
import { Button } from "../atoms/Button";
import { ChipList } from "./ChipList";
import type { VacancySummary } from "@/lib/data/student";
import app from "@/styles/app.module.css";
import rows from "@/styles/rows.module.css";

interface VacancyRowProps {
  vacancy: VacancySummary;
  applied: boolean;
}

/** Satu lowongan di portal mahasiswa. */
export function VacancyRow({ vacancy, applied }: VacancyRowProps) {
  const closed = vacancy.deadline === "Ditutup";
  return (
    <li className={`${rows.row} ${rows.cornered}`}>
      <div className={rows.main}>
        <div className={rows.top}>
          <span className={app.swatch} style={{ background: vacancy.tone }} aria-hidden />
          <strong className={app.name}>{vacancy.position}</strong>
        </div>
        <dl className={rows.facts}>
          <div>
            <dt>Perusahaan</dt>
            <dd>{vacancy.company}</dd>
          </div>
          <div>
            <dt>Lokasi</dt>
            <dd>{vacancy.location}</dd>
          </div>
          <div>
            <dt>Deadline</dt>
            <dd>{vacancy.deadline}</dd>
          </div>
          <div>
            <dt>Pelamar</dt>
            <dd className="num">{vacancy.applicants}</dd>
          </div>
        </dl>
        <ChipList items={vacancy.tags} />
      </div>
      <div className={rows.corner}>
        <Badge>{vacancy.type}</Badge>
      </div>
      <div className={rows.actions}>
        {applied ? (
          <Badge tone="green">
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
              <CheckCircle size={14} weight="bold" />
              Sudah kamu lamar
            </span>
          </Badge>
        ) : closed ? (
          <Badge>Ditutup</Badge>
        ) : (
          <Button href={`/mahasiswa/lamar?lowongan=${vacancy.id}`} size="sm">
            Lamar
          </Button>
        )}
      </div>
    </li>
  );
}
