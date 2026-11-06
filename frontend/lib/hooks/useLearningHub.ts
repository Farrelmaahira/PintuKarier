"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { ILearningOverview, ILearningDrill, IDrillSubmissionResult } from "../data/learning/types";
import { fetchStudentLearning, submitDrillAnswer } from "../data/learning/data";

export interface UseLearningHubReturn {
  overview: ILearningOverview | null;
  isLoading: boolean;
  error: string | null;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  categories: string[];
  filteredModules: ILearningOverview["modules"];
  activeDrill: ILearningDrill | null;
  openDrillModal: (drill: ILearningDrill) => void;
  closeDrillModal: () => void;
  isSubmittingDrill: boolean;
  drillResult: IDrillSubmissionResult | null;
  handleAnswerDrill: (optionIndex: number) => Promise<void>;
  refresh: () => Promise<void>;
}

export function useLearningHub(): UseLearningHubReturn {
  const [overview, setOverview] = useState<ILearningOverview | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");

  const [activeDrill, setActiveDrill] = useState<ILearningDrill | null>(null);
  const [isSubmittingDrill, setIsSubmittingDrill] = useState<boolean>(false);
  const [drillResult, setDrillResult] = useState<IDrillSubmissionResult | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      let data = await fetchStudentLearning();
      if (typeof window !== "undefined") {
        try {
          const saved = localStorage.getItem("pintukarier_admin_learning_modules");
          const savedDrills = localStorage.getItem("pintukarier_admin_learning_drills");
          if (saved) {
            const parsedMods = JSON.parse(saved);
            if (Array.isArray(parsedMods) && parsedMods.length > 0) {
              data = { ...data, modules: parsedMods, totalModules: parsedMods.length };
            }
          }
          if (savedDrills) {
            const parsedDrills = JSON.parse(savedDrills);
            if (Array.isArray(parsedDrills) && parsedDrills.length > 0) {
              data = { ...data, activeDrills: parsedDrills };
            }
          }
        } catch {
          // Fallback ke server data
        }
      }
      setOverview(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Gagal memuat data Learning Hub");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const categories = useMemo(() => {
    if (!overview) return ["Semua"];
    const cats = new Set(overview.modules.map((m) => m.category));
    return ["Semua", ...Array.from(cats)];
  }, [overview]);

  const filteredModules = useMemo(() => {
    if (!overview) return [];
    if (selectedCategory === "Semua") return overview.modules;
    return overview.modules.filter((m) => m.category === selectedCategory);
  }, [overview, selectedCategory]);

  const openDrillModal = useCallback((drill: ILearningDrill) => {
    setActiveDrill(drill);
    setDrillResult(null);
  }, []);

  const closeDrillModal = useCallback(() => {
    setActiveDrill(null);
    setDrillResult(null);
  }, []);

  const handleAnswerDrill = useCallback(
    async (optionIndex: number) => {
      if (!activeDrill) return;
      setIsSubmittingDrill(true);
      try {
        const result = await submitDrillAnswer(activeDrill.id, optionIndex);
        setDrillResult(result);
        if (result.isCorrect && overview) {
          setOverview((prev) => {
            if (!prev) return null;
            return {
              ...prev,
              totalScoreBoost: prev.totalScoreBoost + result.pointsEarned,
              completedModules: prev.completedModules + 1,
            };
          });
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Gagal mengevaluasi jawaban");
      } finally {
        setIsSubmittingDrill(false);
      }
    },
    [activeDrill, overview]
  );

  return {
    overview,
    isLoading,
    error,
    selectedCategory,
    setSelectedCategory,
    categories,
    filteredModules,
    activeDrill,
    openDrillModal,
    closeDrillModal,
    isSubmittingDrill,
    drillResult,
    handleAnswerDrill,
    refresh: loadData,
  };
}
