import { AdminOverviewStats } from "@/lib/data/admin/types";
import { Buildings, CheckCircle, GraduationCap, Users } from "@phosphor-icons/react";
import dashboard from "@/styles/dashboard.module.css";
import ui from "@/styles/ui.module.css";

export interface AdminStatsCardsProps {
  overview: AdminOverviewStats;
}

export function AdminStatsCards({ overview }: AdminStatsCardsProps) {
  return (
    <div className={dashboard.statsGrid}>
      <div className={ui.card}>
        <div className={dashboard.statIcon}>
          <GraduationCap size={24} aria-hidden />
        </div>
        <div>
          <span className={ui.cardSub}>Mahasiswa Aktif PNJ</span>
          <div className={ui.statVal}>{overview.totalStudents.toLocaleString("id-ID")}</div>
          <span className={dashboard.statMeta}>7 Jurusan Vokasi</span>
        </div>
      </div>

      <div className={ui.card}>
        <div className={dashboard.statIcon}>
          <Buildings size={24} aria-hidden />
        </div>
        <div>
          <span className={ui.cardSub}>Mitra Industri Aktif</span>
          <div className={ui.statVal}>{overview.totalPartners}</div>
          <span className={dashboard.statMeta}>{overview.totalVacancies} Lowongan Terbuka</span>
        </div>
      </div>

      <div className={ui.card}>
        <div className={dashboard.statIcon}>
          <Users size={24} aria-hidden />
        </div>
        <div>
          <span className={ui.cardSub}>Total Lamaran Masuk</span>
          <div className={ui.statVal}>{overview.totalApplications.toLocaleString("id-ID")}</div>
          <span className={dashboard.statMeta}>Periode Gasal 2026/2027</span>
        </div>
      </div>

      <div className={ui.card}>
        <div className={dashboard.statIcon}>
          <CheckCircle size={24} aria-hidden />
        </div>
        <div>
          <span className={ui.cardSub}>SLA Feedback Mitra</span>
          <div className={ui.statVal}>{overview.feedbackRate.toFixed(1)}%</div>
          <span className={dashboard.statMeta}>Target Kampus: 100%</span>
        </div>
      </div>
    </div>
  );
}
