import { ReadinessHistoryEntry } from "@/lib/data/readiness/types";
import { Badge } from "../atoms/Badge";
import { EmptyState } from "../molecules/EmptyState";
import { Panel } from "../molecules/Panel";
import { ScoreCell } from "../molecules/ScoreCell";
import rows from "@/styles/rows.module.css";
import app from "@/styles/app.module.css";

export interface ReadinessHistoryTimelineProps {
  history: ReadinessHistoryEntry[];
}

export function ReadinessHistoryTimeline({ history }: ReadinessHistoryTimelineProps) {
  const sorted = [...history].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <Panel title="Riwayat Progres Kesiapan" tag="Terbaru di atas" flush>
      {sorted.length === 0 ? (
        <EmptyState title="Belum ada riwayat">Skor kamu akan tercatat di sini setelah drill atau wawancara pertama.</EmptyState>
      ) : (
        <ul className={rows.list}>
          {sorted.map((entry, index) => (
            <li key={entry.eventName + index} className={rows.row}>
              <div className={rows.main}>
                <div className={rows.top}>
                  <strong>{entry.eventName}</strong>
                  {entry.change > 0 && <Badge tone="green">+{entry.change} Poin</Badge>}
                </div>
                <p className={app.meta}>{entry.description}</p>
                <time className={app.meta} dateTime={entry.date}>
                  {new Date(entry.date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                </time>
              </div>
              <ScoreCell value={entry.score.toFixed(1)} label="Skor" />
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}
