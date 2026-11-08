import Link from "next/link";
import { ArrowUpRight, Buildings, ChartBar } from "@phosphor-icons/react";
import { AdminOverviewStats } from "@/lib/data/admin/types";
import { AdminStatsCards } from "./AdminStatsCards";
import { Badge } from "../atoms/Badge";
import { Button } from "../atoms/Button";
import { Meter } from "../atoms/Meter";
import { Panel } from "../molecules/Panel";
import { Tag } from "../atoms/Tag";
import rows from "@/styles/rows.module.css";
import shell from "@/styles/shell.module.css";
import app from "@/styles/app.module.css";
import dashboard from "@/styles/dashboard.module.css";

export interface AdminOverviewProps {
  overview: AdminOverviewStats;
}

export function AdminOverview({ overview }: AdminOverviewProps) {
  const depts = overview.departmentSummaries ?? [];

  return (
    <div className={shell.stack}>
      <AdminStatsCards overview={overview} />

      <div className={shell.split}>
        <div className={shell.stack}>
          <Panel
            title="Kesiapan per Jurusan"
            flush
            actions={
              <Link href="/admin/jurusan" className={app.backInline}>
                Semua jurusan <ArrowUpRight size={14} />
              </Link>
            }
          >
            <ul className={rows.list}>
              {depts.map((dept) => (
                <li key={dept.departmentCode} className={`${rows.row} ${dashboard.rowThree}`}>
                  <Tag>{dept.departmentCode}</Tag>
                  <div className={rows.main}>
                    <strong className={dashboard.cellStrong}>{dept.departmentName || dept.departmentCode}</strong>
                    <span className={app.meta}>
                      {dept.totalStudents.toLocaleString("id-ID")} Mahasiswa · {dept.totalApplicants} Pelamar Aktif
                    </span>
                    <Meter value={dept.readinessLevel} label={`Kesiapan ${dept.departmentName || dept.departmentCode}`} tone="var(--accent)" />
                  </div>
                  <div className={dashboard.rateCell}>
                    <span className={dashboard.slaValue}>{dept.readinessLevel.toFixed(1)}</span>
                    <span className={app.meta}>Skor</span>
                  </div>
                </li>
              ))}
            </ul>
          </Panel>
        </div>

        <div className={shell.stack}>
          <Panel title="SLA Feedback">
            <p className={app.note}>
              Setiap kandidat berhak menerima alasan penolakan dan bukti objektif.
            </p>

            <div className={dashboard.slaCard}>
              <div>
                <span className={dashboard.slaBig}>{overview.feedbackRate.toFixed(1)}%</span>
                <span className={app.meta}>Feedback terkirim</span>
              </div>
              <div className={dashboard.rateCell}>
                <Badge tone={overview.feedbackRate >= 95 ? "green" : "orange"}>{overview.feedbackRate >= 95 ? "Tercapai" : "Di Bawah Target"}</Badge>
                <span className={app.meta}>Target Minimum: 95%</span>
              </div>
            </div>

            <Button
              href="/admin/mitra"
              block
              icon={<Buildings size={18} />}
            >
              Audit Kemitraan Industri
            </Button>
          </Panel>

          <Panel title="Kurikulum & Industri">
            <p className={app.note}>Kesenjangan dari mitra dikirim ke Dasbor Prodi untuk pembaruan RPS.</p>
            <Button href="/admin/jurusan" icon={<ChartBar size={16} />}>
              Lihat Kesenjangan Skill
            </Button>
          </Panel>
        </div>
      </div>
    </div>
  );
}
