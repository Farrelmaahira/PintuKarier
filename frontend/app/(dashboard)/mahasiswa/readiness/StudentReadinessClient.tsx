"use client";

import { useState } from "react";
import { useReadinessTracker } from "@/lib/hooks/useReadinessTracker";
import { Skeleton } from "@/components/atoms/Skeleton";
import { Button } from "@/components/atoms/Button";
import { Notice } from "@/components/molecules/Notice";
import { Segmented } from "@/components/molecules/Segmented";
import { ReadinessScoreOverview } from "@/components/organisms/ReadinessScoreOverview";
import { ReadinessDimensionBreakdown } from "@/components/organisms/ReadinessDimensionBreakdown";
import { ReadinessCompetencyMatrix } from "@/components/organisms/ReadinessCompetencyMatrix";
import { ReadinessHistoryTimeline } from "@/components/organisms/ReadinessHistoryTimeline";
import { ReadinessActionRecommendations } from "@/components/organisms/ReadinessActionRecommendations";
import shell from "@/styles/shell.module.css";

export function StudentReadinessClient() {
  const { profile, isLoading, error, targetPosition, setTargetPosition, availablePositions, refreshReadiness } = useReadinessTracker();
  const [tab, setTab] = useState("5 Dimensi");

  if (!profile) {
    return error ? (
      <div className={shell.stack}>
        <Notice tone="error">{error}</Notice>
        <div>
          <Button onClick={refreshReadiness}>Coba lagi</Button>
        </div>
      </div>
    ) : (
      <div className={shell.stack}>
        <Skeleton height="260px" />
        <Skeleton height="280px" />
      </div>
    );
  }

  const competencies = profile.competencies ?? [];
  const history = profile.progressHistory ?? [];
  const tabs = ["5 Dimensi", "Kompetensi", "Riwayat"];
  const counts = { "5 Dimensi": (profile.dimensions ?? []).length, Kompetensi: competencies.length, Riwayat: history.length };

  return (
    <div className={shell.stack}>
      {error && <Notice tone="error">{error}</Notice>}
      <ReadinessScoreOverview profile={profile} availablePositions={availablePositions} selectedPosition={targetPosition} onPositionChange={setTargetPosition} />

      <div className={shell.split}>
        <div className={shell.stack} aria-busy={isLoading}>
          <Segmented label="Tampilan evaluasi kesiapan" options={tabs} counts={counts} value={tab} onChange={setTab} />
          {tab === "5 Dimensi" && <ReadinessDimensionBreakdown dimensions={profile.dimensions ?? []} />}
          {tab === "Kompetensi" && <ReadinessCompetencyMatrix competencies={competencies} />}
          {tab === "Riwayat" && <ReadinessHistoryTimeline history={history} />}
        </div>

        <ReadinessActionRecommendations recommendations={profile.actionRecommendations ?? []} />
      </div>
    </div>
  );
}
