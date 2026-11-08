"use client";

import { Button } from "../atoms/Button";
import { Field } from "../molecules/Field";
import { SelectField } from "../molecules/SelectField";
import type { AdminLearningFormState } from "@/lib/hooks/useAdminLearningManager";
import app from "@/styles/app.module.css";
import ui from "@/styles/ui.module.css";

const DIFFICULTIES = ["Dasar", "Menengah", "Lanjutan"] as const;
const DIFFICULTY_OPTIONS = DIFFICULTIES.map((v) => ({ value: v, label: v }));
const ANSWER_OPTIONS = [0, 1, 2, 3].map((i) => ({ value: i, label: `Opsi ${i + 1}` }));

interface LearningModuleFormProps {
  form: AdminLearningFormState;
  onChange: <K extends keyof AdminLearningFormState>(key: K, value: AdminLearningFormState[K]) => void;
  onSubmit: () => void;
  onCancel: () => void;
  submitLabel: string;
}

/** Isian modul belajar dan drill-nya; dipakai halaman tambah dan halaman ubah. */
export function LearningModuleForm({ form, onChange, onSubmit, onCancel, submitLabel }: LearningModuleFormProps) {
  return (
    <form
      className={`${ui.formStack} ${app.pad}`}
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <Field label="Judul modul" value={form.title} onChange={(v) => onChange("title", v)} placeholder="misal: Optimasi Kueri PostgreSQL" />

      <div className={ui.formGrid}>
        <Field label="Kategori" value={form.category} onChange={(v) => onChange("category", v)} placeholder="misal: Database, DevOps" />
        <SelectField label="Tingkat kesulitan" value={form.difficulty} onChange={(v) => onChange("difficulty", v as AdminLearningFormState["difficulty"])} options={DIFFICULTY_OPTIONS} />
      </div>

      <div className={ui.formGrid}>
        <Field label="Durasi (menit)" type="number" value={String(form.durationMinutes)} onChange={(v) => onChange("durationMinutes", Number(v) || 30)} />
        <Field label="Estimasi kenaikan skor" type="number" value={String(form.estimatedGain)} onChange={(v) => onChange("estimatedGain", Number(v) || 5)} />
      </div>

      <Field label="Ringkasan materi" multiline value={form.summary} onChange={(v) => onChange("summary", v)} placeholder="Kompetensi yang dicakup dan manfaatnya untuk seleksi kerja." />
      <Field label="Kompetensi terkait" value={form.competencies} onChange={(v) => onChange("competencies", v)} placeholder="PostgreSQL, Query Optimization" helper="Pisahkan dengan koma." />
      <Field label="URL bahan ajar" value={form.externalResourceUrl} onChange={(v) => onChange("externalResourceUrl", v)} placeholder="https://..." />

      <label className={ui.checkRow}>
        <input type="checkbox" checked={form.includeDrill} onChange={(e) => onChange("includeDrill", e.target.checked)} />
        Sertakan studi kasus drill
      </label>

      {form.includeDrill && (
        <div className={ui.formSection}>
          <Field label="Skenario" multiline value={form.scenario} onChange={(v) => onChange("scenario", v)} placeholder="Konteks masalah nyata di lapangan." />
          <Field label="Pertanyaan" value={form.problemStatement} onChange={(v) => onChange("problemStatement", v)} placeholder="Apa yang harus diputuskan mahasiswa?" />
          <Field label="Opsi 1" value={form.option0} onChange={(v) => onChange("option0", v)} />
          <Field label="Opsi 2" value={form.option1} onChange={(v) => onChange("option1", v)} />
          <Field label="Opsi 3" value={form.option2} onChange={(v) => onChange("option2", v)} />
          <Field label="Opsi 4" value={form.option3} onChange={(v) => onChange("option3", v)} />
          <div className={ui.formGrid}>
            <SelectField label="Jawaban benar" value={form.correctIndex} onChange={(v) => onChange("correctIndex", Number(v))} options={ANSWER_OPTIONS} />
            <Field label="Poin kesiapan drill" type="number" value={String(form.readinessBoost)} onChange={(v) => onChange("readinessBoost", Number(v) || 8)} />
          </div>
          <Field label="Penjelasan jawaban" multiline value={form.explanation} onChange={(v) => onChange("explanation", v)} placeholder="Mengapa opsi itu paling tepat." />
        </div>
      )}

      <div className={ui.btnRow}>
        <Button type="submit">{submitLabel}</Button>
        <Button variant="plain" onClick={onCancel}>
          Batal
        </Button>
      </div>
    </form>
  );
}
