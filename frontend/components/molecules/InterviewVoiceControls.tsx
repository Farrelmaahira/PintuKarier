"use client";

import { useState } from "react";
import { Button } from "../atoms/Button";
import { SelectField } from "./SelectField";
import ui from "@/styles/ui.module.css";

export interface InterviewVoiceControlsProps {
  supported: boolean;
  isSpeaking: boolean;
  rate: number;
  autoRead: boolean;
  voiceGender?: string;
  disabled?: boolean;
  onToggleSpeak: () => void;
  onSelectRate: (rate: number) => void;
  onToggleAutoRead: (enabled: boolean) => void;
  onSelectVoiceGender?: (gender: string) => void;
}

/** Komponen reusable pengatur suara Text-To-Speech untuk AI Interview tanpa ikon dekoratif. */
export function InterviewVoiceControls({
  supported,
  isSpeaking,
  rate,
  autoRead,
  voiceGender = "wanita",
  disabled = false,
  onToggleSpeak,
  onSelectRate,
  onToggleAutoRead,
  onSelectVoiceGender,
}: InterviewVoiceControlsProps) {
  const [showSettings, setShowSettings] = useState<boolean>(false);

  if (!supported) {
    return null;
  }

  return (
    <div className={ui.formStack}>
      <div className={ui.labelRow}>
        <Button size="sm" variant={isSpeaking ? "primary" : "ghost"} onClick={onToggleSpeak} disabled={disabled}>
          {isSpeaking ? "Hentikan Suara" : "Dengarkan Soal"}
        </Button>
        <Button size="sm" variant="plain" onClick={() => setShowSettings((prev) => !prev)}>
          Opsi Suara
        </Button>
      </div>

      {showSettings && (
        <div className={ui.formSection}>
          {onSelectVoiceGender && (
            <SelectField
              label="Karakter suara"
              value={voiceGender}
              onChange={onSelectVoiceGender}
              options={[
                { value: "wanita", label: "Suara Wanita" },
                { value: "pria", label: "Suara Pria" },
              ]}
            />
          )}
          <SelectField
            label="Kecepatan bicara"
            value={rate}
            onChange={(v) => onSelectRate(Number(v))}
            options={[
              { value: 0.85, label: "0.85x (Santai)" },
              { value: 1.0, label: "1.0x (Normal)" },
              { value: 1.15, label: "1.15x (Cepat)" },
            ]}
          />
          <label className={ui.checkRow}>
            <input type="checkbox" checked={autoRead} onChange={(e) => onToggleAutoRead(e.target.checked)} />
            Bacakan otomatis tiap soal
          </label>
        </div>
      )}
    </div>
  );
}
