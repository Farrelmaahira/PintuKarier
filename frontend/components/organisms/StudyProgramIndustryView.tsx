"use client";

import { DownloadSimple } from "@phosphor-icons/react";
import { Button } from "../atoms/Button";
import { Meter } from "../atoms/Meter";
import { Panel } from "../molecules/Panel";
import { Stat } from "../molecules/Stat";
import { StatGrid } from "../molecules/StatGrid";
import { INDUSTRY_NEEDS, IKU_METRICS } from "@/lib/data/studyProgram/industry";
import shell from "@/styles/shell.module.css";
import app from "@/styles/app.module.css";

export function StudyProgramIndustryView() {
  return (
    <div className={app.stack} style={{ gap: 24 }}>
      {/* Tracker IKU 1 & Serapan */}
      <Panel title="Proyeksi Capaian IKU 1 (Serapan Kerja Cepat)">
        <StatGrid cols={4}>
          <Stat label="Masa Tunggu Kerja Saat Ini" value={IKU_METRICS.currentWaitTime} />
          <Stat label="Target Masa Tunggu Pasca-RPS" value={IKU_METRICS.projectedWaitTime} />
          <Stat label="Tingkat Serapan Lulusan" value={`${IKU_METRICS.graduatesAbsorbed} / ${IKU_METRICS.iku1Target}`} />
          <Stat label="Mitra Perekrut Aktif" value={`${IKU_METRICS.activePartners} Perusahaan`} />
        </StatGrid>
      </Panel>

      <div className={shell.split}>
        {/* Frekuensi Stack Industri */}
        <Panel title="Tech Stack Paling Banyak Disyaratkan Mitra" tag="14 Mitra Perekrut" flush>
          <ul className={app.list} style={{ padding: 0 }}>
            {INDUSTRY_NEEDS.map((item, idx) => (
              <li
                key={item.tech}
                style={{
                  display: "grid",
                  gridTemplateColumns: "2.5ch minmax(0, 1.4fr) minmax(0, 2fr) auto",
                  alignItems: "center",
                  gap: 16,
                  padding: "16px 20px",
                  borderBottom: "var(--border)",
                }}
              >
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--text-muted)" }}>
                  0{idx + 1}
                </span>
                <div>
                  <strong style={{ fontSize: 15 }}>{item.tech}</strong>
                  <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{item.category}</div>
                </div>
                <div>
                  <Meter value={item.percent} label={item.tech} tone={item.tone} />
                </div>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 500 }}>
                  {item.partnersHiring} mitra ({item.percent}%)
                </span>
              </li>
            ))}
          </ul>
        </Panel>

        {/* Tindak Lanjut SPMI & Dokumen Akreditasi */}
        <Panel title="Dokumen Audit & Akreditasi Prodi">
          <div className={app.stack} style={{ gap: 14 }}>
            <p className={app.note}>
              Unduh rangkuman evaluasi kompetensi lulusan berbasis data industri untuk lampiran LED Akreditasi LAM-INFOKOM & Laporan SPMI.
            </p>

            <div style={{ padding: 14, background: "var(--surface-warm)", border: "var(--border)", display: "grid", gap: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                <span>Status Rekomendasi:</span>
                <strong style={{ color: "var(--cat-green)" }}>3 Modul Siap Diintegrasikan</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                <span>Keterlibatan Dosen Pengampu:</span>
                <strong>100% Terkonfirmasi</strong>
              </div>
            </div>

            <Button
              onClick={() => {
                alert("Berita Acara Rekomendasi Kurikulum berhasil diunduh (Format PDF resmi ber-KOP Politeknik Negeri Jakarta).");
              }}
              icon={<DownloadSimple size={20} />}
            >
              Unduh Berita Acara Rapat Kurikulum (PDF)
            </Button>
          </div>
        </Panel>
      </div>
    </div>
  );
}
