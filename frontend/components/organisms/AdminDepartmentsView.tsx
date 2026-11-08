"use client";

import { useState } from "react";
import { AdminDepartmentSummary } from "@/lib/data/admin/types";
import { ArrowRight } from "@phosphor-icons/react";
import { Button } from "../atoms/Button";
import { Tag } from "../atoms/Tag";
import { EmptyState } from "../molecules/EmptyState";
import { SearchField } from "../molecules/SearchField";
import { Segmented } from "../molecules/Segmented";
import { Panel } from "../molecules/Panel";
import { Stat } from "../molecules/Stat";
import { StatGrid } from "../molecules/StatGrid";
import shell from "@/styles/shell.module.css";
import ui from "@/styles/ui.module.css";
import dashboard from "@/styles/dashboard.module.css";

const ALL_DEPTS = "Semua Jurusan";

export interface AdminDepartmentsViewProps {
  departments: AdminDepartmentSummary[];
  activeFilter: string;
  onFilterChange: (code: string) => void;
}

export function AdminDepartmentsView({
  departments,
  activeFilter,
  onFilterChange,
}: AdminDepartmentsViewProps) {
  const [query, setQuery] = useState("");
  const getDeptName = (dept: AdminDepartmentSummary) => {
    const raw = dept as unknown as Record<string, unknown>;
    return (
      dept.departmentName ||
      (raw.nama as string) ||
      (raw.name as string) ||
      dept.departmentCode
    );
  };

  const q = query.trim().toLowerCase();
  const displayedDepartments = departments.filter(
    (d) =>
      (activeFilter === "ALL" || d.departmentCode === activeFilter) &&
      (!q || getDeptName(d).toLowerCase().includes(q) || d.departmentCode.toLowerCase().includes(q)),
  );

  return (
    <div className={shell.stack}>
      <div className={ui.toolbar}>
        <SearchField value={query} onChange={setQuery} placeholder="Cari nama atau kode jurusan..." />
      </div>
      <Segmented
        label="Jurusan"
        options={[ALL_DEPTS, ...departments.map((d) => d.departmentCode)]}
        value={activeFilter === "ALL" ? ALL_DEPTS : activeFilter}
        onChange={(v) => onFilterChange(v === ALL_DEPTS ? "ALL" : v)}
      />

      {displayedDepartments.length === 0 && <EmptyState title="Jurusan tidak ditemukan">Coba kata kunci lain atau reset filter.</EmptyState>}

      <div className={dashboard.moduleGrid}>
        {displayedDepartments.map((dept) => {
          const deptName = getDeptName(dept);
          const gaps = dept.competencyGaps ?? [];

          return (
            <Panel
              key={dept.departmentCode}
              title={deptName}
              tag={dept.departmentCode}
              flush
            >
              <div className={ui.statCompact}>
                <StatGrid cols={4}>
                  <Stat label="Mahasiswa" value={dept.totalStudents.toLocaleString("id-ID")} />
                  <Stat label="Pelamar" value={dept.totalApplicants} />
                  <Stat label="Mitra" value={dept.partnerCount} />
                  <Stat label="Kesiapan" value={`${dept.readinessLevel.toFixed(1)}`} />
                </StatGrid>
              </div>

              <div className={dashboard.deptGaps}>
                <span className={dashboard.deptGapsTitle}>3 Kesenjangan Kompetensi Teratas Industri:</span>
                <div className={dashboard.chipRow}>
                  {gaps.map((skill) => (
                    <Tag key={skill}>{skill}</Tag>
                  ))}
                </div>
                <span className={dashboard.deptGapsNote}>Agregasi seleksi riil periode Gasal 2026/2027 · Berbasis bukti penolakan</span>
              </div>

              <div className={dashboard.deptFoot}>
                <Button href={`/admin/jurusan/${dept.departmentCode.toLowerCase()}`} size="sm" variant="ghost" icon={<ArrowRight size={16} />}>
                  Detail &amp; Kurikulum Jurusan
                </Button>
              </div>
            </Panel>
          );
        })}
      </div>
    </div>
  );
}
