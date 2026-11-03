"use client";

import { useState, useTransition } from "react";
import { PaperPlaneTilt } from "@phosphor-icons/react";
import { Badge } from "../atoms/Badge";
import { Button } from "../atoms/Button";
import { DecisionSentPanel } from "../molecules/DecisionSentPanel";
import { Field } from "../molecules/Field";
import { LabeledSegmented } from "../molecules/LabeledSegmented";
import { Notice } from "../molecules/Notice";
import { Panel } from "../molecules/Panel";
import { submitDecision } from "@/lib/actions/submitDecision";
import type { Candidate } from "@/lib/data/candidate";
import { CATEGORIES } from "@/lib/data/scoring";
import { CATEGORY_TONE } from "@/lib/tone";
import app from "@/styles/app.module.css";

const DECISIONS = ["Belum diputuskan", "Lolos", "Belum lolos"];

interface CandidateReviewProps {
  candidate: Candidate;
}

/** Panel keputusan HRD: koreksi kategori AI, tetapkan keputusan, edit draf feedback, lalu kirim. */
export function CandidateReview({ candidate }: CandidateReviewProps) {
  const aiCategory = candidate.aiCategory ?? candidate.category;
  const [category, setCategory] = useState<string>(candidate.category);
  const [reason, setReason] = useState(candidate.correctionReason ?? "");
  const [decision, setDecision] = useState<string>(candidate.decision);
  const [feedback, setFeedback] = useState(candidate.feedback);
  const [sent, setSent] = useState(Boolean(candidate.feedbackSent));
  const [tried, setTried] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sending, startSending] = useTransition();

  const corrected = category !== aiCategory;
  const reasonError = corrected && reason.trim().length < 10 ? "Tulis alasan koreksinya, minimal 10 karakter." : null;
  const feedbackError = feedback.trim().length < 30 ? "Feedback-nya kependekan, minimal 30 karakter." : null;
  const canSend = decision !== "Belum diputuskan";

  const send = () => {
    setTried(true);
    if (reasonError || feedbackError) return;
    startSending(async () => {
      setError(null);
      const result = await submitDecision(candidate.id, { category, reason, decision, feedback });
      if (!result.ok) return setError(result.error);
      setSent(true);
    });
  };

  if (sent) return <DecisionSentPanel firstName={candidate.name.split(" ")[0]!} decision={decision} feedback={feedback} />;

  return (
    <Panel title="Keputusan & feedback" tag="Keputusan akhir di tangan HRD">
      <div className={app.stack}>
        <span className={app.meta}>
          Rekomendasi AI: <Badge tone={CATEGORY_TONE[aiCategory]}>{aiCategory}</Badge>
        </span>
        <LabeledSegmented title="Kategori menurut kamu" label="Kategori" options={CATEGORIES.map((item) => item.name)} value={category} onChange={setCategory} />
        {corrected && (
          <Field
            label="Kenapa dikoreksi?"
            value={reason}
            onChange={setReason}
            multiline
            placeholder="Misal: portofolio GitHub nunjukin pengalaman testing yang nggak kebaca di CV."
            helper="Koreksi kamu dipakai buat ngukur kesesuaian AI dengan keputusan HRD."
            error={tried ? reasonError : null}
          />
        )}
        <LabeledSegmented title="Keputusan" label="Keputusan" options={DECISIONS} value={decision} onChange={setDecision} />
        <Field
          label="Draft feedback (disusun AI, silakan edit)"
          value={feedback}
          onChange={setFeedback}
          multiline
          helper={`${feedback.length} karakter. Mahasiswa nerima ini apa adanya, jadi pastiin nadanya enak dibaca.`}
          error={tried ? feedbackError : null}
        />
        {error && <Notice tone="error">{error}</Notice>}
        <Button disabled={!canSend || sending} loading={sending} icon={<PaperPlaneTilt size={22} />} onClick={send}>
          {canSend ? "Tetapkan & kirim feedback" : "Pilih keputusan dulu"}
        </Button>
      </div>
    </Panel>
  );
}
