"use client";

import { useState } from "react";
import { Badge } from "../atoms/Badge";
import { EmptyState } from "../molecules/EmptyState";
import { Pagination } from "../molecules/Pagination";
import { VacancyCard } from "../molecules/VacancyCard";
import type { VacancySummary } from "@/lib/data/student";
import app from "@/styles/app.module.css";

const ITEMS_PER_PAGE = 9;

interface VacancyListProps {
  vacancies: VacancySummary[];
}

/** Daftar lowongan terbuka dengan paginasi; kartu mengarah ke alur lamar. */
export function VacancyList({ vacancies }: VacancyListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const pageItems = vacancies.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const openCount = vacancies.filter((vacancy) => vacancy.deadline !== "Ditutup").length;

  return (
    <div className={app.stack} style={{ gap: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 500, letterSpacing: "-0.03em", margin: 0 }}>Daftar Lowongan Tersedia</h2>
          <p className={app.meta} style={{ marginTop: 4 }}>
            Pilih salah satu lowongan untuk mulai proses seleksi dan unggah CV kamu.
          </p>
        </div>
        <Badge tone="accent">{openCount} lowongan aktif</Badge>
      </div>
      {vacancies.length ? (
        <>
          <div className={app.jobGrid}>
            {pageItems.map((vacancy) => (
              <VacancyCard key={vacancy.id} vacancy={vacancy} />
            ))}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={Math.max(1, Math.ceil(vacancies.length / ITEMS_PER_PAGE))}
            totalItems={vacancies.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setCurrentPage}
          />
        </>
      ) : (
        <EmptyState title="Belum ada lowongan" img="undraw/empty" large>
          Lowongan dari mitra bakal muncul di sini.
        </EmptyState>
      )}
    </div>
  );
}
