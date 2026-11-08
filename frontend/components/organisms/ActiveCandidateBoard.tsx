"use client";

import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { Lightning } from "@phosphor-icons/react";
import { Button } from "../atoms/Button";
import { AnalysisProgress } from "../molecules/AnalysisProgress";
import { CategoryFilter } from "../molecules/CategoryFilter";
import { FilterMenu } from "../molecules/FilterMenu";
import { Notice } from "../molecules/Notice";
import { Pagination } from "../molecules/Pagination";
import { Panel } from "../molecules/Panel";
import { VacancySelect } from "../molecules/VacancySelect";
import { CandidateList } from "./CandidateList";
import { computeScore } from "@/lib/computeScore";
import type { Candidate } from "@/lib/data/candidate";
import { CATEGORIES } from "@/lib/data/scoring";
import type { Vacancy } from "@/lib/data/student";
import { useAnalysisRun } from "@/lib/hooks/useAnalysisRun";
import ui from "@/styles/ui.module.css";

const ITEMS_PER_PAGE = 5;
const ALL = "Semua";
const DECISIONS = [ALL, "Belum diputuskan", "Lolos", "Belum lolos"];
/** Bukan kategori skor: kandidat yang CV-nya berisi instruksi tersembunyi, apa pun skornya. */
const WARNINGS = [ALL, "Prompt injection"];

interface ActiveCandidateBoardProps {
  vacancies: Vacancy[];
  activeVacancy: Vacancy;
  candidates: Candidate[];
  /** Tombol tambahan di sebelah "Jalankan analisis", mis. "Buat lowongan". */
  extraActions?: ReactNode;
}

/** Papan kandidat satu lowongan: filter kategori, tombol analisis, dan daftar peringkat. */
export function ActiveCandidateBoard({ vacancies, activeVacancy, candidates, extraActions }: ActiveCandidateBoardProps) {
  const router = useRouter();
  const [filter, setFilter] = useState(ALL);
  const [page, setPage] = useState(1);
  const [decision, setDecision] = useState(ALL);
  const [warning, setWarning] = useState(ALL);
  const analysis = useAnalysisRun(activeVacancy.id);
  const ranked = [...candidates].sort((a, b) => computeScore(b.dimensions) - computeScore(a.dimensions));
  const visible = ranked.filter(
    (candidate) =>
      (filter === ALL || candidate.category === filter) &&
      (decision === ALL || candidate.decision === decision) &&
      (warning === ALL || Boolean(candidate.warning)),
  );
  const totalPages = Math.max(1, Math.ceil(visible.length / ITEMS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = visible.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const filterOptions = [
    { label: ALL, count: candidates.length, tone: "var(--ink)" },
    ...CATEGORIES.map((category) => ({
      label: category.name,
      count: candidates.filter((candidate) => candidate.category === category.name).length,
      tone: category.highlight,
    })),
  ];

  return (
    <Panel
      title={activeVacancy.company}
      actions={
        <div className={ui.btnRow}>
          {extraActions}
          <Button size="sm" onClick={analysis.run} loading={analysis.running} disabled={analysis.running} icon={<Lightning size={18} />}>
            Jalankan analisis
          </Button>
        </div>
      }
      flush
    >
      {vacancies.length > 1 && (
        // `lowongan` adalah nama parameter di URL (/hrd?lowongan=...).
        <VacancySelect vacancies={vacancies} value={activeVacancy.id} onChange={(id) => router.push(`/hrd?lowongan=${encodeURIComponent(id)}`)} />
      )}
      <div className={ui.panelToolbar}>
        <CategoryFilter
          value={filter}
          onChange={(value) => {
            setFilter(value);
            setPage(1);
          }}
          options={filterOptions}
          action={
            <FilterMenu
              fields={[
                { key: "decision", title: "Keputusan HRD", options: DECISIONS },
                { key: "warning", title: "Peringatan", options: WARNINGS },
              ]}
              values={{ decision, warning }}
              onApply={(v) => {
                setDecision(v.decision);
                setWarning(v.warning);
                setPage(1);
              }}
            />
          }
        />
      </div>
      {analysis.message && (
        <div className={ui.panelToolbar}>
          <Notice tone={analysis.message.tone}>{analysis.message.text}</Notice>
        </div>
      )}
      {analysis.running ? (
        <AnalysisProgress step={analysis.step} />
      ) : (
        <>
          <CandidateList visible={pageItems} ranked={ranked} totalCount={candidates.length} />
          {totalPages > 1 && <Pagination flush label="kandidat" currentPage={currentPage} totalPages={totalPages} totalItems={visible.length} itemsPerPage={ITEMS_PER_PAGE} onPageChange={setPage} />}
        </>
      )}
    </Panel>
  );
}
