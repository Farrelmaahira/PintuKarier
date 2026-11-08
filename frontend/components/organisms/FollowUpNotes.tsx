"use client";

import { useState, useTransition } from "react";
import { Plus } from "@phosphor-icons/react";
import { Button } from "../atoms/Button";
import { Field } from "../molecules/Field";
import { Notice } from "../molecules/Notice";
import { NoteItem } from "../molecules/NoteItem";
import { Panel } from "../molecules/Panel";
import { Segmented } from "../molecules/Segmented";
import { addNote } from "@/lib/actions/addNote";
import { COURSE_BY_COMPETENCY } from "@/lib/data/studyProgram/info";
import type { FollowUpNote } from "@/lib/data/studyProgram/types";
import app from "@/styles/app.module.css";

interface FollowUpNotesProps {
  competencies: string[];
  notes: FollowUpNote[];
  studyProgramId: string;
  studyProgramName: string;
}

/** Catatan tindak lanjut dosen di mata kuliah atau pelatihan, disimpan lewat API. */
export function FollowUpNotes({ competencies, notes, studyProgramId, studyProgramName }: FollowUpNotesProps) {
  const [selectedCompetency, setSelectedCompetency] = useState(competencies[0] ?? "");
  const [action, setAction] = useState("");
  const [tried, setTried] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, startSaving] = useTransition();
  // Pilihan bisa hilang saat filter ganti; jatuh ke kompetensi teratas.
  const current = competencies.includes(selectedCompetency) ? selectedCompetency : (competencies[0] ?? "");
  const actionError = action.trim().length < 10 ? "Ceritain rencananya, minimal 10 karakter." : null;

  return (
    <Panel title="Catatan tindak lanjut" tag={studyProgramName}>
      {competencies.length > 0 && (
        <form
          className={app.stack}
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            setTried(true);
            if (actionError) return;
            startSaving(async () => {
              setError(null);
              const result = await addNote(studyProgramId, { competency: current, course: COURSE_BY_COMPETENCY[current] ?? "Pelatihan singkat", action: action.trim() });
              if (!result.ok) return setError(result.error);
              setAction("");
              setTried(false);
            });
          }}
        >
          <span className={app.label}>Kompetensi</span>
          <Segmented label="Kompetensi" options={competencies} value={current} onChange={setSelectedCompetency} />
          <Field
            label={`Rencana di ${COURSE_BY_COMPETENCY[current] ?? "pelatihan"}`}
            value={action}
            onChange={setAction}
            multiline
            placeholder="Misal: tambah 1 tugas besar pakai Playwright di minggu 10."
            error={tried ? actionError : null}
          />
          {error && <Notice tone="error">{error}</Notice>}
          <Button type="submit" size="sm" loading={saving} disabled={saving} icon={<Plus size={18} />}>
            Catat tindak lanjut
          </Button>
        </form>
      )}
      <ul className={app.notes}>
        {notes.map((note, index) => (
          <NoteItem key={note.id ?? `${note.competency}-${index}`} note={note} />
        ))}
      </ul>
    </Panel>
  );
}
