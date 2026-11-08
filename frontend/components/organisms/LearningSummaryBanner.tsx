import { Badge } from "../atoms/Badge";
import { Panel } from "../molecules/Panel";
import { Stat } from "../molecules/Stat";
import { StatGrid } from "../molecules/StatGrid";
import ui from "@/styles/ui.module.css";

export interface LearningSummaryBannerProps {
  totalModules: number;
  completedModules: number;
  inProgressModules: number;
  totalScoreBoost: number;
  recommendedCategory: string;
}

export function LearningSummaryBanner({ totalModules, completedModules, inProgressModules, totalScoreBoost, recommendedCategory }: LearningSummaryBannerProps) {
  return (
    <Panel title="Rekomendasi Berbasis AI Feedback" tag="Ringkasan Belajar" flush>
      <StatGrid cols={4}>
        <Stat label="Total modul tersedia" value={`${totalModules} Modul`} />
        <Stat label="Modul selesai" value={`${completedModules}/${totalModules}`} />
        <Stat label="Sedang berjalan" value={`${inProgressModules} Modul`} />
        <Stat label="Potensi kenaikan skor" value={`+${totalScoreBoost} Poin`} />
      </StatGrid>

      <div className={`${ui.panelToolbar} ${ui.noteStrip}`}>
        <span>Modul materi terkurasi dan studi kasus industri (Drill Scenario) untuk menaikkan skor kesiapan kerja kamu secara langsung.</span>
        <span>
          Fokus utama: <Badge tone="accent">{recommendedCategory}</Badge>
        </span>
      </div>
    </Panel>
  );
}

export default LearningSummaryBanner;
