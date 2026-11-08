interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  /** Kata benda pada ringkasan, mis. "lowongan". */
  label?: string;
  /** Tanpa bingkai samping; untuk di dalam Panel flush. */
  flush?: boolean;
}

import app from "@/styles/app.module.css";

export function Pagination({ currentPage, totalPages, totalItems, itemsPerPage, onPageChange, label = "lowongan", flush }: PaginationProps) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className={`${app.pagination} ${flush ? app.paginationFlush : ""}`}>
      <div className={app.pageInfo}>
        Menampilkan {startItem}–{endItem} dari {totalItems} {label}
      </div>

      <div className={app.pageNav} role="navigation" aria-label="Navigasi halaman">
        <button
          type="button"
          className={app.pageBtn}
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          aria-label="Halaman sebelumnya"
        >
          Prev
        </button>

        {Array.from({ length: totalPages }).map((_, i) => {
          const p = i + 1;
          const isCurrent = p === currentPage;
          if (totalPages > 7 && Math.abs(p - currentPage) > 2 && p !== 1 && p !== totalPages) {
            if (p === 2 || p === totalPages - 1) {
              return (
                <span key={p} className={app.pageBtn} style={{ opacity: 0.5, cursor: "default" }}>
                  …
                </span>
              );
            }
            return null;
          }
          return (
            <button
              key={p}
              type="button"
              className={app.pageBtn}
              onClick={() => onPageChange(p)}
              aria-current={isCurrent ? "page" : undefined}
            >
              {p}
            </button>
          );
        })}

        <button
          type="button"
          className={app.pageBtn}
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          aria-label="Halaman berikutnya"
        >
          Next
        </button>
      </div>
    </div>
  );
}
