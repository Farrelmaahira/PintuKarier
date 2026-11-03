"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Lightning } from "@phosphor-icons/react";
import { Button } from "../atoms/Button";
import { AnalysisProgress } from "../molecules/AnalysisProgress";
import { CandidateStats } from "../molecules/CandidateStats";
import { CategoryFilter } from "../molecules/CategoryFilter";
import { Notice } from "../molecules/Notice";
import { Panel } from "../molecules/Panel";
import { VacancySelect } from "../molecules/VacancySelect";
import { CandidateList } from "./CandidateList";
import { computeScore } from "@/lib/computeScore";
import type { Candidate } from "@/lib/data/candidate";
import { CATEGORIES } from "@/lib/data/scoring";
import type { Vacancy } from "@/lib/data/student";
import { useAnalysisRun } from "@/lib/hooks/useAnalysisRun";
import app from "@/styles/app.module.css";

interface ActiveCandidateBoardProps {
  vacancies: Vacancy[];
  activeVacancy: Vacancy;
  candidates: Candidate[];
}

/** Papan kandidat satu lowongan: statistik, filter kategori, tombol analisis, dan daftar peringkat. */
export function ActiveCandidateBoard({ vacancies, activeVacancy, candidates }: ActiveCandidateBoardProps) {
  const router = useRouter();
  const [filter, setFilter] = useState("Semua");
  const analysis = useAnalysisRun(activeVacancy.id);
  const ranked = [...candidates].sort((a, b) => computeScore(b.dimensions) - computeScore(a.dimensions));
  const visible = ranked.filter((candidate) => filter === "Semua" || candidate.category === filter);
  const filterOptions = [
    { label: "Semua", count: candidates.length, tone: "var(--ink)" },
    ...CATEGORIES.map((category) => ({
      label: category.name,
      count: candidates.filter((candidate) => candidate.category === category.name).length,
      tone: category.highlight,
    })),
  ];

  return (
    <Panel
      title={`Kandidat · ${activeVacancy.position}`}
      tag={activeVacancy.company}
      actions={
        <Button size="sm" onClick={analysis.run} loading={analysis.running} disabled={analysis.running} icon={<Lightning size={18} />}>
          Jalankan analisis
        </Button>
      }
      flush
    >
      {vacancies.length > 1 && (
        // `lowongan` adalah nama parameter di URL (/hrd?lowongan=...).
        <VacancySelect vacancies={vacancies} value={activeVacancy.id} onChange={(id) => router.push(`/hrd?lowongan=${encodeURIComponent(id)}`)} />
      )}
      <CandidateStats applicants={activeVacancy.applicants} candidates={candidates} />
      <div className={app.toolbar}>
        <CategoryFilter value={filter} onChange={setFilter} options={filterOptions} />
      </div>
      {analysis.message && (
        <div className={app.toolbar}>
          <Notice tone={analysis.message.tone}>{analysis.message.text}</Notice>
        </div>
      )}
      {analysis.running ? (
        <AnalysisProgress step={analysis.step} />
      ) : (
        <CandidateList visible={visible} ranked={ranked} totalCount={candidates.length} />
      )}
    </Panel>
  );
}
