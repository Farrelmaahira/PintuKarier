import { Plus } from "@phosphor-icons/react/dist/ssr";
import { Button } from "../atoms/Button";
import { EmptyState } from "../molecules/EmptyState";
import { HrVacancyCard } from "../molecules/HrVacancyCard";
import { Notice } from "../molecules/Notice";
import { Panel } from "../molecules/Panel";
import type { Vacancy } from "@/lib/data/student";
import app from "@/styles/app.module.css";

interface VacancyFormProps {
  vacancies: Vacancy[];
  /** Posisi lowongan yang baru dibuat, untuk pesan sukses. */
  created?: string;
}

/** Lowongan milik HRD; buat dan ubah lowongan dikerjakan di halaman sendiri. */
export function VacancyForm({ vacancies, created }: VacancyFormProps) {
  return (
    <Panel
      title="Lowongan aktif"
      flush
      actions={
        <Button size="sm" variant="ghost" href="/hrd/lowongan/baru" icon={<Plus size={18} />}>
          Buat lowongan
        </Button>
      }
    >
      {created && (
        <div className={app.pad} style={{ borderBottom: "var(--border)" }}>
          <Notice tone="success">“{created}” udah dibuka. Pertanyaan pre-screening dan AI Interview-nya lagi disusun AI dari syarat kamu.</Notice>
        </div>
      )}
      {vacancies.length ? (
        <ul className={`${app.jobGrid} ${app.cardGridPad}`}>
          {vacancies.map((vacancy) => (
            <HrVacancyCard key={vacancy.id} vacancy={vacancy} />
          ))}
        </ul>
      ) : (
        <EmptyState title="Belum ada lowongan" img="undraw/empty" large>
          Klik Buat lowongan buat mulai rekrutmen kampus.
        </EmptyState>
      )}
    </Panel>
  );
}
