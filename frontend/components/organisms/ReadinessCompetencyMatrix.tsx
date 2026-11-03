import { ReadinessCompetency } from "@/lib/data/readiness/types";
import { Badge } from "../atoms/Badge";
import dashboard from "@/styles/dashboard.module.css";
import ui from "@/styles/ui.module.css";

export interface ReadinessCompetencyMatrixProps {
  competencies: ReadinessCompetency[];
}

export function ReadinessCompetencyMatrix({ competencies }: ReadinessCompetencyMatrixProps) {
  return (
    <div className={ui.card}>
      <div className={dashboard.cardHeaderRow}>
        <div>
          <h2 className={ui.cardTitle}>Matriks Penguasaan Kompetensi Terverifikasi</h2>
          <span className={ui.cardSub}>
            Pemetaan keahlian yang diekstrak langsung dari bukti proyek, transkrip wawancara, dan evaluasi HRD.
          </span>
        </div>
      </div>

      <div className={dashboard.competencyGrid}>
        {competencies.map((comp) => {
          const isNeedGrowth = comp.progress < 60;
          const tone = isNeedGrowth
            ? "var(--cat-orange)"
            : comp.progress >= 85
            ? "var(--cat-green)"
            : "var(--accent)";

          return (
            <div key={comp.name} className={dashboard.competencyCard}>
              <div className={dashboard.competencyHeader}>
                <span className={dashboard.compCategory}>{comp.category}</span>
                <Badge tone={tone}>{comp.level}</Badge>
              </div>

              <h3 className={dashboard.compTitle}>{comp.name}</h3>

              <div className={dashboard.compProgressWrap}>
                <div className={dashboard.compProgressBar}>
                  <div
                    className={dashboard.compProgressFill}
                    style={{
                      width: `${comp.progress}%`,
                      background: tone,
                    }}
                  />
                </div>
                <span className={dashboard.compPercent}>{comp.progress.toFixed(0)}%</span>
              </div>

              <div className={dashboard.compOrigin}>
                <span className={dashboard.compOriginLabel}>Sumber Bukti:</span>
                <span className={dashboard.compOriginText}>{comp.evidenceSrc}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
