import { Sparkle, GraduationCap, CheckCircle, Flame } from "@phosphor-icons/react";
import dashboard from "@/styles/dashboard.module.css";

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
    <div className={dashboard.learningBanner}>
      <div className={dashboard.bannerLeft}>
        <div className={dashboard.bannerPill}>
          <Sparkle size={14} weight="bold" />
          Rekomendasi Berbasis AI Feedback
        </div>
        <h2 className={dashboard.bannerTitle}>Learning Hub: Tutup Gap Kompetensi Industri</h2>
        <p className={dashboard.bannerDesc}>
          Modul materi terkurasi dan studi kasus industri (*Drill Scenario*) untuk menaikkan skor kesiapan kerja kamu secara langsung.
        </p>

        <div className={dashboard.focusTag}>
          <GraduationCap size={16} weight="bold" />
          Fokus Utama: <strong>{recommendedCategory}</strong>
        </div>
      </div>

      <div className={dashboard.bannerStats}>
        <div className={dashboard.bannerStatBox}>
          <span className={dashboard.bannerStatLabel}>
            <Flame size={14} weight="fill" color="var(--cat-orange)" /> Total Boost Skor
          </span>
          <span className={dashboard.bannerStatNum}>+{totalScoreBoost}</span>
        </div>

        <div className={dashboard.bannerStatBox}>
          <span className={dashboard.bannerStatLabel}>
            <CheckCircle size={14} weight="bold" /> Modul Selesai
          </span>
          <span className={dashboard.bannerStatNum}>
            {completedModules}/{totalModules}
          </span>
        </div>

        <div className={dashboard.bannerStatBox}>
          <span className={dashboard.bannerStatLabel}>Sedang Dikerjakan</span>
          <span className={dashboard.bannerStatNum}>{inProgressModules}</span>
        </div>
      </div>
    </div>
  );
}

export default LearningSummaryBanner;
