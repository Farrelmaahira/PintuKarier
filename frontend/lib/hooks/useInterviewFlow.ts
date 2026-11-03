"use client";

import { useEffect, useRef, useState } from "react";
import { ANSWER_SECONDS, type InterviewPhase } from "../data/interview";
import type { useInterviewMedia } from "./useInterviewMedia";

type Media = ReturnType<typeof useInterviewMedia>;

/** Alur fase interview: pertanyaan berurutan, hitung mundur proporsional, lalu simulasi analisis realistis. */
export function useInterviewFlow(
  media: Media,
  real: boolean,
  steps: string[],
  questionCount: number,
  rate: number = 1.0,
) {
  const { uploads, setUploadError, attemptCount, recording, stopRecording, stopStream } = media;
  const [phase, setPhase] = useState<InterviewPhase>("check");
  const [questionIndex, setQuestionIndex] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(ANSWER_SECONDS);
  const [completedSteps, setCompletedSteps] = useState<number>(0);

  const next = () => {
    stopRecording();
    setSeconds(ANSWER_SECONDS);
    if (questionIndex < questionCount - 1) {
      setQuestionIndex(questionIndex + 1);
      return;
    }
    stopStream();
    setPhase("processing");
  };

  const restart = () => {
    setPhase("check");
    setQuestionIndex(0);
    setCompletedSteps(0);
    setSeconds(ANSWER_SECONDS);
  };

  const nextRef = useRef(next);
  useEffect(() => {
    nextRef.current = next;
  });

  // Mode real: tunggu semua rekaman terunggah, transkripsi lanjut di background.
  useEffect(() => {
    if (phase !== "processing" || !real) return;
    let cancelled = false;
    Promise.all(uploads.current)
      .then(() => !cancelled && (setCompletedSteps(steps.length), setPhase("done")))
      .catch((e: unknown) => !cancelled && setUploadError(e instanceof Error ? e.message : "Upload rekaman gagal."));
    return () => {
      cancelled = true;
    };
  }, [phase, real, steps.length, attemptCount, uploads, setUploadError]);

  // Hitung mundur selama merekam (interval beradaptasi dengan kecepatan bicara yang dipilih)
  useEffect(() => {
    if (!recording) return;
    const intervalMs = Math.max(500, Math.min(2000, Math.round(1000 / (rate || 1.0))));
    const interval = window.setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          nextRef.current();
          return ANSWER_SECONDS;
        }
        return prev - 1;
      });
    }, intervalMs);
    return () => window.clearInterval(interval);
  }, [recording, rate]);

  // Mode latihan: proses analisis bertahap yang realistis (~1.7 detik per tahap, tahap akhir evaluasi AI diperpanjang ~3.5 detik)
  useEffect(() => {
    if (phase !== "processing" || real) return;
    const isLastStep = completedSteps >= steps.length - 2;
    const delayMs = isLastStep ? 3500 : 1700;
    const timer = window.setTimeout(() => {
      setCompletedSteps((prev) => {
        if (prev >= steps.length - 1) {
          setPhase("done");
          return prev;
        }
        return prev + 1;
      });
    }, delayMs);
    return () => window.clearTimeout(timer);
  }, [phase, real, steps.length, completedSteps]);

  return { phase, setPhase, questionIndex, seconds, completedSteps, next, restart };
}
