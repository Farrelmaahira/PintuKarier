"use client";

import { useEffect, useRef, useState } from "react";
import { InterviewVideo } from "../molecules/InterviewVideo";
import { InterviewChecklist } from "./InterviewChecklist";
import { InterviewFinished } from "./InterviewFinished";
import { InterviewProgress } from "./InterviewProgress";
import { InterviewQuestion } from "./InterviewQuestion";
import { Panel } from "../molecules/Panel";
import { PracticeResult } from "./PracticeResult";
import { PracticeSetupPanel } from "./PracticeSetupPanel";
import { UploadRetryPanel } from "./UploadRetryPanel";
import { PRACTICE_STEPS, PRACTICE_VACANCY, REAL_STEPS } from "@/lib/data/interview";
import { generatePracticeQuestions } from "@/lib/data/interviewPractice";
import type { StudentAccount } from "@/lib/data/student";
import type { QuestionAnalysisResult } from "@/lib/analysis/autoCorrector";
import { useInterviewFlow } from "@/lib/hooks/useInterviewFlow";
import { useInterviewMedia } from "@/lib/hooks/useInterviewMedia";
import { useInterviewTranscript } from "@/lib/hooks/useInterviewTranscript";
import { useInterviewVoice } from "@/lib/hooks/useInterviewVoice";
import app from "@/styles/app.module.css";
import shell from "@/styles/shell.module.css";

export interface InterviewRoomProps {
  vacancy?: { position: string; company: string };
  /** Pertanyaan lowongan dari API; mode latihan memakai pertanyaan contoh atau bank soal. */
  questions?: string[];
  /** Wajib di mode real: jawaban direkam dan diunggah ke lamaran ini. */
  applicationId?: string;
  onFinish?: () => void;
  mode?: "real" | "practice";
  profile?: StudentAccount | null;
}

