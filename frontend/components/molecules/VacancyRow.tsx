import { Buildings, Calendar, MapPin } from "@phosphor-icons/react/dist/ssr";
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
        <span className={app.meta}>{vacancy.applicants} pelamar</span>
        <div className={rows.top}>
          <strong className={app.name}>{vacancy.position}</strong>
        </div>
        <dl className={rows.factsAligned}>
          <div>
            <dt>
              <Buildings size={14} aria-hidden /> Perusahaan
            </dt>
            <dd>{vacancy.company}</dd>
          </div>
          <div>
            <dt>
              <MapPin size={14} aria-hidden /> Lokasi
            </dt>
            <dd>{vacancy.location}</dd>
          </div>
          <div>
            <dt>
              <Calendar size={14} aria-hidden /> Deadline
            </dt>
            <dd>{vacancy.deadline}</dd>
          </div>
        </dl>
        <ChipList items={vacancy.tags} />
      </div>
      <div className={rows.corner}>
        <Badge>{vacancy.type}</Badge>
      </div>
      <div className={rows.actions}>
        {applied ? (
          <Badge tone="settled">Udah kamu lamar</Badge>
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
