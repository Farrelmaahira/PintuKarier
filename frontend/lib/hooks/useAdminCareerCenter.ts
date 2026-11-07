"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AdminCareerCenterState,
  AdminDepartmentSummary,
  AdminOverviewStats,
  AdminPartnerSummary,
} from "@/lib/data/admin/types";
import {
  createAdminPartner,
  deleteAdminPartner,
  fetchAdminDepartments,
  fetchAdminOverview,
  fetchAdminPartners,
  PNJ_DEPARTMENTS,
  PNJ_OVERVIEW_INITIAL,
  PNJ_PARTNERS,
  updateAdminPartner,
} from "@/lib/data/admin/data";

export interface ExtendedAdminCareerCenterState extends AdminCareerCenterState {
  addPartner: (partner: Partial<AdminPartnerSummary>) => Promise<void>;
  editPartner: (id: string, partner: Partial<AdminPartnerSummary>) => Promise<void>;
  removePartner: (id: string) => Promise<void>;
}

export function useAdminCareerCenter(): ExtendedAdminCareerCenterState {
  const [overview, setOverview] = useState<AdminOverviewStats | null>(PNJ_OVERVIEW_INITIAL);
  const [departments, setDepartments] = useState<AdminDepartmentSummary[]>(PNJ_DEPARTMENTS);
  const [partners, setPartners] = useState<AdminPartnerSummary[]>(PNJ_PARTNERS);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeDepartmentFilter, setActiveDepartmentFilter] = useState<string>("ALL");
  const [partnerSearchQuery, setPartnerSearchQuery] = useState<string>("");

  const refreshData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [ovData, deptData, partData] = await Promise.all([
        fetchAdminOverview(),
        fetchAdminDepartments(),
        fetchAdminPartners(),
      ]);
      setOverview(ovData);
      setDepartments(deptData);
      setPartners(partData);
    } catch {
      setError("Gagal menyinkronkan data pusat karier dari server.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addPartner = useCallback(async (partner: Partial<AdminPartnerSummary>) => {
    await createAdminPartner(partner);
    await refreshData();
  }, [refreshData]);

  const editPartner = useCallback(async (id: string, partner: Partial<AdminPartnerSummary>) => {
    await updateAdminPartner(id, partner);
    await refreshData();
  }, [refreshData]);

  const removePartner = useCallback(async (id: string) => {
    await deleteAdminPartner(id);
    await refreshData();
  }, [refreshData]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const filteredPartners = useMemo(() => {
    if (!partnerSearchQuery.trim()) return partners;
    const q = partnerSearchQuery.toLowerCase();
    return partners.filter(
      (p) =>
        p.companyName.toLowerCase().includes(q) ||
        p.industrySector.toLowerCase().includes(q),
    );
  }, [partners, partnerSearchQuery]);

  return {
    overview,
    departments,
    partners,
    isLoading,
    error,
    activeDepartmentFilter,
    partnerSearchQuery,
    filteredPartners,
    setDepartmentFilter: setActiveDepartmentFilter,
    setPartnerSearchQuery,
    refreshData,
    addPartner,
    editPartner,
    removePartner,
  };
}
