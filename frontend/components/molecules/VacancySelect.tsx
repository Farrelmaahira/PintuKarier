import type { Vacancy } from "@/lib/data/student";
import app from "@/styles/app.module.css";
import ui from "@/styles/ui.module.css";

interface VacancySelectProps {
  vacancies: Vacancy[];
  value: string;
  onChange: (vacancyId: string) => void;
}

/** Pilihan lowongan di toolbar dashboard HRD. */
export function VacancySelect({ vacancies, value, onChange }: VacancySelectProps) {
  return (
    <div className={app.toolbar}>
      <label className={ui.field}>
        <span className={ui.label}>Lowongan</span>
        <select className={ui.input} value={value} onChange={(event) => onChange(event.target.value)}>
          {vacancies.map((vacancy) => (
            <option key={vacancy.id} value={vacancy.id}>
              {vacancy.position}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
