"use client";

import { useState } from "react";
import { useReadinessTracker } from "@/lib/hooks/useReadinessTracker";
import { ReadinessScoreOverview } from "@/components/organisms/ReadinessScoreOverview";
import { ReadinessDimensionBreakdown } from "@/components/organisms/ReadinessDimensionBreakdown";
import { ReadinessCompetencyMatrix } from "@/components/organisms/ReadinessCompetencyMatrix";
import { ReadinessHistoryTimeline } from "@/components/organisms/ReadinessHistoryTimeline";
import { ReadinessActionRecommendations } from "@/components/organisms/ReadinessActionRecommendations";
import { Skeleton } from "@/components/atoms/Skeleton";
import shell from "@/styles/shell.module.css";
import app from "@/styles/app.module.css";

export function StudentReadinessClient() {
  const {
    profile,
    isLoading,
    error,
    targetPosition,
    setTargetPosition,
    availablePositions,
  } = useReadinessTracker();
  const [activeTab, setActiveTab] = useState<"dimensions" | "competencies" | "history">("dimensions");

  if (isLoading && !profile) {
    return (
      <div style={{ display: "grid", gap: "20px" }}>
        <Skeleton height="160px" />
        <Skeleton height="280px" />
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div style={{ padding: "40px", textAlign: "center", border: "var(--border)", background: "var(--surface-raised)" }}>
        {error}
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className={shell.stack} style={{ gap: "20px" }}>
      <ReadinessScoreOverview
        profile={profile}
        availablePositions={availablePositions}
        selectedPosition={targetPosition}
        onPositionChange={setTargetPosition}
      />

      <div className={app.segment} role="tablist" aria-label="Tab Evaluasi Kesiapan">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "dimensions"}
          aria-pressed={activeTab === "dimensions"}
          onClick={() => setActiveTab("dimensions")}
        >
          5 Dimensi Kesiapan
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "competencies"}
          aria-pressed={activeTab === "competencies"}
          onClick={() => setActiveTab("competencies")}
        >
          Matriks Kompetensi ({(profile.competencies ?? []).length})
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "history"}
          aria-pressed={activeTab === "history"}
          onClick={() => setActiveTab("history")}
        >
          Riwayat Evaluasi ({(profile.progressHistory ?? []).length})
        </button>
      </div>

      {activeTab === "dimensions" && (
        <ReadinessDimensionBreakdown dimensions={profile.dimensions ?? []} />
      )}

      {activeTab === "competencies" && (
        <ReadinessCompetencyMatrix competencies={profile.competencies ?? []} />
      )}

      {activeTab === "history" && (
        <ReadinessHistoryTimeline history={profile.progressHistory ?? []} />
      )}

      <ReadinessActionRecommendations recommendations={profile.actionRecommendations ?? []} />
    </div>
  );
}
