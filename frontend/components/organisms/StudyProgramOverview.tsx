import { BookOpen, Buildings, ChartBar, GraduationCap } from "@phosphor-icons/react/dist/ssr";
import { Badge } from "../atoms/Badge";
import { Callout } from "../molecules/Callout";
import { GapSummaryList } from "../molecules/GapSummaryList";
import { Notice } from "../molecules/Notice";
import { OverviewModuleCard } from "../molecules/OverviewModuleCard";
import { Panel } from "../molecules/Panel";
import { Stat } from "../molecules/Stat";
import { StatGrid } from "../molecules/StatGrid";
import { ActiveFollowUpPanel } from "./ActiveFollowUpPanel";
import { IKU_METRICS } from "@/lib/data/studyProgram/industry";
import { PERIODS } from "@/lib/data/studyProgram/info";
import { PERIOD_SUMMARY, RANKING } from "@/lib/data/studyProgram/ranking";
import app from "@/styles/app.module.css";

/** Dasbor utama Prodi: metrik eksekutif, tiga modul, dan tindak lanjut aktif. */
export function StudyProgramOverview() {
  const currentPeriod = PERIODS[0]!;
  const summary = PERIOD_SUMMARY[currentPeriod]!;
  const topGaps = RANKING[currentPeriod]!["Semua posisi"]!.items.slice(0, 3);

  return (
    <div className={app.stack}>
      <Notice tone="success">
        Data {currentPeriod} sudah disinkronkan: {summary.feedback} feedback siap dipakai untuk perbaikan kurikulum.
      </Notice>
      <Panel flush>
        <StatGrid cols={4}>
          <Stat label="Lulusan dianalisis" value="214 Mahasiswa" />
          <Stat label="Serapan kerja" value={`${IKU_METRICS.graduatesAbsorbed} / Target 85%`} />
          <Stat label="Masa tunggu" value={IKU_METRICS.currentWaitTime} />
          <Stat label="Mitra perekrut" value={`${summary.partners} Perusahaan`} />
        </StatGrid>
      </Panel>
      <div className={app.jobGrid}>
        <OverviewModuleCard
          icon={<GraduationCap size={24} color="var(--ink)" />}
          title="Data Mahasiswa"
          badge={<Badge tone="green">Audit Bukti Aktif</Badge>}
          description="Cek CV dan sertifikat mahasiswa, lalu beri validasi prodi."
          href="/prodi/mahasiswa"
          cta="Buka Daftar"
        >
          <Callout tone="plain" title="Integrasi">
            Verifikasi prodi memberi centang biru pada kandidat di dashboard HRD.
          </Callout>
        </OverviewModuleCard>
        <OverviewModuleCard
          icon={<ChartBar size={24} color="var(--ink)" />}
          title="Analisis Kompetensi"
          badge={<Badge tone="orange">Defisit Kritis</Badge>}
          description="3 kompetensi dengan keguguran tertinggi periode ini."
          href="/prodi/kompetensi"
          cta="Buka Analisis"
        >
          <GapSummaryList gaps={topGaps} />
        </OverviewModuleCard>
        <OverviewModuleCard
          icon={<BookOpen size={24} color="var(--ink)" />}
          title="Rekomendasi RPS & PBL"
          badge={<Badge tone="accent">3 Usulan AI</Badge>}
          description="AI mengubah alasan gugur jadi modul praktikum dan proyek."
          href="/prodi/kurikulum"
          cta="Tinjau Usulan"
        >
          <Callout tone="plain" title="Fokus Perbaikan">
            Testing Otomatis (Jest/Playwright) & SQL Window Functions.
          </Callout>
        </OverviewModuleCard>
        <OverviewModuleCard
          icon={<Buildings size={24} color="var(--ink)" />}
          title="Kebutuhan Industri & IKU"
          badge={<Badge tone="green">IKU 1 Capaian</Badge>}
          description="Pantau teknologi yang dicari mitra dan unduh Berita Acara."
          href="/prodi/industri"
          cta="Lihat Tren"
        >
          <div className={app.jobCardCount}>
            <span>Proyeksi tunggu lulusan</span>
            <span className="num">{IKU_METRICS.projectedWaitTime}</span>
          </div>
        </OverviewModuleCard>
      </div>
      <ActiveFollowUpPanel />
    </div>
  );
}
