import { Panel } from "../molecules/Panel";
import { Stat } from "../molecules/Stat";
import { StatGrid } from "../molecules/StatGrid";

export interface LearningSummaryBannerProps {
  totalModules: number;
  completedModules: number;
  inProgressModules: number;
  totalScoreBoost: number;
  recommendedCategory: string;
}

export function LearningSummaryBanner({
  totalModules,
  completedModules,
  inProgressModules,
  totalScoreBoost,
  recommendedCategory,
}: LearningSummaryBannerProps) {
  return (
    <Panel title="Rekomendasi Berbasis AI Feedback" tag="Ringkasan Belajar" flush>
      <StatGrid cols={4}>
        <Stat label="Total Modul Tersedia" value={`${totalModules} Modul`} />
        <Stat label="Modul Selesai" value={`${completedModules}/${totalModules}`} />
        <Stat label="Sedang Berjalan" value={`${inProgressModules} Modul`} />
        <Stat label="Potensi Kenaikan Skor" value={`+${totalScoreBoost} Poin`} />
      </StatGrid>

      <div
        style={{
          padding: "12px 20px",
          borderTop: "var(--border)",
          background: "var(--surface-warm)",
          fontSize: "13px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "8px",
        }}
      >
        <span>
          Modul materi terkurasi dan studi kasus industri (*Drill Scenario*) untuk menaikkan skor kesiapan kerja kamu secara langsung.
        </span>
        <span style={{ fontSize: "12px", color: "var(--ink)", fontWeight: 600 }}>
          Fokus Utama: <span style={{ color: "var(--accent)" }}>{recommendedCategory}</span>
        </span>
      </div>
    </Panel>
  );
}

export default LearningSummaryBanner;
