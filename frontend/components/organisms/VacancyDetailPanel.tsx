import { ChipList } from "../molecules/ChipList";
import { Panel } from "../molecules/Panel";
import type { Vacancy } from "@/lib/data/student";
import app from "@/styles/app.module.css";

interface VacancyDetailPanelProps {
  vacancy: Vacancy;
  cvFileName: string;
}

/** Ringkasan lowongan yang sedang dilamar: syarat wajib, nilai plus, dan nama CV yang diunggah. */
export function VacancyDetailPanel({ vacancy, cvFileName }: VacancyDetailPanelProps) {
  return (
    <Panel title="Lowongan yang dilamar">
      <div className={app.stack}>
        <strong className={app.name}>{vacancy.position}</strong>
        <span className={app.meta}>
          {vacancy.company} · {vacancy.location} · {vacancy.type}
        </span>
        {vacancy.description && <p className={app.note}>{vacancy.description}</p>}
        <span className={app.meta}>Syarat wajib</span>
        <ChipList items={vacancy.mustHave} />
        {vacancy.niceToHave.length > 0 && (
          <>
            <span className={app.meta}>Nilai plus</span>
            <ChipList items={vacancy.niceToHave} />
          </>
        )}
        {cvFileName && <span className={app.meta}>CV: {cvFileName}</span>}
        <p className={app.note}>
          Skor kamu dihitung dari bukti, bukan kata kunci. Proyek PBL, organisasi, dan magang singkat tetap kehitung, jadi tulis peran kamu sejelas mungkin.
        </p>
      </div>
    </Panel>
  );
}
