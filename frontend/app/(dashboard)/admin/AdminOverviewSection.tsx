"use client";

import { useAdminCareerCenter } from "@/lib/hooks/useAdminCareerCenter";
import { AdminOverview } from "@/components/organisms/AdminOverview";
import { Skeleton } from "@/components/atoms/Skeleton";
import { Notice } from "@/components/molecules/Notice";
import shell from "@/styles/shell.module.css";

export function AdminOverviewSection() {
  const { overview, isLoading, error } = useAdminCareerCenter();

  if (isLoading && !overview) {
    return (
      <div className={shell.stack}>
        <Skeleton height="110px" />
        <Skeleton height="360px" />
      </div>
    );
  }

  if (error && !overview) {
    return (
      <Notice tone="error">{error}</Notice>
    );
  }

  if (!overview) return null;

  return <AdminOverview overview={overview} />;
}

