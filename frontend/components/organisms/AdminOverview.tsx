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
import ui from "@/styles/ui.module.css";
import app from "@/styles/app.module.css";

export interface AdminOverviewProps {
  overview: AdminOverviewStats;
}

export function AdminOverview({ overview }: AdminOverviewProps) {
  const depts = overview.departmentSummaries ?? [];

  return (
    <div className={shell.stack} style={{ gap: "24px" }}>
      <AdminStatsCards overview={overview} />

      <div className={shell.split}>
        <div className={shell.stack}>
          <Panel
            title="Distribusi 7 Jurusan Vokasi"
            tag="Tingkat Kesiapan Kerja"
            flush
            actions={
              <Link href="/admin/jurusan" className={app.back} style={{ marginBottom: 0 }}>
                Detail 7 Jurusan <ArrowUpRight size={14} />
              </Link>
            }
          >
            <ul className={rows.list}>
              {depts.map((dept) => (
                <li key={dept.departmentCode} className={rows.row} style={{ gridTemplateColumns: "auto 1fr auto" }}>
                  <Tag>{dept.departmentCode}</Tag>
                  <div className={rows.main} style={{ gap: "4px" }}>
                    <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
                      <strong style={{ fontSize: "15px", letterSpacing: "-0.02em" }}>
                        {dept.departmentName || dept.departmentCode}
                      </strong>
                    </div>
                    <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                      {dept.totalStudents.toLocaleString("id-ID")} Mahasiswa · {dept.totalApplicants} Pelamar Aktif
                    </span>
                    <Meter
                      value={dept.readinessLevel}
                      label={`Kesiapan ${dept.departmentName || dept.departmentCode}`}
                      tone="var(--accent)"
                    />
                  </div>
                  <div style={{ textAlign: "right", minWidth: "50px" }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: "16px" }}>
                      {dept.readinessLevel.toFixed(1)}
                    </span>
                    <span style={{ fontSize: "11px", color: "var(--text-muted)", display: "block" }}>Skor</span>
                  </div>
                </li>
              ))}
            </ul>
          </Panel>
        </div>

        <div className={shell.stack}>
          <Panel title="Komitmen SLA Feedback" tag="Standar Layanan">
            <p className={app.note}>
              Setiap kandidat dari PNJ berhak menerima alasan penolakan dan bukti objektif yang dapat dikonversi ke jalur belajar.
            </p>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "16px",
                border: "var(--border)",
                background: "var(--surface-warm)",
              }}
            >
              <div>
                <span style={{ fontSize: "32px", fontWeight: 700, fontFamily: "var(--font-mono)", letterSpacing: "-0.04em", display: "block" }}>
                  {overview.feedbackRate.toFixed(1)}%
                </span>
                <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>Feedback Terkirim Mitra</span>
              </div>
              <div style={{ textAlign: "right" }}>
                {overview.feedbackRate >= 95 ? (
                  <Badge tone="green">Tercapai</Badge>
                ) : (
                  <Badge tone="orange">Di Bawah Target</Badge>
                )}
                <span style={{ display: "block", fontSize: "11px", color: "var(--text-muted)", marginTop: "4px" }}>
                  Target Minimum: 95%
                </span>
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

          <Panel title="Harmonisasi Kurikulum & Industri" tag="Inisiatif Kampus Merdeka">
            <div>
              <p className={app.note} style={{ marginBottom: "14px" }}>
                Data kesenjangan dari mitra langsung dialirkan ke Dasbor Prodi untuk pembaruan RPS dan modul PBL tiap semester.
              </p>
              <Button
                href="/admin/jurusan"
                icon={<ChartBar size={16} />}
              >
                Lihat Kesenjangan Skill
              </Button>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
