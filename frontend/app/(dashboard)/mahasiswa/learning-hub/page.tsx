"use client";

import { useLearningHub } from "@/lib/hooks/useLearningHub";
import { LearningSummaryBanner } from "@/components/organisms/LearningSummaryBanner";
import { LearningModuleCard } from "@/components/organisms/LearningModuleCard";
import { InteractiveDrillModal } from "@/components/organisms/InteractiveDrillModal";
import { Skeleton } from "@/components/atoms/Skeleton";
import dashboard from "@/styles/dashboard.module.css";

export function StudentLearningHubPage() {
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
      <div className={dashboard.viewStack}>
        <Skeleton width="360px" height="42px" />
        <Skeleton height="160px" />
        <div className={dashboard.moduleGrid}>
          <Skeleton height="220px" />
          <Skeleton height="220px" />
          <Skeleton height="220px" />
        </div>
      </div>
    );
  }

  if (error && !overview) {
    return (
      <div className={dashboard.viewStack}>
        <div className={dashboard.emptyCell}>{error}</div>
      </div>
    );
  }

  if (!overview) return null;

  return (
    <div className={dashboard.viewStack}>
      <div>
        <h1 className={dashboard.title}>Learning Hub & Drill Kompetensi</h1>
        <p className={dashboard.subtitle}>
          Katalog materi industri terkurasi dan studi kasus interaktif untuk menutup kesenjangan kompetensi yang teridentifikasi dari riwayat seleksi kamu.
        </p>
      </div>

      <LearningSummaryBanner
        totalModules={overview.totalModules}
        completedModules={overview.completedModules}
        inProgressModules={overview.inProgressModules}
        totalScoreBoost={overview.totalScoreBoost}
        recommendedCategory={overview.recommendedCategory}
      />

      <div className={dashboard.categoryFilterBar}>
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            className={
              selectedCategory === cat
                ? dashboard.filterBtnActive
                : dashboard.filterBtn
            }
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className={dashboard.moduleGrid}>
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

export default StudentLearningHubPage;
