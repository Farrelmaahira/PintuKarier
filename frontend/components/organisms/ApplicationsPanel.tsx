import { ApplicationRow } from "../molecules/ApplicationRow";
import { EmptyState } from "../molecules/EmptyState";
import { Panel } from "../molecules/Panel";
import type { Application, VacancySummary } from "@/lib/data/student";
import rows from "@/styles/rows.module.css";

interface ApplicationsPanelProps {
  applications: Application[];
  vacancies: Map<string, VacancySummary>;
}

/** Daftar lamaran mahasiswa beserta lowongannya. */
export function ApplicationsPanel({
  applications,
  vacancies,
}: ApplicationsPanelProps) {
  return (
    <Panel title="Lamaran kamu" flush>
      {applications.length ? (
        <ul className={rows.list}>
          {applications.map((application) => {
            const vacancy = vacancies.get(application.vacancy);
            return (
              vacancy && (
                <ApplicationRow
                  key={application.id}
                  application={application}
                  vacancy={vacancy}
                />
              )
            );
          })}
        </ul>
      ) : (
        <EmptyState title="Belum ada lamaran" img="undraw/empty" large>
          Pilih lowongan di bawah, unggah CV, dan profil kamu keisi otomatis.
        </EmptyState>
      )}
    </Panel>
  );
}
