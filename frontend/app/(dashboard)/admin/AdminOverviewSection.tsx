"use client";

import { useAdminCareerCenter } from "@/lib/hooks/useAdminCareerCenter";
import { AdminOverview } from "@/components/organisms/AdminOverview";
import { Skeleton } from "@/components/atoms/Skeleton";

export function AdminOverviewSection() {
  const { overview, isLoading, error } = useAdminCareerCenter();

  if (isLoading && !overview) {
    return (
      <div style={{ display: "grid", gap: "20px" }}>
        <Skeleton height="110px" />
        <Skeleton height="360px" />
      </div>
    );
  }

  if (error && !overview) {
    return (
      <div style={{ padding: "40px", textAlign: "center", border: "var(--border)", background: "var(--surface-raised)" }}>
        {error}
      </div>
    );
  }

  if (!overview) return null;

  return <AdminOverview overview={overview} />;
}

