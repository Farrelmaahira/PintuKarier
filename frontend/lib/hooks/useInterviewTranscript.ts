"use client";

import { useEffect, useRef, useState } from "react";

export interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

export interface SpeechRecognitionResultItem {
  isFinal: boolean;
  [index: number]: SpeechRecognitionAlternative;
}

export interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResultItem;
  [index: number]: SpeechRecognitionResultItem;
}

export interface SpeechRecognitionEventLike extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

export interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onstart: (() => void) | null;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: Event) => void) | null;
  onend: (() => void) | null;
}

export interface SpeechRecognitionConstructor {
  new (): SpeechRecognitionInstance;
}

export interface UseInterviewTranscriptOptions {
  recording: boolean;
  questionIndex: number;
}

export interface UseInterviewTranscriptReturn {
  transcripts: string[];
  currentTranscript: string;
  isTranscribing: boolean;
  setTranscript: (index: number, text: string) => void;
  resetTranscripts: () => void;
}

/** Hook untuk merekam transkrip suara lokal di background secara hening dan persisten per nomor pertanyaan. */
export function useInterviewTranscript(options: UseInterviewTranscriptOptions): UseInterviewTranscriptReturn {
  const { recording, questionIndex } = options;
  const [transcripts, setTranscripts] = useState<string[]>([]);
  const [interimTranscript, setInterimTranscript] = useState<string>("");
  const [isTranscribing, setIsTranscribing] = useState<boolean>(false);

  const questionIndexRef = useRef<number>(questionIndex);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const accumulatedRef = useRef<string>("");

  useEffect(() => {
    questionIndexRef.current = questionIndex;
    accumulatedRef.current = transcripts[questionIndex] || "";
  }, [questionIndex, transcripts]);

  // Siklus hidup pengenalan suara per sesi merekam agar tidak terjadi konflik transisi antar soal di browser
  useEffect(() => {
    if (!recording) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // Abaikan jika sudah berhenti
        }
        recognitionRef.current = null;
      }
      return;
    }

    if (typeof window === "undefined") return;

    const SpeechRec =
      (window as unknown as { SpeechRecognition?: SpeechRecognitionConstructor }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: SpeechRecognitionConstructor }).webkitSpeechRecognition;

    if (!SpeechRec) return;

    let active = true;

    try {
      const recognition = new SpeechRec();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "id-ID";

      recognition.onstart = () => {
        if (active) {
          setIsTranscribing(true);
        }
      };

      recognition.onresult = (event: SpeechRecognitionEventLike) => {
        if (!active) return;
        let sessionFinal = "";
        let sessionInterim = "";

        for (let i = 0; i < event.results.length; i++) {
          const res = event.results[i];
          if (res && res[0]) {
            if (res.isFinal) {
              sessionFinal += res[0].transcript + " ";
            } else {
              sessionInterim += res[0].transcript + " ";
            }
          }
        }

        const currentIndex = questionIndexRef.current;
        if (sessionFinal) {
          const currentAccumulated = accumulatedRef.current ? accumulatedRef.current + " " : "";
          const newAccumulated = (currentAccumulated + sessionFinal).trim();
          accumulatedRef.current = newAccumulated;
          setTranscripts((prev) => {
            const next = [...prev];
            next[currentIndex] = newAccumulated;
            return next;
          });
        }
        setInterimTranscript(sessionInterim.trim());
      };

      recognition.onerror = (e) => {
        console.warn("SpeechRecognition notice/error:", e);
      };

      recognition.onend = () => {
        if (active) {
          setIsTranscribing(false);
          setInterimTranscript("");
          // Restart otomatis jika sesi merekam masih berlangsung
          try {
            recognition.start();
          } catch {
            // Abaikan jika sudah aktif
          }
        }
      };

      recognition.start();
      recognitionRef.current = recognition;
    } catch (err) {
      console.warn("Gagal memulai speech recognition:", err);
    }

    return () => {
      active = false;
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // Abaikan saat cleanup
        }
        recognitionRef.current = null;
      }
    };
  }, [recording]);

  const setTranscript = (index: number, text: string) => {
    setTranscripts((prev) => {
      const next = [...prev];
      next[index] = text;
      return next;
    });
    if (index === questionIndexRef.current) {
      accumulatedRef.current = text;
    }
  };

  const resetTranscripts = () => {
    setTranscripts([]);
    setInterimTranscript("");
    accumulatedRef.current = "";
  };

  const baseText = transcripts[questionIndex] || "";
  const currentTranscript = baseText
    ? baseText + (interimTranscript ? " " + interimTranscript : "")
    : interimTranscript;

  return {
    transcripts,
    currentTranscript,
    isTranscribing,
    setTranscript,
    resetTranscripts,
  };
}
