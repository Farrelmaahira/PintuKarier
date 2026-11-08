"use client";

import { useCallback, useEffect, useState } from "react";
import { ReadinessProfile, ReadinessTrackerState } from "@/lib/data/readiness/types";
import {
  fetchStudentReadiness,
  INITIAL_READINESS_PROFILE,
  TARGET_CAREER_TRACKS,
  CAREER_READINESS_PROFILES,
} from "@/lib/data/readiness/data";

export function useReadinessTracker(): ReadinessTrackerState {
  const [targetPosition, setTargetPositionState] = useState<string>("Frontend Developer");
  const [profile, setProfile] = useState<ReadinessProfile | null>(INITIAL_READINESS_PROFILE);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("dimensions");

  const refreshReadiness = useCallback(async (pos = targetPosition) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchStudentReadiness(pos);
      setProfile(data);
    } catch {
      setError("Gagal menyinkronkan profil kesiapan kerja.");
    } finally {
      setIsLoading(false);
    }
  }, [targetPosition]);

  const setTargetPosition = (pos: string) => {
    setTargetPositionState(pos);
    if (CAREER_READINESS_PROFILES[pos]) {
      setProfile(CAREER_READINESS_PROFILES[pos]);
    } else {
      refreshReadiness(pos);
    }
  };

  useEffect(() => {
    refreshReadiness();
  }, [refreshReadiness]);

  return {
    profile,
    isLoading,
    error,
    activeTab,
    setActiveTab,
    targetPosition,
    setTargetPosition,
    availablePositions: TARGET_CAREER_TRACKS,
    refreshReadiness: () => refreshReadiness(targetPosition),
  };
}
