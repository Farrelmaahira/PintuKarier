"use client";

import { useAdminCareerCenter } from "@/lib/hooks/useAdminCareerCenter";
import { AdminDepartmentsView } from "@/components/organisms/AdminDepartmentsView";
import { Skeleton } from "@/components/atoms/Skeleton";
import app from "@/styles/app.module.css";
import shell from "@/styles/shell.module.css";

export function AdminJurusanClient() {
  const { departments, isLoading, activeDepartmentFilter, setDepartmentFilter } =
    useAdminCareerCenter();

  if (isLoading && departments.length === 0) {
    return (
      <div className={shell.stack}>
        <Skeleton height="50px" />
        <div className={app.jobGrid}>
          <Skeleton height="220px" />
          <Skeleton height="220px" />
          <Skeleton height="220px" />
        </div>
      </div>
    );
  }

  return (
    <AdminDepartmentsView
      departments={departments}
      activeFilter={activeDepartmentFilter}
      onFilterChange={setDepartmentFilter}
    />
  );
}

