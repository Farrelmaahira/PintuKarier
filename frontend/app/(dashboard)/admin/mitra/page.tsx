"use client";

import { useAdminCareerCenter } from "@/lib/hooks/useAdminCareerCenter";
import { AdminPartnersView } from "@/components/organisms/AdminPartnersView";
import { Skeleton } from "@/components/atoms/Skeleton";
import dashboard from "@/styles/dashboard.module.css";

export function AdminMitraPage() {
  const { filteredPartners, partnerSearchQuery, setPartnerSearchQuery, isLoading } =
    useAdminCareerCenter();

  if (isLoading && filteredPartners.length === 0) {
    return (
      <div className={dashboard.viewStack}>
        <Skeleton width="320px" height="36px" />
        <Skeleton height="44px" />
        <Skeleton height="300px" />
      </div>
    );
  }

  return (
    <AdminPartnersView
      partners={filteredPartners}
      searchQuery={partnerSearchQuery}
      onSearchChange={setPartnerSearchQuery}
    />
  );
}

export default AdminMitraPage;
