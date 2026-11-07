"use client";

import { ArrowClockwise } from "@phosphor-icons/react";
import { useEffect, useMemo, useState } from "react";
import { Badge } from "../atoms/Badge";
import { Button } from "../atoms/Button";
import { ScoreBox } from "../atoms/ScoreBox";
import { DimensionBars } from "../molecules/DimensionBars";
import { EvaluationNote } from "../molecules/EvaluationNote";
import { Notice } from "../molecules/Notice";
import { Panel } from "../molecules/Panel";
import {
  analyzeQuestionAnswer,
  type QuestionAnalysisResult,
} from "@/lib/analysis/autoCorrector";
import app from "@/styles/app.module.css";

export interface PracticeResultProps {
  questions: string[];
  transcripts?: string[];
  evaluatedAnalyses?: QuestionAnalysisResult[];
  onRetry: () => void;
}

/** Hasil evaluasi instan di mode latihan, dilengkapi transkrip jawaban, deteksi gumaman, dan evaluasi mendalam Groq AI. */
export function PracticeResult({
  questions,
  transcripts = [],
  evaluatedAnalyses,
  onRetry,
}: PracticeResultProps) {
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState<number>(0);

  const fallbackAnalyses: QuestionAnalysisResult[] = useMemo(() => {
    return questions.map((q, idx) => {
      const userTranscript = transcripts[idx] || "";
      return analyzeQuestionAnswer(idx, q, userTranscript);
    });
  }, [questions, transcripts]);

  const [aiAnalyses, setAiAnalyses] = useState<QuestionAnalysisResult[] | null>(null);
  const [aiStatus, setAiStatus] = useState<"evaluating" | "groq" | "gemini" | "local">("evaluating");

  const analyses = evaluatedAnalyses && evaluatedAnalyses.length > 0
    ? evaluatedAnalyses
    : aiAnalyses && aiAnalyses.length > 0
    ? aiAnalyses
    : fallbackAnalyses;

  const effectiveStatus = evaluatedAnalyses && evaluatedAnalyses.length > 0 ? "groq" : aiStatus;

  useEffect(() => {
    if (evaluatedAnalyses && evaluatedAnalyses.length > 0) return;

    let active = true;

    async function evaluateWithAi() {
      try {
        const res = await fetch("/api/interview/evaluate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: questions.map((q, idx) => ({
              questionIndex: idx,
              questionText: q,
              transcript: transcripts[idx] || "",
            })),
          }),
        });

        if (!res.ok) throw new Error("Gagal evaluasi via AI");
        const data = await res.json();

        if (active && Array.isArray(data.analyses) && data.analyses.length > 0) {
          setAiAnalyses(data.analyses);
          setAiStatus(data.provider || "groq");
        }
      } catch (err) {
        if (active) {
          console.warn("AI evaluate fallback to local:", err);
          setAiStatus("local");
        }
      }
    }

    evaluateWithAi();

    return () => {
      active = false;
    };
  }, [questions, transcripts, evaluatedAnalyses]);

  const currentAnalysis = analyses[selectedQuestionIndex] || analyses[0];

  const overallFluency = useMemo(() => {
    if (analyses.length === 0) return 70;
    const sum = analyses.reduce((acc, curr) => acc + curr.fluencyScore, 0);
    return Math.round(sum / analyses.length);
  }, [analyses]);

  const dimensionAverages: readonly number[] = useMemo(() => {
    if (analyses.length === 0) return [70, 70, 70, 70, 70];
    const totals = [0, 0, 0, 0, 0];
    for (const a of analyses) {
      const scores = a.dimensionScores || [70, 70, 70, 70, 70];
      for (let i = 0; i < 5; i++) {
        totals[i] += scores[i] ?? 70;
      }
    }
    return totals.map((t) => Math.round(t / analyses.length));
  }, [analyses]);

  const hasPassiveAnswer = analyses.some((a) => a.isPassiveOrNegative);

  return (
    <Panel title="Hasil Evaluasi Latihan AI Interview" tag="Instan Feedback & Koreksi" flush>
      <div style={{ padding: 20, display: "grid", gap: 20 }}>
        {hasPassiveAnswer ? (
          <Notice tone="error">
            Perhatian Evaluasi: Jawabanmu terdeteksi mengandung respon pasif atau penolakan kolaborasi tim. Dalam seleksi kerja nyata, ini merupakan resiko diskualifikasi tinggi. Pelajari rekomendasi STAR di bawah untuk memperbaiki responmu!
          </Notice>
        ) : (
          <Notice tone="success">
            Simulasi latihan interview selesai! AI telah menganalisis rekaman vokal, transkrip, dan struktur jawabanmu.
          </Notice>
        )}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            flexWrap: "wrap",
            padding: 16,
            background: "var(--surface-warm)",
            border: "1px solid var(--border)",
            borderRadius: "6px",
          }}
        >
          <ScoreBox
            value={overallFluency}
            tone={overallFluency < 50 ? "orange" : overallFluency < 75 ? "none" : "accent"}
            big
          />
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <strong style={{ fontSize: 18 }}>
                {overallFluency < 50
                  ? `Skor Kelayakan: ${overallFluency} / 100 (Perlu Evaluasi Sikap)`
                  : overallFluency < 75
                  ? `Skor Kesiapan: ${overallFluency} / 100 (Cukup - Perlu Diperkuat)`
                  : `Skor Kesiapan: ${overallFluency} / 100 (Siap Seleksi)`}
              </strong>
              <Badge tone={overallFluency < 50 ? "orange" : "accent"}>
                {overallFluency < 50 ? "Red Flag: Perlu Perbaikan" : "Metode STAR"}
              </Badge>
              {effectiveStatus === "local" && (
                <Badge tone="settled">⚡ Analisis Cepat (Offline)</Badge>
              )}
            </div>
            <p className={app.meta} style={{ marginTop: 4 }}>
              {overallFluency < 50
                ? "Respon belum memenuhi standar profesional karena minimnya bukti inisiatif atau keengganan kolaborasi. Tinjau rekomendasi STAR di bawah untuk panduan jawaban yang tepat."
                : "Jawaban telah diproses oleh modul Auto-Corrector untuk menyaring gumaman dan merapikan struktur ke bahasa profesional."}
            </p>
          </div>
        </div>

        <div>
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Capaian 5 Dimensi Penilaian:</h3>
          <DimensionBars values={dimensionAverages} />
        </div>

        {/* Modul Transkrip & Auto-Corrector Per Pertanyaan */}
        <div style={{ borderTop: "1px solid var(--border)", paddingTop: 18, display: "grid", gap: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>
              Transkrip & Rekomendasi Jawaban (Auto-Corrector):
            </h3>
            <span style={{ fontSize: 13, color: "var(--text-subtle)" }}>
              Pilih pertanyaan untuk melihat perbaikan:
            </span>
          </div>

          {/* Tab Selector Pertanyaan */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {questions.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedQuestionIndex(idx)}
                style={{
                  padding: "6px 14px",
                  borderRadius: "4px",
                  border: selectedQuestionIndex === idx ? "1px solid var(--ink)" : "1px solid var(--border)",
                  background: selectedQuestionIndex === idx ? "var(--ink)" : "var(--surface)",
                  color: selectedQuestionIndex === idx ? "#ffffff" : "var(--ink)",
                  fontSize: 13,
                  fontWeight: selectedQuestionIndex === idx ? 600 : 500,
                  cursor: "pointer",
                }}
              >
                Soal #{idx + 1}
              </button>
            ))}
          </div>

          {currentAnalysis && (
            <div
              style={{
                display: "grid",
                gap: 14,
                padding: 16,
                borderRadius: "6px",
                border: "1px solid var(--border)",
                background: "var(--surface-raised)",
              }}
            >
              <div>
                <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-subtle)", textTransform: "uppercase" }}>
                  Pertanyaan #{currentAnalysis.questionIndex + 1}:
                </span>
                <p style={{ margin: "4px 0 0", fontSize: 14, fontWeight: 500, color: "var(--ink)" }}>
                  {currentAnalysis.questionText}
                </p>
              </div>

              {/* Transkrip Asli */}
              <div style={{ display: "grid", gap: 6 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>Transkrip Rekaman Asli:</span>
                  <Badge tone={currentAnalysis.fillerCount > 3 ? "orange" : "none"}>
                    {currentAnalysis.fillerCount} Kata Gumaman (Filler)
                  </Badge>
                </div>
                <div
                  style={{
                    padding: "10px 12px",
                    borderRadius: "4px",
                    background: "var(--bg)",
                    border: "1px solid var(--border)",
                    fontSize: 13,
                    lineHeight: 1.5,
                    color: "var(--ink)",
                    fontStyle: "italic",
                  }}
                >
                  &ldquo;{currentAnalysis.rawTranscript}&rdquo;
                </div>
              </div>

              {/* Draf Jawaban Rekomendasi (Auto-Corrector & STAR) dengan Teks Putih Kontras Tinggi */}
              <div style={{ display: "grid", gap: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>
                  Rekomendasi Jawaban Rapi (Metode STAR & Bahasa Profesional):
                </span>
                <div
                  style={{
                    display: "grid",
                    gap: 12,
                    padding: 16,
                    borderRadius: "6px",
                    background: "#0f172a",
                    border: "1px solid #334155",
                    color: "#ffffff",
                  }}
                >
                  {currentAnalysis.starSections.map((sec) => (
                    <div key={sec.label} style={{ display: "flex", gap: 12, fontSize: 13, lineHeight: 1.6 }}>
                      <span
                        style={{
                          width: 26,
                          height: 26,
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: "4px",
                          background: "#2563eb",
                          color: "#ffffff",
                          fontSize: 13,
                          fontWeight: 700,
                          flexShrink: 0,
                        }}
                      >
                        {sec.label}
                      </span>
                      <div style={{ flex: 1 }}>
                        <div style={{ color: "#ffffff", fontWeight: 700, fontSize: 13 }}>
                          {sec.title}:
                        </div>
                        <p style={{ margin: "4px 0 0", color: "#ffffff", fontSize: 13, lineHeight: 1.6 }}>
                          {sec.content}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Evaluasi Instan Per Soal */}
              <div style={{ display: "grid", gap: 8, marginTop: 4 }}>
                <EvaluationNote color="var(--cat-green)" title="✓ Kelebihan respon:">
                  {currentAnalysis.strengths}
                </EvaluationNote>
                <EvaluationNote color="var(--cat-orange)" title="! Tips pengasahan respon:">
                  {currentAnalysis.improvementTips}
                </EvaluationNote>
              </div>
            </div>
          )}
        </div>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 8 }}>
          <Button onClick={onRetry} icon={<ArrowClockwise size={20} />}>
            Ulangi Latihan Interview
          </Button>
          <Button href="/mahasiswa/lamar" variant="ghost">
            Lanjut Lamar Posisi
          </Button>
        </div>
      </div>
    </Panel>
  );
}
