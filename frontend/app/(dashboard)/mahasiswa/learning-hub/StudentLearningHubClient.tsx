"use client";

import { useMemo, useState } from "react";
import { useLearningHub } from "@/lib/hooks/useLearningHub";
import { ALL, countBy } from "@/lib/filters";
import { Button } from "@/components/atoms/Button";
import { Skeleton } from "@/components/atoms/Skeleton";
import { EmptyState } from "@/components/molecules/EmptyState";
import { CategoryFilter } from "@/components/molecules/CategoryFilter";
import { FilterMenu } from "@/components/molecules/FilterMenu";
import { Notice } from "@/components/molecules/Notice";
import { InteractiveDrillModal } from "@/components/organisms/InteractiveDrillModal";
import { LearningModuleCard } from "@/components/organisms/LearningModuleCard";
import { LearningSummaryBanner } from "@/components/organisms/LearningSummaryBanner";
import app from "@/styles/app.module.css";
import shell from "@/styles/shell.module.css";

const TONES = ["var(--cat-green)", "var(--cat-lilac)", "var(--cat-yellow)", "var(--cat-cyan)", "var(--cat-orange)"];
const DIFFICULTIES = ["Dasar", "Menengah", "Lanjutan"];
const STATUS_LABEL = { recommended: "Belum dimulai", in_progress: "Berjalan", completed: "Selesai" } as const;
const STATUSES = Object.values(STATUS_LABEL);

export function StudentLearningHubClient() {
  const { overview, isLoading, error, selectedCategory, setSelectedCategory, categories, filteredModules, activeDrill, openDrillModal, closeDrillModal, isSubmittingDrill, drillResult, handleAnswerDrill } = useLearningHub();
  const [difficulty, setDifficulty] = useState(ALL);
  const [status, setStatus] = useState(ALL);

  const modules = overview?.modules ?? [];
  const visible = useMemo(
    () =>
      filteredModules.filter(
        (m) =>
          (difficulty === ALL || m.difficulty === difficulty) &&
          (status === ALL || STATUS_LABEL[m.status] === status),
      ),
    [filteredModules, difficulty, status],
  );

  if (!overview) {
    return error ? (
      <div className={shell.stack}>
        <Notice tone="error">{error}</Notice>
        <div>
          <Button onClick={() => window.location.reload()}>Muat ulang</Button>
        </div>
      </div>
    ) : (
      <div className={shell.stack} aria-busy={isLoading}>
        <Skeleton height="160px" />
        <Skeleton height="220px" />
      </div>
    );
  }

  const categoryCounts = countBy(modules, (m) => m.category, categories[0]);
  const categoryOptions = categories.map((label, i) => ({ label, count: categoryCounts[label] ?? 0, tone: i === 0 ? "var(--ink)" : TONES[(i - 1) % TONES.length]! }));

  return (
    <div className={shell.stack}>
      <LearningSummaryBanner
        totalModules={overview.totalModules}
        completedModules={overview.completedModules}
        inProgressModules={overview.inProgressModules}
        totalScoreBoost={overview.totalScoreBoost}
        recommendedCategory={overview.recommendedCategory}
      />

      <div className={app.listHead}>
        <div className={app.listHeadText}>
          <h2 className={app.listTitle}>Daftar Modul Belajar</h2>
          <p className={app.meta} style={{ marginTop: 4 }}>
            Pilih modul untuk membaca materi dan uji kemampuan lewat drill.
          </p>
        </div>
        <CategoryFilter
          options={categoryOptions}
          value={selectedCategory}
          onChange={setSelectedCategory}
          action={
            <FilterMenu
              fields={[
                { key: "difficulty", title: "Tingkat kesulitan", options: [ALL, ...DIFFICULTIES] },
                { key: "status", title: "Status belajar", options: [ALL, ...STATUSES] },
              ]}
              values={{ difficulty, status }}
              onApply={(v) => {
                setDifficulty(v.difficulty);
                setStatus(v.status);
              }}
            />
          }
        />
      </div>

      {visible.length ? (
        <div className={app.jobGrid}>
          {visible.map((module) => (
            <LearningModuleCard key={module.id} module={module} relatedDrill={overview.activeDrills.find((d) => d.moduleId === module.id)} onOpenDrill={openDrillModal} />
          ))}
        </div>
      ) : (
        <EmptyState title="Tidak ada modul yang cocok" img="undraw/empty" large>
          Coba kategori atau filter lain.
        </EmptyState>
      )}

      {activeDrill && <InteractiveDrillModal drill={activeDrill} onClose={closeDrillModal} onSubmit={handleAnswerDrill} isSubmitting={isSubmittingDrill} result={drillResult} />}
    </div>
  );
}
