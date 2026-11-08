"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Buildings,
  CheckCircle,
  DownloadSimple,
  LightbulbFilament,
} from "@phosphor-icons/react";
import { DepartmentDetailData } from "@/lib/data/admin/departmentDetails";
import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { Meter } from "@/components/atoms/Meter";
import { Tag } from "@/components/atoms/Tag";
import { Callout } from "@/components/molecules/Callout";
import { Panel } from "@/components/molecules/Panel";
import { Stat } from "@/components/molecules/Stat";
import { StatGrid } from "@/components/molecules/StatGrid";
import rows from "@/styles/rows.module.css";
import shell from "@/styles/shell.module.css";
import app from "@/styles/app.module.css";
import dashboard from "@/styles/dashboard.module.css";

export interface DepartmentDetailClientProps {
  dept: DepartmentDetailData;
}

export function DepartmentDetailClient({ dept }: DepartmentDetailClientProps) {
  return (
    <div className={shell.stack}>
      <Link href="/admin/jurusan" className={app.backInline}>
        <ArrowLeft size={16} /> Kembali ke Ringkasan 7 Jurusan
      </Link>

      <Panel title={`Kinerja ${dept.code}`} flush>
        <StatGrid cols={4}>
          <Stat label="Mahasiswa aktif" value={`${dept.totalStudents.toLocaleString("id-ID")} Mhs`} />
          <Stat label="Pelamar aktif" value={`${dept.totalApplicants} Orang`} />
          <Stat label="Serapan kerja" value={`${dept.absorbedPercentage}%`} />
          <Stat label="Masa tunggu" value={`${dept.averageWaitTimeMonths} Bulan`} />
        </StatGrid>
      </Panel>

      <div className={shell.split}>
        <div className={shell.stack}>
          <Panel
            title={`Program Studi Terdaftar (${dept.studyPrograms.length} Prodi)`}
            tag="Daya Serap per Jenjang"
            flush
          >
            <ul className={rows.list}>
              {dept.studyPrograms.map((prodi) => (
                <li key={prodi.name} className={`${rows.row} ${dashboard.rowThree}`}>
                  <Tag>{prodi.degree.startsWith("D4") ? "D4 Sarjana" : "D3 Vokasi"}</Tag>
                  <div className={rows.main}>
                    <strong className={dashboard.cellStrong}>{prodi.name}</strong>
                    <span className={app.meta}>{prodi.studentsCount} Mahasiswa Aktif Terdata</span>
                    <Meter value={prodi.absorptionRate} label={`Serapan ${prodi.name}`} tone="var(--accent)" />
                  </div>
                  <div className={dashboard.rateCell}>
                    <span className={dashboard.slaValue}>{prodi.absorptionRate.toFixed(1)}%</span>
                    <span className={app.meta}>Terserap</span>
                  </div>
                </li>
              ))}
            </ul>
          </Panel>

          <div className={dashboard.framed}>
            <ul className={rows.list}>
              {dept.competencyGaps.map((gap, idx) => (
                <li key={gap.skill} className={rows.row}>
                  <div className={rows.main}>
                    <div className={rows.top}>
                      <Tag>Prioritas #{idx + 1}</Tag>
                      <strong className={dashboard.cellStrong}>{gap.skill}</strong>
                      <Badge tone="orange">Defisit Rekrutmen</Badge>
                    </div>

                    <p className={app.meta}>{gap.description}</p>

                    <blockquote className={app.quote}>
                      “{gap.mitraDemand}”
                      <cite>Sumber: Agregasi Bukti Penolakan Mitra Industri</cite>
                    </blockquote>

                    <Callout title="Rekomendasi RPS" icon={<LightbulbFilament size={14} />}>
                      <span className={app.meta}>{gap.rpsRecommendation}</span>
                    </Callout>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className={shell.stack}>
          <Panel
            title="Mitra Industri Perekrut"
            tag={`${dept.recruitingPartners.length} Perusahaan`}
            flush
          >
            <ul className={rows.list}>
              {dept.recruitingPartners.map((partner) => (
                <li key={partner} className={`${rows.row} ${dashboard.rowThree}`}>
                  <Buildings size={18} />
                  <div className={rows.main}>
                    <strong className={dashboard.cellStrong}>{partner}</strong>
                    <span className={app.meta}>Mitra Kampus Terverifikasi PNJ</span>
                  </div>
                  <Badge tone="green">
                    <CheckCircle size={12} /> MoU Aktif
                  </Badge>
                </li>
              ))}
            </ul>
          </Panel>

          <div className={`${dashboard.framed} ${dashboard.framedPad}`}>
            <p className={app.note}>
              Cetak hasil seleksi dan gap kompetensi sebagai Berita Acara.
            </p>
            <div className={dashboard.actionStack}>
              <Button
                variant="primary"
                onClick={() => window.print()}
                icon={<DownloadSimple size={18} />}
              >
                Cetak Laporan Jurusan
              </Button>
              <Button
                href="/admin/mitra"
                variant="ghost"
                icon={<Buildings size={18} />}
              >
                Audit Kemitraan Terkait
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

