import { Clock, ArrowSquareOut, Lightning, CheckCircle } from "@phosphor-icons/react";
import { ILearningModule, ILearningDrill } from "@/lib/data/learning/types";
import dashboard from "@/styles/dashboard.module.css";

export interface LearningModuleCardProps {
  module: ILearningModule;
  relatedDrill?: ILearningDrill;
  onOpenDrill: (drill: ILearningDrill) => void;
}

export function LearningModuleCard({
  module,
  relatedDrill,
  onOpenDrill,
}: LearningModuleCardProps) {
  const isCompleted = module.status === "completed";

  return (
    <div className={dashboard.moduleCard} data-status={module.status}>
      <div className={dashboard.cardTopBadges}>
        <span className={dashboard.categoryBadge}>{module.category}</span>
        <span className={dashboard.difficultyBadge}>{module.difficulty}</span>
        <span className={dashboard.durationBadge}>
          <Clock size={12} weight="bold" /> {module.durationMinutes} mnt
        </span>
      </div>

      <h3 className={dashboard.moduleTitle}>{module.title}</h3>
      <p className={dashboard.moduleSummary}>{module.summary}</p>

      <div className={dashboard.moduleCompetencies}>
        <span className={dashboard.compLabel}>Kompetensi:</span>
        <div className={dashboard.compList}>
          {module.competenciesCovered.map((comp) => (
            <span key={comp} className={dashboard.compPill}>
              {comp}
            </span>
          ))}
        </div>
      </div>

      <div className={dashboard.moduleFooter}>
        <div className={dashboard.gainIndicator}>
          <Lightning size={14} weight="fill" color="var(--cat-orange)" />
          <span>+{module.estimatedGain} Poin Kesiapan</span>
        </div>

        <div className={dashboard.moduleActions}>
          {module.externalResourceUrl && (
            <a
              href={module.externalResourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={dashboard.btnExternal}
              title="Baca Dokumentasi / Materi"
            >
              Materi <ArrowSquareOut size={14} weight="bold" />
            </a>
          )}

          {relatedDrill && !isCompleted && (
            <button
              type="button"
              className={dashboard.btnDrill}
              onClick={() => onOpenDrill(relatedDrill)}
            >
              Uji Drill (+{relatedDrill.readinessBoost})
            </button>
          )}

          {isCompleted && (
            <span className={dashboard.completedBadge}>
              <CheckCircle size={14} weight="bold" /> Selesai
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default LearningModuleCard;
