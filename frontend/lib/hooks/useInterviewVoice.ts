"use client";

import { useCallback, useEffect } from "react";
import { useUniversalTts } from "./useUniversalTts";

export interface UseInterviewVoiceOptions {
  question: string;
  recording: boolean;
  defaultAutoRead?: boolean;
  enabled?: boolean;
}

export interface UseInterviewVoiceReturn {
  supported: boolean;
  isSpeaking: boolean;
  rate: number;
  autoRead: boolean;
  voiceGender: string;
  speak: (text: string) => void;
  toggleSpeak: () => void;
  stop: () => void;
  setRate: (rate: number) => void;
  setAutoRead: (enabled: boolean) => void;
  setVoiceGender: (gender: string) => void;
}

/** Hook untuk mengintegrasikan Text-To-Speech universal dengan siklus pertanyaan interview. */
export function useInterviewVoice(options: UseInterviewVoiceOptions): UseInterviewVoiceReturn {
  const { question, recording, defaultAutoRead = true, enabled = true } = options;

  const {
    supported,
    isSpeaking,
    rate,
    autoRead,
    voiceGender,
    speak,
    stop,
    setRate,
    setAutoRead,
    setVoiceGender,
  } = useUniversalTts({ defaultAutoRead });

  // Hentikan suara seketika saat kandidat mulai merekam jawaban atau dinonaktifkan
  useEffect(() => {
    if (recording || !enabled) {
      stop();
    }
  }, [recording, enabled, stop]);

  // Otomatis bacakan soal saat pertanyaan berubah hanya jika fase menjawab aktif dan tidak sedang merekam
  useEffect(() => {
    if (enabled && autoRead && !recording && question) {
      speak(question);
    }
    return () => {
      stop();
    };
  }, [enabled, question, autoRead, recording, speak, stop]);

  const toggleSpeak = useCallback(() => {
    if (isSpeaking) {
      stop();
    } else if (question) {
      speak(question);
    }
  }, [isSpeaking, question, speak, stop]);

  return {
    supported,
    isSpeaking,
    rate,
    autoRead,
    voiceGender,
    speak,
    toggleSpeak,
    stop,
    setRate,
    setAutoRead,
    setVoiceGender,
  };
}
