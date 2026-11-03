"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface UseUniversalTtsOptions {
  defaultAutoRead?: boolean;
  defaultRate?: number;
  defaultVoiceGender?: string;
}

export interface UseUniversalTtsReturn {
  supported: boolean;
  isSpeaking: boolean;
  isPaused: boolean;
  rate: number;
  autoRead: boolean;
  voiceGender: string;
  speak: (text: string) => void;
  stop: () => void;
  pause: () => void;
  resume: () => void;
  setRate: (rate: number) => void;
  setAutoRead: (enabled: boolean) => void;
  setVoiceGender: (gender: string) => void;
}

/** Hook untuk Text-To-Speech Bahasa Indonesia universal dengan model suara neural autentik (Pria & Wanita). */
export function useUniversalTts(options: UseUniversalTtsOptions = {}): UseUniversalTtsReturn {
  const { defaultAutoRead = true, defaultRate = 1.0, defaultVoiceGender = "wanita" } = options;

  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [rate, setRateState] = useState<number>(defaultRate);
  const [autoRead, setAutoRead] = useState<boolean>(defaultAutoRead);
  const [voiceGender, setVoiceGender] = useState<string>(defaultVoiceGender);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const rateRef = useRef<number>(rate);
  const genderRef = useRef<string>(voiceGender);

  useEffect(() => {
    rateRef.current = rate;
    genderRef.current = voiceGender;
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
      audioRef.current.preservesPitch = true;
    }
  }, [rate, voiceGender]);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
        audioRef.current = null;
      }
    };
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsSpeaking(false);
    setIsPaused(false);
  }, []);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPaused(true);
  }, []);

  const resume = useCallback(() => {
    if (audioRef.current && isPaused) {
      audioRef.current.play().catch(() => {});
      setIsPaused(false);
    }
  }, [isPaused]);

  const speak = useCallback((text: string) => {
    if (!text || typeof window === "undefined") return;

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
    }

    const currentGender = genderRef.current;
    const audioUrl = `/api/tts?text=${encodeURIComponent(text)}&gender=${encodeURIComponent(currentGender)}`;
    const audio = new Audio(audioUrl);

    // Audio diputar dengan preservasi nada alami manusia (tanpa distorsi pitch)
    audio.preservesPitch = true;
    audio.playbackRate = rateRef.current;

    audio.onplay = () => {
      setIsSpeaking(true);
      setIsPaused(false);
    };
    audio.onended = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };
    audio.onerror = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };
    audio.onpause = () => {
      if (!audio.ended) {
        setIsPaused(true);
      }
    };

    audioRef.current = audio;
    audio.play().catch(() => {
      setIsSpeaking(false);
      setIsPaused(false);
    });
  }, []);

  const setRate = useCallback((newRate: number) => {
    setRateState(newRate);
  }, []);

  return {
    supported: true,
    isSpeaking,
    isPaused,
    rate,
    autoRead,
    voiceGender,
    speak,
    stop,
    pause,
    resume,
    setRate,
    setAutoRead,
    setVoiceGender,
  };
}
