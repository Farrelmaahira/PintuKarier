"use client";

import { useState } from "react";
import { Plus } from "@phosphor-icons/react";
import { Button } from "../atoms/Button";
import { EmptyState } from "../molecules/EmptyState";
import { HrVacancyRow } from "../molecules/HrVacancyRow";
import { Notice } from "../molecules/Notice";
import { Panel } from "../molecules/Panel";
import { VacancyFormFields } from "./VacancyFormFields";
import type { Vacancy } from "@/lib/data/student";
import { useVacancyForm } from "@/lib/hooks/useVacancyForm";
import app from "@/styles/app.module.css";
import rows from "@/styles/rows.module.css";

interface VacancyFormProps {
  vacancies: Vacancy[];
}

/** Lowongan milik HRD + form buat lowongan baru lewat API. */
export function VacancyForm({ vacancies }: VacancyFormProps) {
  const [open, setOpen] = useState(false);
  const state = useVacancyForm(() => setOpen(false));

  return (
    <Panel
      title="Lowongan aktif"
      flush
      actions={
        <Button size="sm" variant="ghost" onClick={() => setOpen(!open)} icon={<Plus size={18} />}>
          {open ? "Tutup" : "Buat lowongan"}
        </Button>
      }
    >
      {open && <VacancyFormFields state={state} />}
      {state.savedPosition && (
        <div className={app.pad}>
          <Notice tone="success">
            “{state.savedPosition}” udah dibuka. Pertanyaan pre-screening dan AI Interview-nya lagi disusun AI dari syarat kamu.
          </Notice>
        </div>
      )}
      {vacancies.length ? (
        <ul className={rows.list}>
          {vacancies.map((vacancy) => (
            <HrVacancyRow key={vacancy.id} vacancy={vacancy} />
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
