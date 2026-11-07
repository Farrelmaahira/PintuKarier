import { BookOpen, Buildings, ChartBar, GraduationCap } from "@phosphor-icons/react/dist/ssr";
import { Badge } from "../atoms/Badge";
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

const MODULE_GRID = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 20 } as const;
const HIGHLIGHT_BOX = { padding: 10, background: "var(--surface-warm)", fontSize: 13 } as const;

/** Dasbor utama Prodi: metrik eksekutif, tiga modul, dan tindak lanjut aktif. */
export function StudyProgramOverview() {
  const currentPeriod = PERIODS[0]!;
  const summary = PERIOD_SUMMARY[currentPeriod]!;
  const topGaps = RANKING[currentPeriod]!["Semua posisi"]!.items.slice(0, 3);

  return (
    <div className={app.stack} style={{ gap: 28 }}>
      <Notice tone="success">
        Data Rekrutmen {currentPeriod} telah disinkronkan. {summary.feedback} feedback kualitatif berhasil diagregasi untuk perbaikan kurikulum prodi.
      </Notice>
      <Panel flush>
        <StatGrid cols={4}>
          <Stat label="Total Lulusan Dianalisis" value="214 Mahasiswa" />
          <Stat label="Tingkat Serapan Kerja" value={`${IKU_METRICS.graduatesAbsorbed} / Target 85%`} />
          <Stat label="Masa Tunggu Rata-rata" value={IKU_METRICS.currentWaitTime} />
          <Stat label="Mitra Perekrut Terhubung" value={`${summary.partners} Perusahaan`} />
        </StatGrid>
      </Panel>
      <div style={MODULE_GRID}>
        <OverviewModuleCard
          icon={<GraduationCap size={24} color="var(--ink)" />}
          title="Data Mahasiswa & Portofolio"
          badge={<Badge tone="green">Audit Bukti Aktif</Badge>}
          description="Crosscheck CV dan sertifikasi yang diunggah mahasiswa. Berikan validasi prodi resmi yang langsung terlihat di dashboard HRD mitra."
          href="/prodi/mahasiswa"
          cta="Buka Daftar Mahasiswa"
        >
          <div style={HIGHLIGHT_BOX}>
            <strong>Integrasi:</strong> Verifikasi prodi otomatis menyematkan lencana centang biru terverifikasi pada kandidat di dashboard HRD.
          </div>
        </OverviewModuleCard>
        <OverviewModuleCard
          icon={<ChartBar size={24} color="var(--ink)" />}
          title="Analisis Kompetensi"
          badge={<Badge tone="orange">Defisit Kritis</Badge>}
          description="3 kompetensi dengan tingkat keguguran tertinggi di rekrutmen periode ini:"
          href="/prodi/kompetensi"
          cta="Buka Analisis Detail"
        >
          <GapSummaryList gaps={topGaps} />
        </OverviewModuleCard>
        <OverviewModuleCard
          icon={<BookOpen size={24} color="var(--ink)" />}
          title="Rekomendasi RPS & PBL"
          badge={<Badge tone="accent">3 Usulan AI</Badge>}
          description="AI mengonversi alasan gugur mahasiswa menjadi modul praktikum dan tugas proyek nyata di mata kuliah semester depan."
          href="/prodi/kurikulum"
          cta="Tinjau Silabus & Modul"
        >
          <div style={HIGHLIGHT_BOX}>
            <strong>Fokus Perbaikan:</strong> Testing Otomatis (Jest/Playwright) & SQL Window Functions.
          </div>
        </OverviewModuleCard>
        <OverviewModuleCard
          icon={<Buildings size={24} color="var(--ink)" />}
          title="Kebutuhan Industri & IKU"
          badge={<Badge tone="green">IKU 1 Capaian</Badge>}
          description="Pantau frekuensi kebutuhan teknologi mitra dan unduh dokumen Berita Acara untuk akreditasi LAM-INFOKOM."
          href="/prodi/industri"
          cta="Lihat Tren & Cetak Laporan"
        >
          <div style={{ ...HIGHLIGHT_BOX, display: "flex", justifyContent: "space-between" }}>
            <span>Proyeksi Tunggu Lulusan:</span>
            <strong style={{ color: "var(--cat-green)" }}>{IKU_METRICS.projectedWaitTime}</strong>
          </div>
        </OverviewModuleCard>
      </div>
      <ActiveFollowUpPanel />
    </div>
  );
}
