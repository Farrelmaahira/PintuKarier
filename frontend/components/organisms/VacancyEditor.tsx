"use client";

import { useRouter } from "next/navigation";
import { Panel } from "../molecules/Panel";
import { VacancyFormFields } from "./VacancyFormFields";
import { updateVacancy } from "@/lib/actions/updateVacancy";
import type { Vacancy } from "@/lib/data/student";
import { useVacancyForm, type VacancyFormValues } from "@/lib/hooks/useVacancyForm";

const LIST = "/hrd/lowongan";

interface VacancyEditorProps {
  /** Kosong berarti membuat lowongan baru. */
  vacancy?: Vacancy;
}

/** Form lowongan satu halaman: buat baru, atau ubah `vacancy`. Setelah simpan kembali ke daftar. */
export function VacancyEditor({ vacancy }: VacancyEditorProps) {
  const router = useRouter();
  const initialValues: VacancyFormValues | undefined = vacancy && {
    position: vacancy.position,
    jobField: vacancy.jobField,
    type: vacancy.type,
    location: vacancy.location,
    deadline: vacancy.deadline,
    description: vacancy.description,
    mustHave: vacancy.mustHave.join("\n"),
    niceToHave: vacancy.niceToHave.join("\n"),
  };
  const state = useVacancyForm((position) => router.push(vacancy ? LIST : `${LIST}?dibuat=${encodeURIComponent(position)}`), {
    initialValues,
    save: vacancy && ((input) => updateVacancy(vacancy.id, input)),
  });

  return (
    <Panel title={vacancy ? "Ubah lowongan" : "Lowongan baru"} flush>
      <VacancyFormFields state={state} submitLabel={vacancy ? "Simpan perubahan" : "Buka lowongan"} onCancel={() => router.push(LIST)} />
    </Panel>
  );
}
