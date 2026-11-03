import { EmptyState } from "../molecules/EmptyState";
import { Panel } from "../molecules/Panel";
import { VacancyRow } from "../molecules/VacancyRow";
import type { VacancySummary } from "@/lib/data/student";
import rows from "@/styles/rows.module.css";

interface VacanciesPanelProps {
  vacancies: VacancySummary[];
  appliedIds: Set<string>;
}

/** Lowongan dari pusat karier; yang sudah dilamar diberi penanda. */
export function VacanciesPanel({ vacancies, appliedIds }: VacanciesPanelProps) {
  return (
    <Panel title="Lowongan dari pusat karier" flush>
      {vacancies.length ? (
        <ul className={rows.list}>
          {vacancies.map((vacancy) => (
            <VacancyRow key={vacancy.id} vacancy={vacancy} applied={appliedIds.has(vacancy.id)} />
          ))}
        </ul>
      ) : (
        <EmptyState title="Belum ada lowongan" img="undraw/empty" large>
          Lowongan dari mitra bakal muncul di sini.
        </EmptyState>
      )}
    </Panel>
  );
}
