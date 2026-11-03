import { EyeSlash } from "@phosphor-icons/react/dist/ssr";
import { CompetencyRow } from "./CompetencyRow";
import { EmptyState } from "./EmptyState";
import { Panel } from "./Panel";
import { COURSE_BY_COMPETENCY } from "@/lib/data/studyProgram/info";
import type { RankingGroup } from "@/lib/data/studyProgram/types";
import app from "@/styles/app.module.css";

interface CompetencyRankingPanelProps {
  period: string;
  position: string;
  group?: RankingGroup;
  previousGroup?: RankingGroup;
  minCandidates: number;
}

/** Peringkat kompetensi yang paling sering kurang untuk satu periode dan posisi. */
export function CompetencyRankingPanel({ period, position, group, previousGroup, minCandidates }: CompetencyRankingPanelProps) {
  return (
    <Panel
      title="Kompetensi yang paling sering kurang"
      tag={`${period} · ${position}`}
      actions={group && <span className={app.meta}>% dari {group.count} kandidat</span>}
      flush
    >
      {!group ? (
        <EmptyState title="Data disembunyikan" img="undraw/empty" large>
          <EyeSlash size={16} aria-hidden /> Kelompok ini belum punya {minCandidates} kandidat. Di bawah itu data nggak ditampilkan biar nggak ada individu yang
          bisa dikenali.
        </EmptyState>
      ) : group.items.length ? (
        <ol className={app.comps} key={`${period}-${position}`} data-reveal-row>
          {group.items.map(([name, percent], index) => (
            <CompetencyRow
              key={name}
              rank={index + 1}
              name={name}
              percent={percent}
              previous={previousGroup ? previousGroup.items.find(([previousName]) => previousName === name)?.[1] : null}
              course={COURSE_BY_COMPETENCY[name]}
            />
          ))}
        </ol>
      ) : (
        <EmptyState title="Semua syarat terpenuhi" img="undraw/empty" large>
          Belum ada kompetensi yang kurang di kelompok ini. Mantap.
        </EmptyState>
      )}
    </Panel>
  );
}