/** Halaman AI Interview: pertanyaan, kontrol suara, indikator perekaman, dan status proses atau evaluasi instan. */
export function InterviewRoom({
  vacancy = PRACTICE_VACANCY,
  questions,
  applicationId,
  onFinish,
  mode = "real",
  profile,
}: InterviewRoomProps = {}) {
  const real = mode === "real" && Boolean(applicationId);
  const steps = real ? REAL_STEPS : PRACTICE_STEPS;

  const [selectedCategory, setSelectedCategory] = useState<string>("profile");
  const [practiceQuestions, setPracticeQuestions] = useState<string[]>(() =>
    generatePracticeQuestions("profile", {
      name: profile?.name,
      studyProgram: profile?.studyProgram,
      semester: profile?.semester,
      campus: profile?.campus,
    }),
  );

  const activeQuestions = real ? (questions ?? practiceQuestions) : practiceQuestions;

  const [voiceRate, setVoiceRate] = useState<number>(1.0);
  const [evaluatedAnalyses, setEvaluatedAnalyses] = useState<QuestionAnalysisResult[] | null>(null);
  const onRecordingCompleteRef = useRef<(idx: number, blob: Blob) => void>(() => {});
  const media = useInterviewMedia(applicationId, real, (idx, blob) => onRecordingCompleteRef.current(idx, blob));
  const flow = useInterviewFlow(media, real, steps, activeQuestions.length, voiceRate);
  const { phase, questionIndex } = flow;

  const voice = useInterviewVoice({
    question: activeQuestions[questionIndex] ?? "",
    recording: media.recording,
    enabled: phase === "answer",
  });

  const transcriptTracker = useInterviewTranscript({
    recording: media.recording,
    questionIndex,
  });

  // Saat rekaman vokal satu nomor selesai, transkripsikan audio rekaman secara otomatis
  useEffect(() => {
    onRecordingCompleteRef.current = async (idx: number, blob: Blob) => {
      if (!blob || blob.size === 0) return;
      try {
        const formData = new FormData();
        formData.append("audio", blob, `jawaban-${idx + 1}.webm`);
        const res = await fetch("/api/transcribe", {
          method: "POST",
          body: formData,
        });
        if (res.ok) {
          const data = (await res.json()) as { text?: string };
          if (data.text?.trim()) {
            transcriptTracker.setTranscript(idx, data.text.trim());
          }
        }
      } catch (err) {
        console.warn("Auto-transcription error:", err);
      }
    };
  }, [transcriptTracker]);

  // Pada fase pemrosesan, transkripsikan dan picu evaluasi AI Groq di latar belakang
  useEffect(() => {
    if (phase !== "processing" || mode !== "practice") return;

    activeQuestions.forEach(async (_, idx) => {
      if (!transcriptTracker.transcripts[idx]) {
        const blob = media.recordings.current[idx];
        if (blob && blob.size > 0) {
          try {
            const formData = new FormData();
            formData.append("audio", blob, `jawaban-${idx + 1}.webm`);
            const res = await fetch("/api/transcribe", {
              method: "POST",
              body: formData,
            });
            if (res.ok) {
              const data = (await res.json()) as { text?: string };
              if (data.text?.trim()) {
                transcriptTracker.setTranscript(idx, data.text.trim());
              }
            }
          } catch (err) {
            console.warn("Processing transcription error:", err);
          }
        }
      }
    });

    let active = true;
    fetch("/api/interview/evaluate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: activeQuestions.map((q, idx) => ({
          questionIndex: idx,
          questionText: q,
          transcript: transcriptTracker.transcripts[idx] || "",
        })),
      }),
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (active && data?.analyses && Array.isArray(data.analyses)) {
          setEvaluatedAnalyses(data.analyses);
        }
      })
      .catch((err) => console.warn("Background AI evaluation error:", err));

    return () => {
      active = false;
    };
  }, [phase, mode, activeQuestions, media.recordings, transcriptTracker]);

  const TEST_VOICE_TEXT = "Halo, saya teman latihan wawancaramu hari ini. Semoga sukses!";

  // Pre-warm audio di background saat halaman terbuka (soal Pria & Wanita, serta sampel Uji Suara)
  useEffect(() => {
    if (typeof window === "undefined" || phase !== "check") return;

    // 1. Pre-warm sampel uji suara (Pria & Wanita)
    fetch(`/api/tts?text=${encodeURIComponent(TEST_VOICE_TEXT)}&gender=pria`).catch(() => {});
    fetch(`/api/tts?text=${encodeURIComponent(TEST_VOICE_TEXT)}&gender=wanita`).catch(() => {});

    // 2. Pre-warm semua pertanyaan aktif untuk gender yang sedang dipilih maupun alternatifnya
    const genders = [voice.voiceGender, voice.voiceGender === "pria" ? "wanita" : "pria"];
    genders.forEach((g) => {
      activeQuestions.forEach((q) => {
        if (q) {
          fetch(`/api/tts?text=${encodeURIComponent(q)}&gender=${encodeURIComponent(g)}`).catch(() => {});
        }
      });
    });
  }, [activeQuestions, voice.voiceGender, phase]);

  const handleShuffle = () => {
    voice.stop();
    transcriptTracker.resetTranscripts();
    setEvaluatedAnalyses(null);
    const nextQuestions = generatePracticeQuestions(selectedCategory, {
      name: profile?.name,
      studyProgram: profile?.studyProgram,
      semester: profile?.semester,
      campus: profile?.campus,
    });
    setPracticeQuestions(nextQuestions);
  };

  const handleSelectCategory = (catId: string) => {
    voice.stop();
    transcriptTracker.resetTranscripts();
    setEvaluatedAnalyses(null);
    setSelectedCategory(catId);
    const nextQuestions = generatePracticeQuestions(catId, {
      name: profile?.name,
      studyProgram: profile?.studyProgram,
      semester: profile?.semester,
      campus: profile?.campus,
    });
    setPracticeQuestions(nextQuestions);
  };

  const handleTestVoice = () => {
    if (voice.isSpeaking) {
      voice.stop();
    } else {
      voice.speak(TEST_VOICE_TEXT);
    }
  };

  const handleRetryPractice = () => {
    setEvaluatedAnalyses(null);
    transcriptTracker.resetTranscripts();
    handleShuffle();
    flow.restart();
  };

  return (
    <div className={shell.split}>
      <div className={app.stack}>
        <InterviewVideo
          videoRef={media.videoRef}
          camera={media.camera}
          phase={phase}
          recording={media.recording}
          seconds={flow.seconds}
          questionIndex={questionIndex}
          questionCount={activeQuestions.length}
        />

        {phase === "check" && mode === "practice" && (
          <PracticeSetupPanel
            camera={media.camera}
            selectedCategory={selectedCategory}
            profile={profile}
            voiceGender={voice.voiceGender}
            rate={voiceRate}
            autoRead={voice.autoRead}
            isSpeaking={voice.isSpeaking}
            onSelectCategory={handleSelectCategory}
            onShuffle={handleShuffle}
            onSelectVoiceGender={voice.setVoiceGender}
            onSelectRate={(r) => {
              setVoiceRate(r);
              voice.setRate(r);
            }}
            onToggleAutoRead={voice.setAutoRead}
            onTestVoice={handleTestVoice}
            onTurnOnCamera={media.turnOnCamera}
            onStart={() => flow.setPhase("answer")}
          />
        )}

        {phase === "check" && mode === "real" && (
          <InterviewChecklist
            camera={media.camera}
            real={real}
            onTurnOnCamera={media.turnOnCamera}
            onStart={() => flow.setPhase("answer")}
          />
        )}

        {phase === "answer" && (
          <InterviewQuestion
            question={activeQuestions[questionIndex]!}
            index={questionIndex}
            isLast={questionIndex === activeQuestions.length - 1}
            seconds={flow.seconds}
            recording={media.recording}
            micError={media.micError}
            voice={voice}
            onStart={() => media.startRecording(questionIndex)}
            onNext={flow.next}
          />
        )}

        {phase === "processing" && (
          <>
            {media.uploadError ? (
              <UploadRetryPanel error={media.uploadError} onRetry={media.retryUploads} />
            ) : (
              <Panel title="AI Sedang Menganalisis Jawabanmu..." tag="Evaluasi Berjalan">
                <div style={{ padding: "16px 20px", display: "grid", gap: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span
                      style={{
                        width: 14,
                        height: 14,
                        borderRadius: "50%",
                        border: "2px solid var(--accent)",
                        borderTopColor: "transparent",
                        display: "inline-block",
                        animation: "spin 1s linear infinite",
                      }}
                    />
                    <strong style={{ fontSize: 14, color: "var(--ink)" }}>
                      Tahap {Math.min(flow.completedSteps + 1, steps.length)} dari {steps.length}: {steps[flow.completedSteps] || "Menyusun evaluasi akhir..."}
                    </strong>
                  </div>
                  <p className={app.meta} style={{ margin: 0 }}>
                    Sistem sedang memverifikasi artikulasi vokal, menyaring gumaman, dan memetakan respon ke metode STAR & 5 dimensi kompetensi.
                  </p>
                </div>
              </Panel>
            )}
          </>
        )}

        {phase === "done" && mode === "practice" && (
          <PracticeResult
            questions={activeQuestions}
            transcripts={transcriptTracker.transcripts}
            evaluatedAnalyses={evaluatedAnalyses ?? undefined}
            onRetry={handleRetryPractice}
          />
        )}

        {phase === "done" && mode === "real" && (
          <InterviewFinished company={vacancy.company} onFinish={onFinish} />
        )}
      </div>

      <InterviewProgress
        title={mode === "practice" ? "Mode Latihan Mandiri" : "Status proses"}
        tag={mode === "practice" ? "Latihan Mandiri" : vacancy.position}
        phase={phase}
        questionCount={activeQuestions.length}
        questionIndex={questionIndex}
        steps={steps}
        completedSteps={flow.completedSteps}
      />
    </div>
  );
}
