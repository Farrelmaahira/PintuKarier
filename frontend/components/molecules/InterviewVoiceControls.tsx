"use client";

import { useState } from "react";
import app from "@/styles/app.module.css";

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
    <div className={app.stack} style={{ gap: 8, margin: "8px 0" }}>
      <div className={app.row} style={{ alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
        <button
          type="button"
          onClick={onToggleSpeak}
          disabled={disabled}
          className={app.action}
          style={{
            padding: "8px 16px",
            borderRadius: "6px",
            border: "1px solid var(--border)",
            background: isSpeaking ? "var(--cat-lilac)" : "var(--surface)",
            color: "var(--ink)",
            fontSize: 14,
            fontWeight: 500,
            cursor: disabled ? "not-allowed" : "pointer",
            transition: "all var(--dur) var(--ease)",
          }}
          aria-label={isSpeaking ? "Hentikan suara pertanyaan" : "Dengarkan suara pertanyaan"}
        >
          {isSpeaking ? "Hentikan Suara" : "Dengarkan Soal"}
        </button>

        <button
          type="button"
          onClick={() => setShowSettings((prev) => !prev)}
          className={app.action}
          style={{
            padding: "8px 14px",
            borderRadius: "6px",
            border: "1px solid var(--border)",
            background: showSettings ? "var(--surface-raised)" : "transparent",
            color: "var(--text-subtle)",
            fontSize: 13,
            cursor: "pointer",
          }}
          aria-expanded={showSettings}
          aria-label="Pengaturan suara AI"
        >
          Opsi Suara
        </button>
      </div>

      {showSettings && (
        <div
          style={{
            padding: "14px 16px",
            borderRadius: 6,
            border: "1px solid var(--border)",
            background: "var(--surface)",
            display: "grid",
            gap: 12,
            fontSize: 13,
          }}
        >
          {onSelectVoiceGender && (
            <label style={{ display: "grid", gap: 4 }}>
              <span style={{ fontWeight: 500, color: "var(--ink)" }}>Karakter Suara:</span>
              <select
                value={voiceGender}
                onChange={(e) => onSelectVoiceGender(e.target.value)}
                style={{
                  padding: "6px 10px",
                  borderRadius: 6,
                  border: "1px solid var(--border)",
                  background: "var(--bg)",
                  color: "var(--ink)",
                  fontSize: 13,
                }}
              >
                <option value="wanita">Suara Wanita</option>
                <option value="pria">Suara Pria</option>
              </select>
            </label>
          )}

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <label style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontWeight: 500, color: "var(--ink)" }}>Kecepatan:</span>
              <select
                value={rate}
                onChange={(e) => onSelectRate(Number(e.target.value))}
                style={{
                  padding: "4px 8px",
                  borderRadius: 6,
                  border: "1px solid var(--border)",
                  background: "var(--bg)",
                  color: "var(--ink)",
                  fontSize: 13,
                }}
              >
                <option value={0.85}>0.85x (Santai)</option>
                <option value={1.0}>1.0x (Normal)</option>
                <option value={1.15}>1.15x (Cepat)</option>
              </select>
            </label>

            <label style={{ display: "inline-flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={autoRead}
                onChange={(e) => onToggleAutoRead(e.target.checked)}
                style={{ accentColor: "var(--ink)", cursor: "pointer" }}
              />
              <span style={{ color: "var(--ink)" }}>Bacakan otomatis tiap soal</span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
}
