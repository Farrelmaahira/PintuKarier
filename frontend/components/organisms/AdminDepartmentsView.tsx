"use client";

import { AdminDepartmentSummary } from "@/lib/data/admin/types";
import { ArrowRight } from "@phosphor-icons/react";
import { Button } from "../atoms/Button";
import { Tag } from "../atoms/Tag";
import { Panel } from "../molecules/Panel";
import { Stat } from "../molecules/Stat";
import { StatGrid } from "../molecules/StatGrid";
import shell from "@/styles/shell.module.css";
import ui from "@/styles/ui.module.css";
import app from "@/styles/app.module.css";

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
  const displayedDepartments =
    activeFilter === "ALL"
      ? departments
      : departments.filter((d) => d.departmentCode === activeFilter);

  const getDeptName = (dept: AdminDepartmentSummary) => {
    const raw = dept as unknown as Record<string, unknown>;
    return (
      dept.departmentName ||
      (raw.nama as string) ||
      (raw.name as string) ||
      dept.departmentCode
    );
  };

  return (
    <div className={shell.stack} style={{ gap: "20px" }}>
      <div className={app.segment} role="tablist" aria-label="Filter Jurusan PNJ">
        <button
          type="button"
          role="tab"
          aria-selected={activeFilter === "ALL"}
          aria-pressed={activeFilter === "ALL"}
          onClick={() => onFilterChange("ALL")}
        >
          Semua Jurusan ({departments.length})
        </button>
        {departments.map((d) => (
          <button
            key={d.departmentCode}
            type="button"
            role="tab"
            aria-selected={activeFilter === d.departmentCode}
            aria-pressed={activeFilter === d.departmentCode}
            onClick={() => onFilterChange(d.departmentCode)}
          >
            {d.departmentCode}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "20px" }}>
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

              <div style={{ padding: "16px 20px", display: "grid", gap: "8px", borderTop: "var(--border)", background: "var(--surface)" }}>
                <span style={{ fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.03em", color: "var(--text-muted)" }}>
                  3 Kesenjangan Kompetensi Teratas Industri:
                </span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {gaps.map((skill) => (
                    <Tag key={skill}>{skill}</Tag>
                  ))}
                </div>
                <span style={{ fontSize: "11px", color: "var(--text-subtle)", marginTop: "4px" }}>
                  Agregasi seleksi riil periode Gasal 2026/2027 · Berbasis bukti penolakan
                </span>
              </div>

              <div
                style={{
                  padding: "10px 20px",
                  borderTop: "var(--border)",
                  background: "var(--surface-raised)",
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <Button
                  href={`/admin/jurusan/${dept.departmentCode.toLowerCase()}`}
                  size="sm"
                  variant="ghost"
                  icon={<ArrowRight size={16} />}
                >
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
