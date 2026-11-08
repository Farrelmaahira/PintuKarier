"use client";

import { useMemo, useState } from "react";
import { Button } from "../atoms/Button";
import { CategoryFilter } from "../molecules/CategoryFilter";
import { EmptyState } from "../molecules/EmptyState";
import { FeedbackCard } from "../molecules/FeedbackCard";
import { FilterMenu } from "../molecules/FilterMenu";
import { ALL } from "@/lib/filters";
import type { FeedbackData } from "@/lib/data/student";
import { CATEGORY_TONE, TONE_COLOR } from "@/lib/tone";
import app from "@/styles/app.module.css";

const CATEGORIES = Object.keys(CATEGORY_TONE) as FeedbackData["category"][];

interface FeedbackLetterProps {
  feedbackList: FeedbackData[];
}

/** Daftar feedback kompetensi: filter kategori + menu Filter, sama seperti daftar lowongan; kartu membuka halaman detail. */
export function FeedbackLetter({ feedbackList }: FeedbackLetterProps) {
  const [category, setCategory] = useState(ALL);
  const [company, setCompany] = useState(ALL);

  const companies = useMemo(() => [ALL, ...Array.from(new Set(feedbackList.map((f) => f.company)))], [feedbackList]);
  const options = [
    { label: ALL, count: feedbackList.length, tone: "var(--ink)" },
    ...CATEGORIES.map((label) => ({
      label,
      count: feedbackList.filter((f) => f.category === label).length,
      tone: TONE_COLOR[CATEGORY_TONE[label]!] ?? "var(--accent)",
    })),
  ];
  const visible = feedbackList.filter((f) => (category === ALL || f.category === category) && (company === ALL || f.company === company));

  if (!feedbackList.length) {
    return (
      <EmptyState title="Belum ada feedback" img="undraw/empty" large action={<Button href="/mahasiswa/lamar">Cari lowongan</Button>}>
        Feedback muncul di sini setelah HRD meninjau lamaran kamu dan mengirim keputusannya.
      </EmptyState>
    );
  }

  return (
    <div className={app.stack} style={{ gap: 24 }}>
      <div className={app.listHead}>
        <div className={app.listHeadText}>
          <h2 className={app.listTitle}>Pilih feedback perusahaan</h2>
          <p className={app.meta} style={{ marginTop: 4 }}>
            Pilih salah satu feedback untuk membaca isinya.
          </p>
        </div>
        <CategoryFilter
          options={options}
          value={category}
          onChange={setCategory}
          action={<FilterMenu fields={[{ key: "company", title: "Perusahaan", options: companies }]} values={{ company }} onApply={(v) => setCompany(v.company)} />}
        />
      </div>
      {visible.length ? (
        <div className={app.jobGrid}>
          {visible.map((feedback) => (
            <FeedbackCard key={feedback.id} feedback={feedback} />
          ))}
        </div>
      ) : (
        <EmptyState title="Tidak ada feedback yang cocok" img="undraw/empty" large>
          Coba kategori atau perusahaan lain.
        </EmptyState>
      )}
    </div>
  );
}
