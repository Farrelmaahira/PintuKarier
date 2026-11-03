import { Badge } from "../atoms/Badge";
import { ReadinessProfile } from "@/lib/data/readiness/types";
import { Briefcase, ChartLineUp, CheckCircle, Target } from "@phosphor-icons/react";
import dashboard from "@/styles/dashboard.module.css";
import ui from "@/styles/ui.module.css";

export interface ReadinessScoreOverviewProps {
  profile: ReadinessProfile;
}

export function ReadinessScoreOverview({ profile }: ReadinessScoreOverviewProps) {
  const categoryTone =
    profile.overallScore >= 80
      ? "var(--cat-green)"
      : profile.overallScore >= 65
      ? "var(--cat-yellow)"
      : "var(--cat-orange)";

  return (
    <div className={dashboard.readinessHeroCard}>
      <div className={dashboard.readinessHeroLeft}>
        <div className={dashboard.targetHeader}>
          <Target size={20} color="var(--accent)" aria-hidden />
          <span className={dashboard.targetLabel}>Posisi Sasaran Karier</span>
        </div>
        <h2 className={dashboard.targetTitle}>{profile.targetPosition}</h2>
        <p className={dashboard.targetDesc}>
          Skor kesiapan dihitung dinamis dari bukti nyata proyek PBL, magang industri, jawaban wawancara AI, dan latihan mandiri.
        </p>

        <div className={dashboard.targetMetaRow}>
          <div className={dashboard.targetMetaItem}>
            <Briefcase size={16} aria-hidden />
            <span>Standar Industri Vokasi</span>
          </div>
          <div className={dashboard.targetMetaItem}>
            <CheckCircle size={16} aria-hidden />
            <span>5 Dimensi Penilaian Berbobot</span>
          </div>
        </div>
      </div>

      <div className={dashboard.readinessScoreBox}>
        <span className={dashboard.scoreBadgeTitle}>Indeks Kesiapan Kerja</span>
        <div className={dashboard.largeScoreDisplay}>
          <span className={dashboard.scoreNumBig}>{profile.overallScore.toFixed(1)}</span>
          <span className={dashboard.scoreScale}>/100</span>
        </div>

        <Badge tone={categoryTone}>{profile.overallCategory}</Badge>

        <span className={dashboard.scoreNotice}>
          Ambang minimum rekrutmen: 80.0
        </span>
      </div>
    </div>
  );
}
