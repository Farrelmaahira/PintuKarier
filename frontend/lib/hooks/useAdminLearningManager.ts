"use client";

import { useCallback, useEffect, useState } from "react";
import { ILearningDrill, ILearningModule } from "@/lib/data/learning/types";
import { BASELINE_LEARNING_OVERVIEW } from "@/lib/data/learning/data";

export interface AdminLearningFormState {
  title: string;
  category: string;
  difficulty: "Dasar" | "Menengah" | "Lanjutan";
  durationMinutes: number;
  summary: string;
  competencies: string;
  estimatedGain: number;
  externalResourceUrl: string;
  // Drill
  includeDrill: boolean;
  scenario: string;
  problemStatement: string;
  option0: string;
  option1: string;
  option2: string;
  option3: string;
  correctIndex: number;
  explanation: string;
  readinessBoost: number;
}

export interface AdminLearningManagerState {
  modules: ILearningModule[];
  drills: ILearningDrill[];
  categories: string[];
  selectedCategory: string;
  searchQuery: string;
  isModalOpen: boolean;
  editingModule: ILearningModule | null;
  form: AdminLearningFormState;
  setSelectedCategory: (cat: string) => void;
  setSearchQuery: (q: string) => void;
  openCreateModal: () => void;
  openEditModal: (mod: ILearningModule) => void;
  closeModal: () => void;
  updateFormField: <K extends keyof AdminLearningFormState>(
    key: K,
    val: AdminLearningFormState[K],
  ) => void;
  saveModule: () => void;
  deleteModule: (id: string) => void;
  filteredModules: ILearningModule[];
}

const STORAGE_KEY_MODULES = "pintukarier_admin_learning_modules";
const STORAGE_KEY_DRILLS = "pintukarier_admin_learning_drills";

const DEFAULT_FORM: AdminLearningFormState = {
  title: "",
  category: "Database",
  difficulty: "Menengah",
  durationMinutes: 45,
  summary: "",
  competencies: "",
  estimatedGain: 8,
  externalResourceUrl: "",
  includeDrill: true,
  scenario: "",
  problemStatement: "",
  option0: "",
  option1: "",
  option2: "",
  option3: "",
  correctIndex: 1,
  explanation: "",
  readinessBoost: 8,
};

