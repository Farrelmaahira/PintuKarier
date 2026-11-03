"use client";

import { useAdminCareerCenter } from "@/lib/hooks/useAdminCareerCenter";
import { AdminDepartmentsView } from "@/components/organisms/AdminDepartmentsView";
import { Skeleton } from "@/components/atoms/Skeleton";
import dashboard from "@/styles/dashboard.module.css";

export function AdminJurusanPage() {
  const { departments, isLoading, activeDepartmentFilter, setDepartmentFilter } =
    useAdminCareerCenter();

  if (isLoading && departments.length === 0) {
    return (
      <div className={dashboard.viewStack}>
        <Skeleton width="300px" height="36px" />
        <Skeleton height="50px" />
        <div className={dashboard.deptGridDetailed}>
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

export default AdminJurusanPage;
