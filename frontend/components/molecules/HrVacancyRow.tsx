import { Badge } from "../atoms/Badge";
import type { Vacancy } from "@/lib/data/student";
import app from "@/styles/app.module.css";
import rows from "@/styles/rows.module.css";

interface HrVacancyRowProps {
  vacancy: Vacancy;
}

/** Satu lowongan milik HRD di daftar lowongan aktif. */
export function HrVacancyRow({ vacancy }: HrVacancyRowProps) {
  return (
    <li className={rows.row}>
      <div className={rows.main}>
        <div className={rows.top}>
          <strong className={app.name}>{vacancy.position}</strong>
          <Badge tone={vacancy.closed ? "orange" : "green"}>{vacancy.closed ? "Ditutup" : "Dibuka"}</Badge>
        </div>
        <span className={app.meta}>
          {vacancy.type} · {vacancy.jobField} · {vacancy.applicants} pelamar · wajib: {vacancy.mustHave.join(", ")}
        </span>
      </div>
    </li>
  );
}
