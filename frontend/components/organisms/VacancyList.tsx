"use client";

import { useState } from "react";
import { CategoryFilter } from "../molecules/CategoryFilter";
import { EmptyState } from "../molecules/EmptyState";
import { FilterMenu } from "../molecules/FilterMenu";
import { Pagination } from "../molecules/Pagination";
import { VacancyCard } from "../molecules/VacancyCard";
import type { VacancySummary } from "@/lib/data/student";
import app from "@/styles/app.module.css";

type VacancyStatusFilter = "Aktif" | "Ditutup" | "Semua status";
type VacancyTypeFilter = "Semua tipe" | "Magang" | "Full-time" | "Kontrak";
const STATUS_OPTIONS = ["Aktif", "Ditutup", "Semua status"];
const TYPE_OPTIONS = ["Semua tipe", "Magang", "Full-time", "Kontrak"];
const ITEMS_PER_PAGE = 9;
const TYPES = [
  { label: "Magang", tone: "var(--cat-lilac)" },
  { label: "Full-time", tone: "var(--cat-green)" },
  { label: "Kontrak", tone: "var(--cat-yellow)" },
] as const;

interface VacancyListProps {
  vacancies: VacancySummary[];
}

/** Daftar lowongan dengan filter kategori + menu Filter dan paginasi; kartu mengarah ke alur lamar. */
export function VacancyList({ vacancies }: VacancyListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [category, setCategory] = useState("Aktif");
  const [statusFilter, setStatusFilter] = useState<VacancyStatusFilter>("Aktif");
  const [typeFilter, setTypeFilter] = useState<VacancyTypeFilter>("Semua tipe");

  const isClosed = (v: VacancySummary) => v.deadline === "Ditutup";
  const filtered = vacancies.filter((v) => {
    const matchesStatus = statusFilter === "Semua status" || (statusFilter === "Aktif" ? !isClosed(v) : isClosed(v));
    return matchesStatus && (typeFilter === "Semua tipe" || v.type === typeFilter);
  });
  const pageItems = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const categoryOptions = [
    { label: "Aktif", count: vacancies.filter((v) => !isClosed(v)).length, tone: "var(--ink)" },
    ...TYPES.map(({ label, tone }) => ({ label, tone, count: vacancies.filter((v) => v.type === label && !isClosed(v)).length })),
    { label: "Ditutup", count: vacancies.filter(isClosed).length, tone: "var(--cat-orange)" },
  ];

  function handleCategoryChange(value: string) {
    setCategory(value);
    setStatusFilter(value === "Ditutup" ? "Ditutup" : "Aktif");
    setTypeFilter(value === "Aktif" || value === "Ditutup" ? "Semua tipe" : (value as VacancyTypeFilter));
    setCurrentPage(1);
  }

  function handleAdvancedFilter(filters: { status: VacancyStatusFilter; type: VacancyTypeFilter }) {
    setStatusFilter(filters.status);
    setTypeFilter(filters.type);
    // Kombinasi yang tidak punya tombol kategori membuat tak satu pun tombol menyala.
    setCategory(filters.type === "Semua tipe" && filters.status !== "Semua status" ? filters.status : "");
    setCurrentPage(1);
  }

  return (
    <div className={app.stack} style={{ gap: 24 }}>
      <div className={app.listHead}>
        <div className={app.listHeadText}>
          <h2 className={app.listTitle}>Daftar Lowongan Tersedia</h2>
          <p className={app.meta} style={{ marginTop: 4 }}>
            Pilih salah satu lowongan untuk mulai proses seleksi dan unggah CV kamu.
          </p>
        </div>
        <CategoryFilter options={categoryOptions} value={category} onChange={handleCategoryChange} action={
            <FilterMenu
              fields={[
                { key: "status", title: "Status", options: STATUS_OPTIONS },
                { key: "type", title: "Tipe pekerjaan", options: TYPE_OPTIONS },
              ]}
              values={{ status: statusFilter, type: typeFilter }}
              onApply={(v) => handleAdvancedFilter({ status: v.status as VacancyStatusFilter, type: v.type as VacancyTypeFilter })}
            />
          } />
      </div>
      {filtered.length ? (
        <>
          <div className={app.jobGrid}>
            {pageItems.map((vacancy) => (
              <VacancyCard key={vacancy.id} vacancy={vacancy} />
            ))}
          </div>
          <Pagination currentPage={currentPage} totalPages={Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE))} totalItems={filtered.length} itemsPerPage={ITEMS_PER_PAGE} onPageChange={setCurrentPage} />
        </>
      ) : (
        <EmptyState title="Belum ada lowongan" img="undraw/empty" large>
          Lowongan dari mitra bakal muncul di sini.
        </EmptyState>
      )}
    </div>
  );
}
