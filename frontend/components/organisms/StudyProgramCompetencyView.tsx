"use client";

import { useState } from "react";
import { EyeSlash } from "@phosphor-icons/react";
import { CompetencyRankingPanel } from "../molecules/CompetencyRankingPanel";
import { EmptyState } from "../molecules/EmptyState";
import { CategoryFilter } from "../molecules/CategoryFilter";
import { FilterMenu } from "../molecules/FilterMenu";
import { Panel } from "../molecules/Panel";
import { Stat } from "../molecules/Stat";
import { StatGrid } from "../molecules/StatGrid";
import { FollowUpNotes } from "./FollowUpNotes";
import { comparePeriods } from "@/lib/comparePeriods";
import { POSITIONS } from "@/lib/data/studyProgram/info";
import type { FollowUpNote, Ranking } from "@/lib/data/studyProgram/types";
import app from "@/styles/app.module.css";
import shell from "@/styles/shell.module.css";

const MIN_CANDIDATES = 10;
const TONES = ["var(--cat-green)", "var(--cat-lilac)", "var(--cat-yellow)", "var(--cat-cyan)", "var(--cat-orange)"];

interface StudyProgramCompetencyViewProps {
  ranking: Ranking;
  notes: FollowUpNote[];
  studyProgramId: string;
  studyProgramName: string;
}

/** Analisis kompetensi Prodi: filter periode dan posisi, peringkat, dan catatan tindak lanjut. */
export function StudyProgramCompetencyView({ ranking, notes, studyProgramId, studyProgramName }: StudyProgramCompetencyViewProps) {
  const periods = Object.keys(ranking).sort(comparePeriods);
  const [period, setPeriod] = useState(periods[0] ?? "");
  const [position, setPosition] = useState(POSITIONS[0]!);
  const positionOptions = POSITIONS.map((label, i) => ({
    label,
    count: ranking[period]?.[label]?.count ?? 0,
    tone: i === 0 ? "var(--ink)" : TONES[(i - 1) % TONES.length]!,
  }));
  const notesProps = { notes, studyProgramId, studyProgramName };

  if (!periods.length) {
    return (
      <div className={shell.split}>
        <Panel title="Kompetensi yang paling sering kurang">
          <EmptyState title="Data belum cukup" img="undraw/empty" large>
            <EyeSlash size={16} aria-hidden /> Ranking muncul setelah minimal {MIN_CANDIDATES} mahasiswa {studyProgramName} dinilai di satu periode, biar nggak ada
            individu yang bisa dikenali.
          </EmptyState>
        </Panel>
        <FollowUpNotes competencies={[]} {...notesProps} />
      </div>
    );
  }

  const group = ranking[period]?.[position];
  const previousPeriod = periods[periods.indexOf(period) + 1];
  const previousGroup = previousPeriod ? ranking[previousPeriod]?.[position] : undefined;
  const candidateCount = ranking[period]?.["Semua posisi"]?.count ?? 0;
  const previousCount = previousPeriod ? (ranking[previousPeriod]?.["Semua posisi"]?.count ?? null) : null;
  const change = previousCount ? ` (${candidateCount >= previousCount ? "+" : ""}${candidateCount - previousCount})` : "";

  return (
    <div className={shell.stack}>
      <div className={app.listHead}>
        <div className={app.listHeadText}>
          <h2 className={app.listTitle}>Analisis Kompetensi</h2>
          <p className={app.meta} style={{ marginTop: 4 }}>
            Pilih jenis posisi untuk melihat kompetensi yang paling sering kurang pada periode {period}.
          </p>
        </div>
        <CategoryFilter
          value={position}
          onChange={setPosition}
          options={positionOptions}
          action={<FilterMenu fields={[{ key: "period", title: "Periode rekrutmen", options: periods }]} values={{ period }} onApply={(v) => setPeriod(v.period)} />}
        />
      </div>
      <Panel flush>
        <StatGrid cols={4}>
          <Stat label="Kandidat dianalisis" value={`${candidateCount}${change}`} />
          <Stat label="Kompetensi terpantau" value={group?.items.length ?? 0} />
          <Stat label="Periode tersedia" value={periods.length} />
          <Stat label="Catatan tindak lanjut" value={notes.length} />
        </StatGrid>
      </Panel>
      <div className={shell.split}>
        <CompetencyRankingPanel period={period} position={position} group={group} previousGroup={previousGroup} minCandidates={MIN_CANDIDATES} />
        <FollowUpNotes competencies={group ? group.items.map(([name]) => name) : []} {...notesProps} />
      </div>
    </div>
  );
}
