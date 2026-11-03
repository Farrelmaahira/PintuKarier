import { AdminDepartmentSummary } from "@/lib/data/admin/types";
import { Badge } from "../atoms/Badge";
import { Buildings, GraduationCap, Users } from "@phosphor-icons/react";
import dashboard from "@/styles/dashboard.module.css";
import ui from "@/styles/ui.module.css";

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

  return (
    <div className={dashboard.viewStack}>
      <header className={dashboard.pageHeader}>
        <div>
          <Badge tone="var(--cat-yellow)">Rumpun Vokasi PNJ</Badge>
          <h1 className={dashboard.pageTitle}>Statistik 7 Jurusan Politeknik Negeri Jakarta</h1>
          <p className={dashboard.pageDesc}>
            Pemantauan daya serap, gap kompetensi prioritas, dan rata-rata skor kesiapan kerja per jurusan.
          </p>
        </div>
      </header>

      <div className={dashboard.filterBar}>
        <button
          type="button"
          className={activeFilter === "ALL" ? dashboard.filterBtnActive : dashboard.filterBtn}
          onClick={() => onFilterChange("ALL")}
        >
          Semua Jurusan (7)
        </button>
        {departments.map((d) => (
          <button
            key={d.departmentCode}
            type="button"
            className={
              activeFilter === d.departmentCode
                ? dashboard.filterBtnActive
                : dashboard.filterBtn
            }
            onClick={() => onFilterChange(d.departmentCode)}
          >
            {d.departmentCode}
          </button>
        ))}
      </div>

      <div className={dashboard.deptGridDetailed}>
        {displayedDepartments.map((dept) => (
          <div key={dept.departmentCode} className={ui.card}>
            <div className={dashboard.cardHeaderRow}>
              <div>
                <span className={dashboard.deptCodeBadge}>{dept.departmentCode}</span>
                <h2 className={ui.cardTitle}>{dept.departmentName}</h2>
              </div>
              <div className={dashboard.scorePill}>
                <span className={dashboard.scorePillLabel}>Kesiapan</span>
                <span className={dashboard.scorePillVal}>{dept.readinessLevel.toFixed(1)}</span>
              </div>
            </div>

            <div className={dashboard.metaRow3}>
              <div className={dashboard.metaItem}>
                <GraduationCap size={18} aria-hidden />
                <span>{dept.totalStudents.toLocaleString("id-ID")} Mahasiswa</span>
              </div>
              <div className={dashboard.metaItem}>
                <Users size={18} aria-hidden />
                <span>{dept.totalApplicants} Pelamar</span>
              </div>
              <div className={dashboard.metaItem}>
                <Buildings size={18} aria-hidden />
                <span>{dept.partnerCount} Mitra Rekrut</span>
              </div>
            </div>

            <div className={dashboard.gapSection}>
              <h3 className={dashboard.gapTitle}>3 Kesenjangan Kompetensi Teratas Industri:</h3>
              <div className={dashboard.chipWrap}>
                {dept.competencyGaps.map((skill) => (
                  <span key={skill} className={dashboard.gapChip}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className={dashboard.deptFooter}>
              <span className={dashboard.subHint}>
                Data hasil agregasi seleksi riil periode Gasal 2026/2027.
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
