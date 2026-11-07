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
  const { uploads, setUploadError, attemptCount, recording, stopRecording, stopStream, camera, videoRef } = media;
  const [phase, setPhase] = useState<InterviewPhase>("check");
  const [questionIndex, setQuestionIndex] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(ANSWER_SECONDS);
  const [completedSteps, setCompletedSteps] = useState<number>(0);
  const prePausePhase = useRef<InterviewPhase>("answer");

  // Deteksi kamera mati atau layar gelap/ditutupi jari/objek saat wawancara sungguhan
  useEffect(() => {
    if (!real || (phase !== "answer" && phase !== "paused_camera")) return;

    let canvas: HTMLCanvasElement | null = null;
    let ctx: CanvasRenderingContext2D | null = null;

    const checkInterval = window.setInterval(() => {
      // 1. Cek track video kamera aktif
      if (camera !== "on" || !videoRef.current || videoRef.current.paused || videoRef.current.ended) {
        if (phase === "answer") {
          prePausePhase.current = "answer";
          setPhase("paused_camera");
        }
        return;
      }

      // 2. Cek apakah kamera ditutupi (deteksi gelap / kamera ditutup jari atau stiker)
      try {
        const video = videoRef.current;
        if (video.videoWidth > 0 && video.videoHeight > 0) {
          if (!canvas) {
            canvas = document.createElement("canvas");
            canvas.width = 32;
            canvas.height = 24;
            ctx = canvas.getContext("2d", { willReadFrequently: true });
          }
          if (ctx) {
            ctx.drawImage(video, 0, 0, 32, 24);
            const imgData = ctx.getImageData(0, 0, 32, 24);
            const data = imgData.data;
            const count = data.length / 4;
            let sumBrightness = 0;
            let sumGreen = 0;
            let sumRed = 0;
            let sumBlue = 0;

            for (let i = 0; i < data.length; i += 4) {
              const r = data[i]!;
              const g = data[i + 1]!;
              const b = data[i + 2]!;
              sumRed += r;
              sumGreen += g;
              sumBlue += b;
              sumBrightness += (r + g + b) / 3;
            }

            const avgBrightness = sumBrightness / count;
            const avgR = sumRed / count;
            const avgG = sumGreen / count;
            const avgB = sumBlue / count;

            // Kamera ditutup terdeteksi bila:
            // a) Gelap gulita (avgBrightness < 35)
            // b) Ditutupi jari/kulit/benda dekat (kamera laptop jadi kecokelatan/merah pekat redup, misal R > G*1.4 dan brightness < 80)
            const isTooDark = avgBrightness < 35;
            const isFingerCovered = avgBrightness < 80 && avgR > avgG * 1.35 && avgR > avgB * 1.35;
            const isCovered = isTooDark || isFingerCovered;

            if (isCovered) {
              if (phase === "answer") {
                setPhase("paused_camera");
              }
            } else if (phase === "paused_camera") {
              // Pulih kembali saat wajah terlihat
              setPhase("answer");
            }
          }
        }
      } catch {
        // Fallback jika canvas terhambat security context
      }
    }, 800);

    return () => window.clearInterval(checkInterval);
  }, [real, phase, camera, videoRef]);

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
