"use client";

import { useState } from "react";
import { EyeSlash } from "@phosphor-icons/react";
import { CompetencyRankingPanel } from "../molecules/CompetencyRankingPanel";
import { EmptyState } from "../molecules/EmptyState";
import { LabeledSegmented } from "../molecules/LabeledSegmented";
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
    <div className={app.stack} style={{ gap: 24 }}>
      <div className={app.filters}>
        <LabeledSegmented title="Periode rekrutmen" label="Periode" options={periods} value={period} onChange={setPeriod} />
        <LabeledSegmented title="Jenis posisi" label="Jenis posisi" options={POSITIONS} value={position} onChange={setPosition} />
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
