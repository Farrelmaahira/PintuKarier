"use client";

import { useState } from "react";
import { Field } from "./Field";
import { LabeledSegmented } from "./LabeledSegmented";
import ui from "@/styles/ui.module.css";

export interface DateRange {
  /** Tanggal ISO (YYYY-MM-DD); kosong berarti tanpa batas di sisi itu. */
  from: string;
  to: string;
  /** Pilihan dari `types`; ALL_TYPES berarti tanpa penyaringan tipe. */
  type: string;
}

export const ALL_TYPES = "Semua";
export const EMPTY_RANGE: DateRange = { from: "", to: "", type: ALL_TYPES };

interface DateFilterProps {
  value: DateRange;
  onApply: (range: DateRange) => void;
  /** Pilihan tipe pekerjaan; kosongkan untuk filter tanggal saja. */
  types?: string[];
  label?: string;
}

/** Tombol Filter dengan popover rentang tanggal; menyala saat ada rentang aktif. */
export function DateFilter({ value, onApply, types, label = "Filter" }: DateFilterProps) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(value);
  const active = Boolean(value.from || value.to || value.type !== ALL_TYPES);

  return (
    <div className={ui.filterWrap}>
      <button
        type="button"
        className={`${ui.filterBtn} ${active ? ui.filterBtnActive : ""}`}
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => {
          if (!open) setDraft(value);
          setOpen((current) => !current);
        }}
      >
        {label}
      </button>
      {open && (
        <div className={ui.filterPop} role="dialog" aria-label="Filter lowongan">
          {types && <LabeledSegmented title="Tipe pekerjaan" label="Tipe pekerjaan" options={[ALL_TYPES, ...types]} value={draft.type} onChange={(type) => setDraft({ ...draft, type })} />}
          <Field label="Batas lamar dari" type="date" value={draft.from} onChange={(from) => setDraft({ ...draft, from })} />
          <Field label="Sampai" type="date" value={draft.to} onChange={(to) => setDraft({ ...draft, to })} />
          <div className={ui.filterPopActions}>
            <button
              type="button"
              className={ui.filterPopBtn}
              onClick={() => {
                onApply(EMPTY_RANGE);
                setOpen(false);
              }}
            >
              Atur ulang
            </button>
            <button
              type="button"
              className={`${ui.filterPopBtn} ${ui.filterPopPrimary}`}
              onClick={() => {
                onApply(draft);
                setOpen(false);
              }}
            >
              Terapkan
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
