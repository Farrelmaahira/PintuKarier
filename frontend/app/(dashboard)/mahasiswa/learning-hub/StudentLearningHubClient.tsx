"use client";

import { useLearningHub } from "@/lib/hooks/useLearningHub";
import { LearningSummaryBanner } from "@/components/organisms/LearningSummaryBanner";
import { LearningModuleCard } from "@/components/organisms/LearningModuleCard";
import { InteractiveDrillModal } from "@/components/organisms/InteractiveDrillModal";
import { Segmented } from "@/components/molecules/Segmented";
import { Skeleton } from "@/components/atoms/Skeleton";
import shell from "@/styles/shell.module.css";
import app from "@/styles/app.module.css";

export function StudentLearningHubClient() {
  const {
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
  } = useLearningHub();

  if (isLoading && !overview) {
    return (
      <div style={{ display: "grid", gap: "20px" }}>
        <Skeleton height="160px" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "16px" }}>
          <Skeleton height="220px" />
          <Skeleton height="220px" />
          <Skeleton height="220px" />
        </div>
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

  return (
    <div className={shell.stack} style={{ gap: "20px" }}>
      <LearningSummaryBanner
        totalModules={overview.totalModules}
        completedModules={overview.completedModules}
        inProgressModules={overview.inProgressModules}
        totalScoreBoost={overview.totalScoreBoost}
        recommendedCategory={overview.recommendedCategory}
      />

      <Segmented
        label="Filter Kategori Materi"
        options={categories}
        value={selectedCategory}
        onChange={setSelectedCategory}
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: "20px" }}>
        {filteredModules.map((module) => {
          const relatedDrill = overview.activeDrills.find(
            (d) => d.moduleId === module.id
          );
          return (
            <LearningModuleCard
              key={module.id}
              module={module}
              relatedDrill={relatedDrill}
              onOpenDrill={openDrillModal}
            />
          );
        })}
      </div>

      {activeDrill && (
        <InteractiveDrillModal
          drill={activeDrill}
          onClose={closeDrillModal}
          onSubmit={handleAnswerDrill}
          isSubmitting={isSubmittingDrill}
          result={drillResult}
        />
      )}
    </div>
  );
}
