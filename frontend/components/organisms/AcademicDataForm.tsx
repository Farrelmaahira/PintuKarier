import { FloppyDisk } from "@phosphor-icons/react";
import type { FormEvent } from "react";
import { Button } from "../atoms/Button";
import { Field } from "../molecules/Field";
import { Panel } from "../molecules/Panel";
import type { StudentProfileData, UpdateProfileField } from "@/lib/hooks/useStudentProfile";
import app from "@/styles/app.module.css";
import ui from "@/styles/ui.module.css";

interface AcademicDataFormProps {
  profile: StudentProfileData;
  saving: boolean;
  onFieldChange: UpdateProfileField;
  onSubmit: (event: FormEvent) => void;
}

/** Form data akademik mahasiswa: identitas, kampus, semester, IPK, dan ringkasan diri. */
export function AcademicDataForm({ profile, saving, onFieldChange, onSubmit }: AcademicDataFormProps) {
  return (
    <form onSubmit={onSubmit}>
      <Panel title="Data Akademik Mahasiswa" tag="Terhubung Siakad">
        <div className={app.stack}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
            <Field label="Nama Lengkap" value={profile.name} onChange={(value) => onFieldChange("name", value)} required />
            <Field label="NIM" value={profile.studentNumber} onChange={(value) => onFieldChange("studentNumber", value)} required />
            <Field label="Program Studi" value={profile.studyProgram} onChange={(value) => onFieldChange("studyProgram", value)} required />
            <Field label="Perguruan Tinggi" value={profile.campus} onChange={(value) => onFieldChange("campus", value)} required />
            <Field
              label="Semester Saat Ini"
              type="number"
              value={String(profile.semester)}
              onChange={(value) => onFieldChange("semester", Number(value))}
              min={1}
              max={14}
              required
            />
            <Field
              label="IPK Kumulatif"
              type="number"
              step="0.01"
              value={String(profile.gpa)}
              onChange={(value) => onFieldChange("gpa", Number(value))}
              min={0}
              max={4}
              required
            />
          </div>
          <label className={ui.field} style={{ marginTop: 8 }}>
            <span className={ui.label}>Ringkasan Profil Diri</span>
            <textarea
              className={app.textarea}
              rows={3}
              value={profile.summary}
              onChange={(event) => onFieldChange("summary", event.target.value)}
            />
          </label>
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
            <Button type="submit" loading={saving} icon={<FloppyDisk size={20} />}>
              Simpan Perubahan
            </Button>
          </div>
        </div>
      </Panel>
    </form>
  );
}
