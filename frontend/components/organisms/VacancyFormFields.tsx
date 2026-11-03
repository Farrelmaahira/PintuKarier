import { Button } from "../atoms/Button";
import { Field } from "../molecules/Field";
import { Notice } from "../molecules/Notice";
import { Segmented } from "../molecules/Segmented";
import { JOB_FIELDS, type useVacancyForm } from "@/lib/hooks/useVacancyForm";
import app from "@/styles/app.module.css";

const TYPES = ["Magang", "Full-time", "Kontrak"];

interface VacancyFormFieldsProps {
  state: ReturnType<typeof useVacancyForm>;
}

/** Isian form lowongan baru. */
export function VacancyFormFields({ state }: VacancyFormFieldsProps) {
  const { form, setField, errors } = state;
  return (
    <form className={`${app.stack} ${app.pad}`} noValidate onSubmit={state.submit}>
      <Field label="Posisi" value={form.position} onChange={(value) => setField("position", value)} placeholder="Misal: Data Analyst Intern" error={errors.position} />
      <Segmented label="Kelompok posisi" options={JOB_FIELDS} value={form.jobField} onChange={(value) => setField("jobField", value)} />
      <Segmented label="Tipe" options={TYPES} value={form.type} onChange={(value) => setField("type", value)} />
      <Field label="Lokasi" value={form.location} onChange={(value) => setField("location", value)} placeholder="Misal: Jakarta Selatan, hybrid" />
      <Field label="Deadline" type="date" value={form.deadline} onChange={(value) => setField("deadline", value)} helper="Kosongkan kalau belum ada batas." />
      <Field label="Deskripsi" value={form.description} onChange={(value) => setField("description", value)} multiline placeholder="Tugas utama dan konteks tim." />
      <Field
        label="Syarat wajib"
        value={form.mustHave}
        onChange={(value) => setField("mustHave", value)}
        multiline
        placeholder={"SQL\nPython atau R\nVisualisasi data"}
        helper="Satu syarat per baris. Syarat wajib tanpa bukti membuat kandidat masuk Tidak Memenuhi Syarat."
        error={errors.mustHave}
      />
      <Field
        label="Nilai plus"
        value={form.niceToHave}
        onChange={(value) => setField("niceToHave", value)}
        multiline
        placeholder={"Looker Studio\nPengalaman magang"}
        helper="Opsional, satu per baris."
      />
      {state.error && <Notice tone="error">{state.error}</Notice>}
      <Button type="submit" loading={state.saving} disabled={state.saving}>
        Buka lowongan
      </Button>
    </form>
  );
}
