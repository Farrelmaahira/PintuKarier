"use client";

import { useState } from "react";
import { CategoryFilter } from "../molecules/CategoryFilter";
import { ALL_TYPES, DateFilter, EMPTY_RANGE, type DateRange } from "../molecules/DateFilter";
import { EmptyState } from "../molecules/EmptyState";
import { Pagination } from "../molecules/Pagination";
import { Panel } from "../molecules/Panel";
import { VacancyRow } from "../molecules/VacancyRow";
import type { VacancySummary } from "@/lib/data/student";
import rows from "@/styles/rows.module.css";
import ui from "@/styles/ui.module.css";

const ITEMS_PER_PAGE = 5;
const TYPES = [
  { label: "Magang", tone: "var(--cat-green)" },
  { label: "Full-time", tone: "var(--cat-lilac)" },
  { label: "Kontrak", tone: "var(--cat-yellow)" },
];

interface VacanciesPanelProps {
  vacancies: VacancySummary[];
  appliedIds: Set<string>;
}

/** Lowongan dari pusat karier: filter tipe + rentang tanggal, 5 per halaman; yang sudah dilamar diberi penanda. */
export function VacanciesPanel({ vacancies, appliedIds }: VacanciesPanelProps) {
  const [page, setPage] = useState(1);
  const [range, setRange] = useState<DateRange>(EMPTY_RANGE);
  const type = range.type;
  const options = [
    { label: ALL_TYPES, count: vacancies.length, tone: "var(--ink)" },
    ...TYPES.map(({ label, tone }) => ({ label, tone, count: vacancies.filter((v) => v.type === label).length })),
  ];
  // Lowongan tanpa batas lamar tidak punya tanggal, jadi tersaring keluar saat rentang diisi.
  const inRange = (date?: string) => (!range.from && !range.to) || (Boolean(date) && (!range.from || date! >= range.from) && (!range.to || date! <= range.to));
  const visible = vacancies.filter((v) => (type === ALL_TYPES || v.type === type) && inRange(v.deadlineDate));
  const totalPages = Math.max(1, Math.ceil(visible.length / ITEMS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = visible.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <Panel title="Lowongan dari pusat karier" flush>
      {vacancies.length > 0 && (
        <div className={ui.panelToolbar}>
          <CategoryFilter
            value={type}
            options={options}
            onChange={(value) => {
              setRange({ ...range, type: value });
              setPage(1);
            }}
            action={
              <DateFilter
                value={range}
                types={TYPES.map(({ label }) => label)}
                onApply={(next) => {
                  setRange(next);
                  setPage(1);
                }}
              />
            }
          />
        </div>
      )}
      {visible.length ? (
        <>
          <ul className={rows.list}>
            {pageItems.map((vacancy) => (
              <VacancyRow key={vacancy.id} vacancy={vacancy} applied={appliedIds.has(vacancy.id)} />
            ))}
          </ul>
          {totalPages > 1 && <Pagination flush label="lowongan" currentPage={currentPage} totalPages={totalPages} totalItems={visible.length} itemsPerPage={ITEMS_PER_PAGE} onPageChange={setPage} />}
        </>
      ) : (
        <EmptyState title={vacancies.length ? `Belum ada lowongan${type === ALL_TYPES ? "" : ` ${type}`}` : "Belum ada lowongan"} img="undraw/empty" large>
          {vacancies.length ? "Coba kategori atau tanggal lain." : "Lowongan dari mitra bakal muncul di sini."}
        </EmptyState>
      )}
    </Panel>
  );
}
