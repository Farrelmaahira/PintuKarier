import { Badge } from "../atoms/Badge";
import type { FollowUpNote } from "@/lib/data/studyProgram/types";
import app from "@/styles/app.module.css";

const TONE = { Direncanakan: "lilac", Berjalan: "accent", Selesai: "green" } as const;

interface NoteItemProps {
  note: FollowUpNote;
}

/** Catatan tindak lanjut dosen atau pusat karier. */
export function NoteItem({ note }: NoteItemProps) {
  return (
    <li className={app.noteItem}>
      <div className={app.evidenceHead}>
        <strong>{note.competency}</strong>
        <Badge tone={TONE[note.status]}>{note.status}</Badge>
      </div>
      <p>{note.action}</p>
      <span className={app.meta}>
        {note.course} · {note.author} · {note.date}
      </span>
    </li>
  );
}
