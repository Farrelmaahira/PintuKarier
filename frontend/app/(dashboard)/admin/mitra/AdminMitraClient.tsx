"use client";

import { useAdminCareerCenter } from "@/lib/hooks/useAdminCareerCenter";
import { AdminPartnersView } from "@/components/organisms/AdminPartnersView";
import { Skeleton } from "@/components/atoms/Skeleton";
import shell from "@/styles/shell.module.css";

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
      <div className={shell.stack}>
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

