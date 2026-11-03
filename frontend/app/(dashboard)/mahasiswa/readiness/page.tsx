"use client";

import { useState } from "react";
import { useReadinessTracker } from "@/lib/hooks/useReadinessTracker";
import { ReadinessScoreOverview } from "@/components/organisms/ReadinessScoreOverview";
import { ReadinessDimensionBreakdown } from "@/components/organisms/ReadinessDimensionBreakdown";
import { ReadinessCompetencyMatrix } from "@/components/organisms/ReadinessCompetencyMatrix";
import { ReadinessHistoryTimeline } from "@/components/organisms/ReadinessHistoryTimeline";
import { ReadinessActionRecommendations } from "@/components/organisms/ReadinessActionRecommendations";
import { Skeleton } from "@/components/atoms/Skeleton";
import dashboard from "@/styles/dashboard.module.css";

export function StudentReadinessPage() {
  const { data, isLoading, error, refresh } = useReadinessTracker();
  const [activeTab, setActiveTab] = useState<"dimensions" | "competencies" | "history">("dimensions");

  if (isLoading && !data) {
    return (
      <div className={dashboard.viewStack}>
        <Skeleton width="340px" height="42px" />
        <Skeleton height="160px" />
        <Skeleton height="280px" />
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className={dashboard.viewStack}>
        <div className={dashboard.emptyCell}>{error}</div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className={dashboard.viewStack}>
      <div>
        <h1 className={dashboard.title}>Readiness Tracker</h1>
        <p className={dashboard.subtitle}>
          Evaluasi kesiapan kerja berbasis 5 dimensi bukti portofolio, drill kompetensi, dan histori peningkatan skor kamu.
        </p>
      </div>

      <ReadinessScoreOverview
        score={data.overallScore}
        tier={data.readinessTier}
        targetRole={data.targetRole}
        department={data.department}
        percentile={data.percentile}
        lastEvaluatedAt={data.lastEvaluatedAt}
        onRefresh={refresh}
        isRefreshing={isLoading}
      />

      <div className={dashboard.tabNav}>
        <button
          type="button"
          className={activeTab === "dimensions" ? dashboard.tabActive : dashboard.tabItem}
          onClick={() => setActiveTab("dimensions")}
        >
          5 Dimensi Kesiapan
        </button>
        <button
          type="button"
          className={activeTab === "competencies" ? dashboard.tabActive : dashboard.tabItem}
          onClick={() => setActiveTab("competencies")}
        >
          Matriks Kompetensi ({data.competencies.length})
        </button>
        <button
          type="button"
          className={activeTab === "history" ? dashboard.tabActive : dashboard.tabItem}
          onClick={() => setActiveTab("history")}
        >
          Riwayat Evaluasi ({data.history.length})
        </button>
      </div>

      {activeTab === "dimensions" && (
        <ReadinessDimensionBreakdown dimensions={data.dimensions} />
      )}

      {activeTab === "competencies" && (
        <ReadinessCompetencyMatrix competencies={data.competencies} />
      )}

      {activeTab === "history" && (
        <ReadinessHistoryTimeline history={data.history} />
      )}

      <ReadinessActionRecommendations
        recommendations={data.recommendations}
        nextMilestone={data.nextMilestone}
      />
    </div>
  );
}

export default StudentReadinessPage;
