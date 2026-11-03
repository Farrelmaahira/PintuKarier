import { Badge } from "../atoms/Badge";
import { Button } from "../atoms/Button";
import { Meter } from "../atoms/Meter";
import type { Application, VacancySummary } from "@/lib/data/student";
import { APPLICATION_STAGES } from "@/lib/data/student";
import { STATUS_TONE } from "@/lib/tone";
import rows from "@/styles/rows.module.css";
import app from "@/styles/app.module.css";

const ACTION_BY_STATUS: Partial<Record<Application["status"], string>> = {
  "Lengkapi lamaran": "Lanjutkan lamaran",
  "AI Interview": "Mulai AI Interview",
  Lolos: "Baca feedback",
  "Belum lolos": "Baca feedback",
};

interface ApplicationRowProps {
  application: Application;
  vacancy: VacancySummary;
}

export function ApplicationRow({ application, vacancy }: ApplicationRowProps) {
  const action = ACTION_BY_STATUS[application.status];
  const href = application.stage === 5 ? "/mahasiswa/feedback" : `/mahasiswa/lamar?lowongan=${encodeURIComponent(application.vacancy)}`;
  return (
    <li className={rows.row}>
      <div className={rows.main}>
        <div className={rows.top}>
          <Badge tone={STATUS_TONE[application.status]}>{application.status}</Badge>
          <span className={app.meta}>Update {application.lastUpdate}</span>
        </div>
        <strong className={app.name}>
          {vacancy.position} <span className={app.at}>di {vacancy.company}</span>
        </strong>
        <div className={app.stage}>
          <Meter value={((application.stage + 1) / APPLICATION_STAGES.length) * 100} label={`Tahap ${application.stage + 1} dari ${APPLICATION_STAGES.length}`} tone={vacancy.tone} />
          <span className={app.meta}>
            {application.stage + 1}/{APPLICATION_STAGES.length} · {APPLICATION_STAGES[application.stage]}
          </span>
        </div>
        <p className={app.note}>{application.note}</p>
      </div>
      {action && (
        <div className={rows.actions}>
          <Button href={href} size="sm" variant={application.stage < 3 ? "primary" : "ghost"}>
            {action}
          </Button>
        </div>
      )}
    </li>
  );
}
