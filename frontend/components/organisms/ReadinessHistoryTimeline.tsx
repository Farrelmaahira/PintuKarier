import { ReadinessHistoryEntry } from "@/lib/data/readiness/types";
import { Badge } from "../atoms/Badge";
import { Panel } from "../molecules/Panel";
import rows from "@/styles/rows.module.css";

export interface ReadinessHistoryTimelineProps {
  history: ReadinessHistoryEntry[];
}

export function ReadinessHistoryTimeline({ history }: ReadinessHistoryTimelineProps) {
  return (
    <Panel
      title="Riwayat Progres & Peningkatan Kesiapan"
      tag="Histori Evaluasi"
      flush
    >
      <ul className={rows.list}>
        {history.map((entry, index) => (
          <li key={entry.eventName + index} className={rows.row} style={{ gridTemplateColumns: "1fr auto" }}>
            <div className={rows.main} style={{ gap: "4px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <strong style={{ fontSize: "15px" }}>{entry.eventName}</strong>
                {entry.change > 0 && (
                  <Badge tone="green">+{entry.change} Poin</Badge>
                )}
              </div>
              <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: 0 }}>
                {entry.description}
              </p>
              <span style={{ fontSize: "11px", fontFamily: "var(--font-mono)", color: "var(--text-subtle)" }}>
                {new Date(entry.date).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>

            <div style={{ textAlign: "right", minWidth: "60px" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: "18px" }}>
                {entry.score.toFixed(1)}
              </span>
              <span style={{ display: "block", fontSize: "11px", color: "var(--text-muted)" }}>Skor</span>
            </div>
          </li>
        ))}
      </ul>
    </Panel>
  );
}
