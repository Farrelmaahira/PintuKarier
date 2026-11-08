"use client";

import { useState, useTransition } from "react";
import { Button } from "../atoms/Button";
import { Field } from "../molecules/Field";
import { Notice } from "../molecules/Notice";
import { submitPrescreening } from "@/lib/actions/submitPrescreening";
import app from "@/styles/app.module.css";

interface PreScreeningProps {
  applicationId: string;
  questions: string[];
  onNext: () => void;
}

/** Pertanyaan pre-screening dari lowongan; semua wajib diisi. */
export function PreScreening({ applicationId, questions, onNext }: PreScreeningProps) {
  const [answers, setAnswers] = useState(() => questions.map(() => ""));
  const [tried, setTried] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sending, startSending] = useTransition();
  const valid = answers.every((answer) => answer.trim().length >= 2);

  return (
    <form
      className={app.stack}
      onSubmit={(event) => {
        event.preventDefault();
        setTried(true);
        if (!valid) return;
        startSending(async () => {
          setError(null);
          const result = await submitPrescreening(applicationId, answers);
          if (!result.ok) return setError(result.error);
          onNext();
        });
      }}
      noValidate
    >
      {questions.map((question, index) => (
        <Field
          key={question}
          label={`${index + 1}. ${question}`}
          value={answers[index]!}
          placeholder="Tulis jawaban singkat kamu"
          onChange={(value) => setAnswers(answers.map((answer, position) => (position === index ? value : answer)))}
          error={tried && answers[index]!.trim().length < 2 ? "Jawab dulu yang ini ya." : null}
        />
      ))}
      {error && <Notice tone="error">{error}</Notice>}
      <div className={app.row}>
        <Button type="submit" loading={sending} disabled={sending}>
          Kirim jawaban
        </Button>
      </div>
    </form>
  );
}
