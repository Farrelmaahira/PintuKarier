import { ReadinessHistoryEntry } from "@/lib/data/readiness/types";
import { ChartLineUp } from "@phosphor-icons/react";
import dashboard from "@/styles/dashboard.module.css";
import ui from "@/styles/ui.module.css";

export interface ReadinessHistoryTimelineProps {
  history: ReadinessHistoryEntry[];
}

export function ReadinessHistoryTimeline({ history }: ReadinessHistoryTimelineProps) {
  return (
    <div className={ui.card}>
      <div className={dashboard.cardHeaderRow}>
        <div>
          <h2 className={ui.cardTitle}>Riwayat Progres & Peningkatan Kesiapan</h2>
          <span className={ui.cardSub}>
            Pintu Karier mencatat setiap latihan kuis, evaluasi seleksi, dan simulasi wawancara untuk memperbarui skor Anda.
          </span>
        </div>
        <ChartLineUp size={22} color="var(--accent)" aria-hidden />
      </div>

      <div className={dashboard.timelineContainer}>
        {history.map((entry, index) => (
          <div key={entry.eventName + index} className={dashboard.timelineItem}>
            <div className={dashboard.timelineMarker}>
              <div className={dashboard.timelineDot} />
              {index < history.length - 1 && <div className={dashboard.timelineLine} />}
            </div>

            <div className={dashboard.timelineBody}>
              <div className={dashboard.timelineMetaRow}>
                <span className={dashboard.timelineDate}>{entry.date}</span>
                <div className={dashboard.timelineScorePill}>
                  <span className={dashboard.timelineScoreVal}>{entry.score.toFixed(1)}</span>
                  {entry.change > 0 && (
                    <span className={dashboard.timelineGain}>+{entry.change.toFixed(1)} Poin</span>
                  )}
                </div>
              </div>

              <h3 className={dashboard.timelineTitle}>{entry.eventName}</h3>
              <p className={dashboard.timelineDesc}>{entry.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
