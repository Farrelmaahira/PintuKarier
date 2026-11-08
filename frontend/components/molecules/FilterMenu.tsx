"use client";

import { useState } from "react";
import { LabeledSegmented } from "./LabeledSegmented";
import ui from "@/styles/ui.module.css";

export interface FilterField<K extends string> {
  key: K;
  title: string;
  /** Opsi pertama dianggap default ("Semua"). */
  options: string[];
}

interface FilterMenuProps<K extends string> {
  fields: FilterField<K>[];
  values: Record<K, string>;
  onApply: (values: Record<K, string>) => void;
}

/** Tombol Filter dengan popover pilihan lanjutan; dipakai di samping CategoryFilter. */
export function FilterMenu<K extends string>({ fields, values, onApply }: FilterMenuProps<K>) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(values);

  return (
    <div className={ui.filterWrap}>
      <button
        type="button"
        className={ui.filterBtn}
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => {
          if (!open) setDraft(values);
          setOpen((current) => !current);
        }}
      >
        Filter
      </button>
      {open && (
        <div className={ui.filterPop} role="dialog" aria-label="Filter">
          {fields.map((f) => (
            <LabeledSegmented key={f.key} title={f.title} label={f.title} options={f.options} value={draft[f.key]} onChange={(v) => setDraft({ ...draft, [f.key]: v })} />
          ))}
          <button
            type="button"
            className={`${ui.filterPopBtn} ${ui.filterPopPrimary}`}
            onClick={() => {
              onApply(draft);
              setOpen(false);
            }}
          >
            Terapkan filter
          </button>
        </div>
      )}
    </div>
  );
}
