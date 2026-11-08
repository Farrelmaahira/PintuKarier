import { ReadinessProfile } from "@/lib/data/readiness/types";
import { CATEGORY_TONE, READY_THRESHOLD, scoreTone, TONE_COLOR } from "@/lib/tone";
import { Badge } from "../atoms/Badge";
import { Meter } from "../atoms/Meter";
import { ScoreBox } from "../atoms/ScoreBox";
import { Panel } from "../molecules/Panel";
import { SelectField } from "../molecules/SelectField";
import { Stat } from "../molecules/Stat";
import { StatGrid } from "../molecules/StatGrid";
import ui from "@/styles/ui.module.css";

export interface ReadinessScoreOverviewProps {
  profile: ReadinessProfile;
  availablePositions: readonly string[];
  selectedPosition: string;
  onPositionChange: (position: string) => void;
}

export function ReadinessScoreOverview({ profile, availablePositions, selectedPosition, onPositionChange }: ReadinessScoreOverviewProps) {
  const score = profile.overallScore;
  const tone = CATEGORY_TONE[profile.overallCategory] ?? scoreTone(score);
  const gap = READY_THRESHOLD - score;
  const dims = [...(profile.dimensions ?? [])].sort((a, b) => b.score - a.score);
  const potential = (profile.actionRecommendations ?? []).reduce((sum, r) => sum + r.potentialUp, 0);

  return (
    <Panel title="Indeks Kesiapan Kerja" tag={profile.targetPosition} flush>
      <div className={ui.readyHero}>
        <ScoreBox value={Math.round(score)} tone={tone} big />
        <div className={ui.readyHeroText}>
          <Badge tone={tone}>{profile.overallCategory}</Badge>
          <p className={ui.readyHeroLead}>
            {gap > 0 ? (
              <>
                <strong>{gap.toFixed(1)} poin lagi</strong> menuju ambang seleksi kerja ({READY_THRESHOLD}).
              </>
            ) : (
              <>Skor kamu sudah melewati ambang seleksi kerja ({READY_THRESHOLD}).</>
            )}
          </p>
        </div>
        <SelectField
          label="Posisi sasaran karier"
          value={selectedPosition}
          onChange={onPositionChange}
          options={availablePositions.map((p) => ({ value: p, label: p }))}
        />
      </div>

      <div className={ui.thresholdTrack}>
        <Meter value={score} label="Indeks kesiapan" tone={TONE_COLOR[tone]} />
        <span className={ui.thresholdTick} style={{ left: `calc(20px + (100% - 40px) * ${READY_THRESHOLD / 100})` }} aria-hidden />
        <span className={ui.thresholdLabel} style={{ left: `calc(20px + (100% - 40px) * ${READY_THRESHOLD / 100})` }}>
          Ambang {READY_THRESHOLD}
        </span>
      </div>

      <StatGrid cols={3}>
        <Stat label="Indeks kesiapan" value={<span className={ui.statText}>{`${score.toFixed(1)} / 100`}</span>} />
        <Stat label="Dimensi terkuat" value={<span className={ui.statText}>{dims[0]?.name ?? "-"}</span>} />
        <Stat label="Potensi kenaikan" value={<span className={ui.statText}>{`+${potential} poin`}</span>} />
      </StatGrid>
    </Panel>
  );
}
