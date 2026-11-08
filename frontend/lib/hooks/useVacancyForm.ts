"use client";

import { useState, useTransition, type FormEvent } from "react";
import { createVacancy, type NewVacancy } from "../actions/createVacancy";
import { POSITIONS } from "../data/studyProgram/info";

export const JOB_FIELDS = POSITIONS.filter((position) => position !== "Semua posisi");
const splitLines = (value: string) => value.split("\n").map((line) => line.trim()).filter(Boolean);

const EMPTY_FORM = {
  position: "",
  jobField: JOB_FIELDS[0]!,
  type: "Magang",
  location: "",
  deadline: "",
  description: "",
  mustHave: "",
  niceToHave: "",
};
export type VacancyFormValues = typeof EMPTY_FORM;

export interface VacancyFormOptions {
  initialValues?: VacancyFormValues;
  /** Pengganti penyimpanan bawaan (buat baru), mis. untuk mengubah lowongan. */
  save?: (input: NewVacancy) => ReturnType<typeof createVacancy>;
}

/** State, validasi, dan pengiriman form lowongan; `onSaved` menerima nama posisi setelah berhasil. */
export function useVacancyForm(onSaved: (position: string) => void, options: VacancyFormOptions = {}) {
  const [form, setForm] = useState<VacancyFormValues>(options.initialValues ?? EMPTY_FORM);
  const [tried, setTried] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, startSaving] = useTransition();

  const setField = <K extends keyof VacancyFormValues>(field: K, value: VacancyFormValues[K]) =>
    setForm((current) => ({ ...current, [field]: value }));
  const positionError = form.position.trim().length < 3 ? "Nama posisinya minimal 3 huruf." : null;
  const mustHaveError = !splitLines(form.mustHave).length ? "Isi minimal satu syarat wajib, satu per baris." : null;

  const submit = (event: FormEvent) => {
    event.preventDefault();
    setTried(true);
    if (positionError || mustHaveError) return;
    startSaving(async () => {
      setError(null);
      const save = options.save ?? createVacancy;
      const result = await save({
        ...form,
        position: form.position.trim(),
        mustHave: splitLines(form.mustHave),
        niceToHave: splitLines(form.niceToHave),
      });
      if (!result.ok) return setError(result.error);
      onSaved(result.data.position);
    });
  };

  return {
    form,
    setField,
    submit,
    saving,
    error,
    errors: { position: tried ? positionError : null, mustHave: tried ? mustHaveError : null },
  };
}
