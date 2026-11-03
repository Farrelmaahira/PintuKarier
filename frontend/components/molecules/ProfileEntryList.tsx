import type { ProfileEntry } from "@/lib/data/student";
import app from "@/styles/app.module.css";
import ui from "@/styles/ui.module.css";

interface ProfileEntryListProps {
  title: string;
  entries: ProfileEntry[];
}

/** Daftar pengalaman, proyek, atau organisasi hasil ekstraksi CV. */
export function ProfileEntryList({ title, entries }: ProfileEntryListProps) {
  return (
    <div className={ui.field}>
      <span className={ui.label}>{title}</span>
      {entries.map((entry, index) => (
        <div key={`${entry.role}-${index}`} className={app.exp}>
          <strong>{entry.role}</strong>
          <span className={app.meta}>
            {entry.place} · {entry.period}
          </span>
          <p>{entry.points}</p>
        </div>
      ))}
    </div>
  );
}
