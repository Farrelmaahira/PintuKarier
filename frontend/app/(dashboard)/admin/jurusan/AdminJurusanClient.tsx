"use client";

import { useAdminCareerCenter } from "@/lib/hooks/useAdminCareerCenter";
import { AdminDepartmentsView } from "@/components/organisms/AdminDepartmentsView";
import { Skeleton } from "@/components/atoms/Skeleton";

export function AdminJurusanClient() {
  const { departments, isLoading, activeDepartmentFilter, setDepartmentFilter } =
    useAdminCareerCenter();

  if (isLoading && departments.length === 0) {
    return (
      <div style={{ display: "grid", gap: "20px" }}>
        <Skeleton height="50px" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: "16px" }}>
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

