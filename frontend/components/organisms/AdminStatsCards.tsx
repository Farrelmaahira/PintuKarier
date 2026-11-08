import { AdminOverviewStats } from "@/lib/data/admin/types";
import { Panel } from "../molecules/Panel";
import { Stat } from "../molecules/Stat";
import { StatGrid } from "../molecules/StatGrid";

export interface AdminStatsCardsProps {
  overview: AdminOverviewStats;
}

export function AdminStatsCards({ overview }: AdminStatsCardsProps) {
  return (
    <Panel flush>
      <StatGrid cols={4}>
        <Stat
          label="Mahasiswa aktif"
          value={overview.totalStudents.toLocaleString("id-ID")}
        />
        <Stat
          label="Mitra aktif"
          value={`${overview.totalPartners} Mitra`}
        />
        <Stat
          label="Lamaran masuk"
          value={overview.totalApplications.toLocaleString("id-ID")}
        />
        <Stat
          label="SLA feedback"
          value={`${overview.feedbackRate.toFixed(1)}%`}
        />
      </StatGrid>
    </Panel>
  );
}
