import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Buildings, ChartBar, CheckCircle } from "@phosphor-icons/react";
import { AdminOverviewStats } from "@/lib/data/admin/types";
import { AdminStatsCards } from "./AdminStatsCards";
import { Badge } from "../atoms/Badge";
import dashboard from "@/styles/dashboard.module.css";
import ui from "@/styles/ui.module.css";
import landing from "@/styles/landing.module.css";

export interface AdminOverviewProps {
  overview: AdminOverviewStats;
}

export function AdminOverview({ overview }: AdminOverviewProps) {
  return (
    <div className={dashboard.viewStack}>
      <header className={dashboard.pageHeader}>
        <div>
          <Badge tone="var(--accent)">Pusat Karier Politeknik Negeri Jakarta</Badge>
          <h1 className={dashboard.pageTitle}>Dasbor Eksekutif Kampus</h1>
          <p className={dashboard.pageDesc}>
            Pengawasan makro serapan kerja, kesiapan kompetensi lulusan, dan kepatuhan feedback industri di seluruh 7 jurusan PNJ.
          </p>
        </div>
      </header>

      <AdminStatsCards overview={overview} />

      <div className={dashboard.gridSplit}>
        <div className={ui.card}>
          <div className={dashboard.cardHeaderRow}>
            <div>
              <h2 className={ui.cardTitle}>Distribusi 7 Jurusan Vokasi</h2>
              <span className={ui.cardSub}>Tingkat kesiapan kerja rata-rata per bidang</span>
            </div>
            <Link href="/admin/jurusan" className={dashboard.textLink}>
              Detail 7 Jurusan <ArrowUpRight size={16} aria-hidden />
            </Link>
          </div>

          <div className={dashboard.deptList}>
            {overview.departmentSummaries.map((dept) => (
              <div key={dept.departmentCode} className={dashboard.deptItem}>
                <div className={dashboard.deptInfo}>
                  <span className={dashboard.deptCode}>{dept.departmentCode}</span>
                  <div>
                    <h3 className={dashboard.deptName}>{dept.departmentName}</h3>
                    <span className={dashboard.deptMeta}>
                      {dept.totalStudents.toLocaleString("id-ID")} Mahasiswa · {dept.totalApplicants} Pelamar Aktif
                    </span>
                  </div>
                </div>

                <div className={dashboard.deptScoreArea}>
                  <div className={dashboard.scoreBarWrap}>
                    <div
                      className={dashboard.scoreBarFill}
                      style={{ width: `${dept.readinessLevel}%` }}
                    />
                  </div>
                  <span className={dashboard.scoreText}>{dept.readinessLevel.toFixed(1)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={dashboard.sideStack}>
          <div className={ui.card}>
            <div className={dashboard.cardHeaderRow}>
              <div>
                <h2 className={ui.cardTitle}>Komitmen SLA Feedback</h2>
                <span className={ui.cardSub}>Standar layanan penolakan berbasis edukasi</span>
              </div>
              <CheckCircle size={20} color="var(--accent)" aria-hidden />
            </div>

            <p className={dashboard.noticeText}>
              Setiap kandidat dari PNJ berhak menerima alasan penolakan dan bukti objektif yang dapat dikonversi ke jalur belajar.
            </p>

            <div className={dashboard.slaBox}>
              <div className={dashboard.slaMetric}>
                <span className={dashboard.slaNumber}>{overview.feedbackRate.toFixed(1)}%</span>
                <span className={dashboard.slaLabel}>Feedback Terkirim</span>
              </div>
              <div className={dashboard.slaStatus}>
                <Badge tone="var(--cat-green)">Tercapai</Badge>
                <span className={dashboard.slaSub}>Target minimum institusi: 95%</span>
              </div>
            </div>

            <div className={dashboard.actionRow}>
              <Link href="/admin/mitra" className={ui.btn}>
                <Buildings size={18} aria-hidden />
                Audit Kemitraan Industri
              </Link>
            </div>
          </div>

          <div className={`${ui.card} ${dashboard.bannerCard}`}>
            <div className={dashboard.bannerContent}>
              <span className={dashboard.bannerTag}>Inisiatif Kampus Merdeka</span>
              <h3 className={dashboard.bannerTitle}>Harmonisasi Kurikulum & Industri</h3>
              <p className={dashboard.bannerDesc}>
                Data kesenjangan dari mitra langsung dialirkan ke Dasbor Prodi untuk pembaruan RPS dan modul PBL tiap semester.
              </p>
              <Link href="/admin/jurusan" className={dashboard.bannerBtn}>
                <ChartBar size={18} aria-hidden />
                Lihat Kesenjangan Skill
              </Link>
            </div>
            <div className={dashboard.bannerIllu}>
              <Image
                src="/illustrations/data-prodi.webp"
                alt="Harmonisasi Kurikulum PNJ"
                width={120}
                height={120}
                className={landing.bannerImg}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
