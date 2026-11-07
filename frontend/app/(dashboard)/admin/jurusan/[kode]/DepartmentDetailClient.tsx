"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Buildings,
  CheckCircle,
  DownloadSimple,
  LightbulbFilament,
  Users,
} from "@phosphor-icons/react";
import { DepartmentDetailData } from "@/lib/data/admin/departmentDetails";
import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { Meter } from "@/components/atoms/Meter";
import { Tag } from "@/components/atoms/Tag";
import { Panel } from "@/components/molecules/Panel";
import { Stat } from "@/components/molecules/Stat";
import { StatGrid } from "@/components/molecules/StatGrid";
import rows from "@/styles/rows.module.css";
import shell from "@/styles/shell.module.css";
import app from "@/styles/app.module.css";

export interface DepartmentDetailClientProps {
  dept: DepartmentDetailData;
}

export function DepartmentDetailClient({ dept }: DepartmentDetailClientProps) {
  return (
    <div className={shell.stack} style={{ gap: "24px" }}>
      <div>
        <Link href="/admin/jurusan" className={app.back} style={{ display: "inline-flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
          <ArrowLeft size={16} /> Kembali ke Ringkasan 7 Jurusan
        </Link>
      </div>

      <Panel title={`Metrik Kinerja Rumpun ${dept.code}`} tag={`Kode Jurusan: ${dept.code}`} flush>
        <StatGrid cols={4}>
          <Stat label="Total Mahasiswa Aktif" value={`${dept.totalStudents.toLocaleString("id-ID")} Mhs`} />
          <Stat label="Pelamar Aktif Industri" value={`${dept.totalApplicants} Orang`} />
          <Stat label="Tingkat Serapan Kerja" value={`${dept.absorbedPercentage}%`} />
          <Stat label="Rata-rata Masa Tunggu" value={`${dept.averageWaitTimeMonths} Bulan`} />
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
                <li key={prodi.name} className={rows.row} style={{ gridTemplateColumns: "auto 1fr auto" }}>
                  <Tag>{prodi.degree.startsWith("D4") ? "D4 Sarjana" : "D3 Vokasi"}</Tag>
                  <div className={rows.main} style={{ gap: "4px" }}>
                    <strong style={{ fontSize: "15px" }}>{prodi.name}</strong>
                    <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                      {prodi.studentsCount} Mahasiswa Aktif Terdata
                    </span>
                    <Meter value={prodi.absorptionRate} label={`Serapan ${prodi.name}`} tone="var(--accent)" />
                  </div>
                  <div style={{ textAlign: "right", minWidth: "50px" }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: "16px" }}>
                      {prodi.absorptionRate.toFixed(1)}%
                    </span>
                    <span style={{ fontSize: "11px", color: "var(--text-muted)", display: "block" }}>Terserap</span>
                  </div>
                </li>
              ))}
            </ul>
          </Panel>

          <div style={{ border: "var(--border)", background: "var(--surface-raised)" }}>
            <ul className={rows.list}>
              {dept.competencyGaps.map((gap, idx) => (
                <li key={gap.skill} className={rows.row} style={{ gridTemplateColumns: "1fr" }}>
                  <div className={rows.main} style={{ gap: "8px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <Tag>Prioritas #{idx + 1}</Tag>
                      <strong style={{ fontSize: "15px" }}>{gap.skill}</strong>
                      <Badge tone="orange">Defisit Rekrutmen</Badge>
                    </div>

                    <p style={{ margin: 0, fontSize: "13px", color: "var(--text-muted)", lineHeight: 1.45 }}>
                      {gap.description}
                    </p>

                    <blockquote className={app.quote} style={{ margin: "4px 0 0" }}>
                      “{gap.mitraDemand}”
                      <cite>Sumber: Agregasi Bukti Penolakan Mitra Industri</cite>
                    </blockquote>

                    <div
                      style={{
                        padding: "10px 12px",
                        borderLeft: "4px solid var(--accent)",
                        background: "var(--surface)",
                        borderTop: "1px solid var(--border-light, #e0e0e0)",
                        borderRight: "1px solid var(--border-light, #e0e0e0)",
                        borderBottom: "1px solid var(--border-light, #e0e0e0)",
                        marginTop: "4px",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: 700, fontSize: "12px", marginBottom: "2px" }}>
                        <LightbulbFilament size={14} color="var(--ink)" />
                        Rekomendasi Pembaruan RPS / Modul Praktikum:
                      </div>
                      <div style={{ fontSize: "12px", color: "var(--text-muted)", lineHeight: 1.4 }}>
                        {gap.rpsRecommendation}
                      </div>
                    </div>
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
                <li key={partner} className={rows.row} style={{ gridTemplateColumns: "auto 1fr auto" }}>
                  <Buildings size={18} color="var(--ink)" />
                  <div className={rows.main}>
                    <strong style={{ fontSize: "14px" }}>{partner}</strong>
                    <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>Mitra Kampus Terverifikasi PNJ</span>
                  </div>
                  <Badge tone="green">
                    <CheckCircle size={12} style={{ marginRight: "4px" }} /> MoU Aktif
                  </Badge>
                </li>
              ))}
            </ul>
          </Panel>

          <div style={{ border: "var(--border)", background: "var(--surface-raised)", padding: "20px" }}>
            <p className={app.note} style={{ marginTop: 0 }}>
              Data hasil seleksi dan gap kompetensi ini dapat dicetak sebagai Berita Acara evaluasi kurikulum untuk rapat pleno jurusan.
            </p>
            <div style={{ display: "grid", gap: "10px", marginTop: "14px" }}>
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

