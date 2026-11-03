"use client";

import { useAdminCareerCenter } from "@/lib/hooks/useAdminCareerCenter";
import { AdminOverview } from "@/components/organisms/AdminOverview";
import { Skeleton } from "@/components/atoms/Skeleton";
import dashboard from "@/styles/dashboard.module.css";

export function AdminDashboardPage() {
  const { overview, isLoading, error } = useAdminCareerCenter();

  if (isLoading && !overview) {
    return (
      <div className={dashboard.viewStack}>
        <Skeleton width="320px" height="40px" />
        <div className={dashboard.statsGrid}>
          <Skeleton height="110px" />
          <Skeleton height="110px" />
          <Skeleton height="110px" />
          <Skeleton height="110px" />
        </div>
        <Skeleton height="360px" />
      </div>
    );
  }

  if (error && !overview) {
    return (
      <div className={dashboard.viewStack}>
        <div className={dashboard.emptyCell}>{error}</div>
      </div>
    );
  }

  if (!overview) return null;

  return <AdminOverview overview={overview} />;
}

export default AdminDashboardPage;
