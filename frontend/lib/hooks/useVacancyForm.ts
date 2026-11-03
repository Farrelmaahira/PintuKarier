"use client";

import { useState, useTransition, type FormEvent } from "react";
import { createVacancy } from "../actions/createVacancy";
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

/** State, validasi, dan pengiriman form lowongan baru; `onCreated` dipanggil setelah berhasil. */
export function useVacancyForm(onCreated: () => void) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [tried, setTried] = useState(false);
  const [savedPosition, setSavedPosition] = useState<string | null>(null);
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
      const result = await createVacancy({
        ...form,
        position: form.position.trim(),
        mustHave: splitLines(form.mustHave),
        niceToHave: splitLines(form.niceToHave),
      });
      if (!result.ok) return setError(result.error);
      setSavedPosition(result.data.position);
      // Jenis dan kelompok posisi dipertahankan untuk lowongan berikutnya.
      setForm((current) => ({ ...EMPTY_FORM, jobField: current.jobField, type: current.type }));
      setTried(false);
      onCreated();
    });
  };

  return {
    form,
    setField,
    submit,
    saving,
    error,
    savedPosition,
    errors: { position: tried ? positionError : null, mustHave: tried ? mustHaveError : null },
  };
}
