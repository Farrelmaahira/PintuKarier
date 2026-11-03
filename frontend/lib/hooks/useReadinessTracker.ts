"use client";

import { useCallback, useEffect, useState } from "react";
import { ReadinessProfile, ReadinessTrackerState } from "@/lib/data/readiness/types";
import { fetchStudentReadiness, INITIAL_READINESS_PROFILE } from "@/lib/data/readiness/data";

export function useReadinessTracker(): ReadinessTrackerState {
  const [profile, setProfile] = useState<ReadinessProfile | null>(INITIAL_READINESS_PROFILE);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("DIMENSI");

  const refreshReadiness = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchStudentReadiness();
      setProfile(data);
    } catch {
      setError("Gagal menyinkronkan profil kesiapan kerja.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshReadiness();
  }, [refreshReadiness]);

  return {
    profile,
    isLoading,
    error,
    activeTab,
    setActiveTab,
    refreshReadiness,
  };
}
