import { ArrowSquareOut, CheckCircle, Clock, Lightning } from "@phosphor-icons/react";
import { ILearningModule, ILearningDrill } from "@/lib/data/learning/types";
import { Badge } from "../atoms/Badge";
import { Button } from "../atoms/Button";
import { Tag } from "../atoms/Tag";
import { ChipList } from "../molecules/ChipList";
import app from "@/styles/app.module.css";
import dashboard from "@/styles/dashboard.module.css";
import ui from "@/styles/ui.module.css";

export interface LearningModuleCardProps {
  module: ILearningModule;
  relatedDrill?: ILearningDrill;
  onOpenDrill: (drill: ILearningDrill) => void;
}

/** Kartu modul belajar, satu keluarga dengan VacancyCard dan FeedbackCard. */
export function LearningModuleCard({ module, relatedDrill, onOpenDrill }: LearningModuleCardProps) {
  const isCompleted = module.status === "completed";

  return (
    <div className={`${app.jobCard} ${isCompleted ? app.jobCardDone : ""}`}>
      <div className={app.jobCardTop}>
        <div className={ui.btnRow}>
          <Tag>{module.category}</Tag>
          <span className={dashboard.difficultyBadge} data-difficulty={module.difficulty}>
            {module.difficulty}
          </span>
        </div>
        <span className={`${app.meta} ${dashboard.cellIcon}`}>
          <Clock size={14} aria-hidden /> {module.durationMinutes} mnt
        </span>
      </div>

      <div className={app.jobCardBody}>
        <div className={app.jobCardTitle}>
          <strong className={app.name} style={{ display: "block", fontSize: 20 }}>
            {module.title}
          </strong>
          <p className={app.meta} style={{ marginTop: 8, fontSize: 14 }}>
            {module.summary}
          </p>
        </div>

        <ChipList items={module.competenciesCovered} />

        <div className={app.jobCardCount}>
          <span className={dashboard.cellIcon}>
            <Lightning size={14} aria-hidden /> Poin kesiapan
          </span>
          <span className="num">+{module.estimatedGain} poin</span>
        </div>
      </div>

      <div className={app.jobCardFooter}>
        <div className={ui.btnRow}>
          {module.externalResourceUrl && (
            <Button href={module.externalResourceUrl} external size="sm" variant="ghost" icon={<ArrowSquareOut size={16} />}>
              Materi
            </Button>
          )}
          {!isCompleted && relatedDrill && (
            <Button size="sm" onClick={() => onOpenDrill(relatedDrill)} icon={<Lightning size={16} />}>
              Uji Drill (+{relatedDrill.readinessBoost})
            </Button>
          )}
        </div>
        {isCompleted && (
          <Badge tone="green">
            <CheckCircle size={14} weight="bold" /> Selesai
          </Badge>
        )}
        {module.status === "in_progress" && <Badge tone="cyan">Berjalan</Badge>}
      </div>
    </div>
  );
}

export default LearningModuleCard;
