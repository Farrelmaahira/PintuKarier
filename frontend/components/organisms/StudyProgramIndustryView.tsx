"use client";

import { useState } from "react";
import { DownloadSimple } from "@phosphor-icons/react";
import { Button } from "../atoms/Button";
import { Meter } from "../atoms/Meter";
import { KeyValue } from "../molecules/KeyValue";
import { Notice } from "../molecules/Notice";
import { Panel } from "../molecules/Panel";
import { ScoreCell } from "../molecules/ScoreCell";
import { Stat } from "../molecules/Stat";
import { StatGrid } from "../molecules/StatGrid";
import { INDUSTRY_NEEDS, IKU_METRICS } from "@/lib/data/studyProgram/industry";
import app from "@/styles/app.module.css";
import rows from "@/styles/rows.module.css";
import shell from "@/styles/shell.module.css";

export function StudyProgramIndustryView() {
  const [notice, setNotice] = useState(false);

  return (
    <div className={shell.stack}>
      <Panel title="Proyeksi Capaian IKU 1 (Serapan Kerja Cepat)" flush>
        <StatGrid cols={4}>
          <Stat label="Masa tunggu kerja saat ini" value={IKU_METRICS.currentWaitTime} />
          <Stat label="Target masa tunggu pasca-RPS" value={IKU_METRICS.projectedWaitTime} />
          <Stat label="Tingkat serapan lulusan" value={`${IKU_METRICS.graduatesAbsorbed} / ${IKU_METRICS.iku1Target}`} />
          <Stat label="Mitra perekrut aktif" value={`${IKU_METRICS.activePartners} Perusahaan`} />
        </StatGrid>
      </Panel>

      <div className={shell.split}>
        <Panel title="Tech Stack Paling Banyak Disyaratkan Mitra" tag="14 Mitra Perekrut" flush>
          <ul className={rows.list}>
            {INDUSTRY_NEEDS.map((item) => (
              <li key={item.tech} className={rows.row}>
                <div className={rows.main}>
                  <div className={rows.top}>
                    <strong>{item.tech}</strong>
                    <span className={app.meta}>{item.category}</span>
                  </div>
                  <Meter value={item.percent} label={item.tech} tone={item.tone} />
                </div>
                <ScoreCell value={`${item.percent}%`} label={`${item.partnersHiring} mitra`} />
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Dokumen Audit & Akreditasi Prodi">
          <p className={app.note}>Unduh rangkuman evaluasi kompetensi lulusan berbasis data industri untuk lampiran LED Akreditasi LAM-INFOKOM & Laporan SPMI.</p>
          <KeyValue
            items={[
              ["Status rekomendasi", "3 Modul Siap Diintegrasikan"],
              ["Keterlibatan dosen pengampu", "100% Terkonfirmasi"],
            ]}
          />
          {notice && <Notice tone="info">Unduhan PDF Berita Acara belum tersedia di versi demo ini.</Notice>}
          <Button onClick={() => setNotice(true)} icon={<DownloadSimple size={20} />}>
            Unduh Berita Acara Rapat Kurikulum (PDF)
          </Button>
        </Panel>
      </div>
    </div>
  );
}
