"use client";

import { useState } from "react";
import { Button } from "../atoms/Button";
import { EmptyState } from "../molecules/EmptyState";
import { FeedbackRow } from "../molecules/FeedbackRow";
import { Panel } from "../molecules/Panel";
import { FeedbackDetail } from "./FeedbackDetail";
import type { FeedbackData } from "@/lib/data/student";
import app from "@/styles/app.module.css";
import rows from "@/styles/rows.module.css";

interface FeedbackLetterProps {
  feedbackList: FeedbackData[];
}

/** Feedback kompetensi tertulis yang diterima mahasiswa setelah keputusan HRD. */
export function FeedbackLetter({ feedbackList }: FeedbackLetterProps) {
  const [selectedId, setSelectedId] = useState(feedbackList[0]?.id);
  const current = feedbackList.find((feedback) => feedback.id === selectedId) ?? feedbackList[0];

  if (!current) {
    return (
      <EmptyState
        title="Belum ada feedback"
        img="undraw/empty"
        large
        action={<Button href="/mahasiswa/lamar">Cari lowongan</Button>}
      >
        Feedback muncul di sini setelah HRD meninjau lamaran kamu dan mengirim keputusannya.
      </EmptyState>
    );
  }

  return (
    <div className={app.stack} style={{ gap: 24 }}>
      <Panel title="Pilih feedback perusahaan" tag={`${feedbackList.length} feedback tersedia`} flush>
        <ul className={rows.list}>
          {feedbackList.map((feedback) => (
            <FeedbackRow key={feedback.id} feedback={feedback} selected={feedback.id === current.id} onSelect={() => setSelectedId(feedback.id)} />
          ))}
        </ul>
      </Panel>
      <FeedbackDetail feedback={current} />
    </div>
  );
}
