"use client";

import { useAdminCareerCenter } from "@/lib/hooks/useAdminCareerCenter";
import { AdminPartnersView } from "@/components/organisms/AdminPartnersView";
import { Skeleton } from "@/components/atoms/Skeleton";

export function AdminMitraClient() {
  const {
    filteredPartners,
    partnerSearchQuery,
    setPartnerSearchQuery,
    isLoading,
    addPartner,
    editPartner,
    removePartner,
  } = useAdminCareerCenter();

  if (isLoading && filteredPartners.length === 0) {
    return (
      <div style={{ display: "grid", gap: "20px" }}>
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
      onAddPartner={addPartner}
      onEditPartner={editPartner}
      onDeletePartner={removePartner}
    />
  );
}