export function useAdminLearningManager(): AdminLearningManagerState {
  const [modules, setModules] = useState<ILearningModule[]>(BASELINE_LEARNING_OVERVIEW.modules);
  const [drills, setDrills] = useState<ILearningDrill[]>(BASELINE_LEARNING_OVERVIEW.activeDrills);
  const [selectedCategory, setSelectedCategory] = useState<string>("SEMUA");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingModule, setEditingModule] = useState<ILearningModule | null>(null);
  const [form, setForm] = useState<AdminLearningFormState>(DEFAULT_FORM);

  // Inisialisasi dari localStorage bila ada
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const savedMods = localStorage.getItem(STORAGE_KEY_MODULES);
      const savedDrills = localStorage.getItem(STORAGE_KEY_DRILLS);
      if (savedMods) {
        const parsed = JSON.parse(savedMods);
        if (Array.isArray(parsed) && parsed.length > 0) setModules(parsed);
      }
      if (savedDrills) {
        const parsed = JSON.parse(savedDrills);
        if (Array.isArray(parsed) && parsed.length > 0) setDrills(parsed);
      }
    } catch {
      // Fallback baseline
    }
  }, []);

  const saveToStorage = useCallback(
    (newMods: ILearningModule[], newDrills: ILearningDrill[]) => {
      setModules(newMods);
      setDrills(newDrills);
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY_MODULES, JSON.stringify(newMods));
        localStorage.setItem(STORAGE_KEY_DRILLS, JSON.stringify(newDrills));
      }
    },
    [],
  );

  const openCreateModal = useCallback(() => {
    setEditingModule(null);
    setForm(DEFAULT_FORM);
    setIsModalOpen(true);
  }, []);

  const openEditModal = useCallback(
    (mod: ILearningModule) => {
      setEditingModule(mod);
      const drill = drills.find((d) => d.moduleId === mod.id);
      setForm({
        title: mod.title,
        category: mod.category,
        difficulty: mod.difficulty,
        durationMinutes: mod.durationMinutes,
        summary: mod.summary,
        competencies: mod.competenciesCovered.join(", "),
        estimatedGain: mod.estimatedGain,
        externalResourceUrl: mod.externalResourceUrl,
        includeDrill: !!drill,
        scenario: drill?.scenario ?? "",
        problemStatement: drill?.problemStatement ?? "",
        option0: drill?.options[0]?.text ?? "",
        option1: drill?.options[1]?.text ?? "",
        option2: drill?.options[2]?.text ?? "",
        option3: drill?.options[3]?.text ?? "",
        correctIndex: drill?.correctIndex ?? 0,
        explanation: drill?.explanation ?? "",
        readinessBoost: drill?.readinessBoost ?? 8,
      });
      setIsModalOpen(true);
    },
    [drills],
  );

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingModule(null);
  }, []);

  const updateFormField = useCallback(
    <K extends keyof AdminLearningFormState>(
      key: K,
      val: AdminLearningFormState[K],
    ) => {
      setForm((prev) => ({ ...prev, [key]: val }));
    },
    [],
  );

  const saveModule = useCallback(() => {
    if (!form.title.trim()) return;

    const comps = form.competencies
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean);

    const targetId = editingModule ? editingModule.id : `mod-${Date.now()}`;

    const newModule: ILearningModule = {
      id: targetId,
      title: form.title.trim(),
      category: form.category.trim() || "Umum",
      difficulty: form.difficulty,
      durationMinutes: Number(form.durationMinutes) || 30,
      summary: form.summary.trim(),
      competenciesCovered: comps.length > 0 ? comps : [form.category],
      estimatedGain: Number(form.estimatedGain) || 5,
      status: "recommended",
      externalResourceUrl: form.externalResourceUrl.trim() || "https://pnj.ac.id",
    };

    let nextModules: ILearningModule[];
    if (editingModule) {
      nextModules = modules.map((m) => (m.id === targetId ? newModule : m));
    } else {
      nextModules = [newModule, ...modules];
    }

    let nextDrills = drills.filter((d) => d.moduleId !== targetId);
    if (form.includeDrill && form.scenario.trim() && form.problemStatement.trim()) {
      const newDrill: ILearningDrill = {
        id: `drill-${targetId}`,
        moduleId: targetId,
        scenario: form.scenario.trim(),
        problemStatement: form.problemStatement.trim(),
        options: [
          { index: 0, text: form.option0.trim() || "Opsi A" },
          { index: 1, text: form.option1.trim() || "Opsi B" },
          { index: 2, text: form.option2.trim() || "Opsi C" },
          { index: 3, text: form.option3.trim() || "Opsi D" },
        ],
        correctIndex: form.correctIndex,
        explanation: form.explanation.trim() || "Penjelasan studi kasus industri.",
        readinessBoost: Number(form.readinessBoost) || 8,
        targetCompetency: comps[0] || form.category,
      };
      nextDrills = [newDrill, ...nextDrills];
    }

    saveToStorage(nextModules, nextDrills);
    closeModal();
  }, [editingModule, form, modules, drills, saveToStorage, closeModal]);

  const deleteModule = useCallback(
    (id: string) => {
      const nextModules = modules.filter((m) => m.id !== id);
      const nextDrills = drills.filter((d) => d.moduleId !== id);
      saveToStorage(nextModules, nextDrills);
    },
    [modules, drills, saveToStorage],
  );

  const categories = ["SEMUA", ...Array.from(new Set(modules.map((m) => m.category)))];

  const filteredModules = modules.filter((m) => {
    const matchesCat = selectedCategory === "SEMUA" || m.category === selectedCategory;
    const matchesSearch =
      !searchQuery.trim() ||
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return {
    modules,
    drills,
    categories,
    selectedCategory,
    searchQuery,
    isModalOpen,
    editingModule,
    form,
    setSelectedCategory,
    setSearchQuery,
    openCreateModal,
    openEditModal,
    closeModal,
    updateFormField,
    saveModule,
    deleteModule,
    filteredModules,
  };
}

