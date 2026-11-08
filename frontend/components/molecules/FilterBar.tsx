import type { ReactNode } from "react";
import { LabeledSegmented } from "./LabeledSegmented";
import { SearchField } from "./SearchField";
import ui from "@/styles/ui.module.css";

export interface FilterGroup {
  title: string;
  /** Opsi pertama dianggap default ("Semua"). */
  options: string[];
  value: string;
  onChange: (value: string) => void;
  counts?: Record<string, number>;
}

interface FilterBarProps {
  search?: { value: string; onChange: (v: string) => void; placeholder: string };
  groups?: FilterGroup[];
  /** Tombol aksi di kanan kolom pencarian (mis. "Tambah"). */
  actions?: ReactNode;
  shown: number;
  total: number;
  noun: string;
  /** Kembalikan pencarian dan semua grup ke default. */
  onReset: () => void;
}

/** Pencarian + filter kategori + ringkasan hasil dengan reset, dipakai seragam di halaman daftar dashboard. */
export function FilterBar({ search, groups = [], actions, shown, total, noun, onReset }: FilterBarProps) {
  const dirty = Boolean(search?.value.trim()) || groups.some((g) => g.value !== g.options[0]);

  return (
    <div className={ui.filterBar}>
      {(search || actions) && (
        <div className={ui.toolbar}>
          {search ? <SearchField {...search} /> : <span />}
          {actions}
        </div>
      )}

      {groups.length > 0 && (
        <div className={ui.filterGroups}>
          {groups.map((g) => (
            <LabeledSegmented key={g.title} title={g.title} label={g.title} options={g.options} counts={g.counts} value={g.value} onChange={g.onChange} />
          ))}
        </div>
      )}

      <div className={ui.filterSummary} aria-live="polite">
        <span>
          Menampilkan {shown} dari {total} {noun}
        </span>
        {dirty && (
          <button type="button" className={ui.linkBtn} onClick={onReset}>
            Reset filter
          </button>
        )}
      </div>
    </div>
  );
}
