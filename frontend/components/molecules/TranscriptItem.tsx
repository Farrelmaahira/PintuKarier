import { SpeakerHigh, User } from "@phosphor-icons/react/dist/ssr";
import app from "@/styles/app.module.css";

interface TranscriptItemProps {
  no: number;
  question: string;
  answer: string;
  duration: string;
  audioUrl?: string;
  snapshotUrl?: string;
}

export function TranscriptItem({ no, question, answer, duration, audioUrl, snapshotUrl }: TranscriptItemProps) {
  return (
    <li className={app.transcript} style={{ position: "relative" }}>
      <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
        {snapshotUrl ? (
          <div style={{ flexShrink: 0, width: 84, borderRadius: 4, overflow: "hidden", border: "1px solid var(--line)" }}>
            <img
              src={snapshotUrl}
              alt={`Snapshot P${no}`}
              style={{ width: "100%", height: "auto", display: "block", objectFit: "cover", aspectRatio: "4/3" }}
            />
            <span style={{ fontSize: 10, display: "block", textAlign: "center", background: "var(--surface-warm)", color: "var(--muted)", padding: "2px 0" }}>
              Webcam P{no}
            </span>
          </div>
        ) : (
          <div style={{ flexShrink: 0, width: 44, height: 44, display: "grid", placeItems: "center", background: "var(--surface-warm)", border: "1px solid var(--line)", borderRadius: 4 }}>
            <User size={20} color="var(--muted)" />
          </div>
        )}

        <div style={{ flex: 1, minWidth: 0 }}>
          <p className={app.ask}>
            <span className={app.who}>AI · P{no}</span>
            {question}
          </p>
          <p className={app.answer}>
            <span className={app.who}>Kandidat · {duration}</span>
            {answer}
          </p>

          {audioUrl && (
            <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 8 }}>
              <SpeakerHigh size={18} color="var(--ink)" />
              <audio controls src={audioUrl} style={{ height: 32, maxWidth: 300 }} />
            </div>
          )}
        </div>
      </div>
    </li>
  );
}
