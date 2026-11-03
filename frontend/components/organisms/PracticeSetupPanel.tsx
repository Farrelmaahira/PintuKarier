"use client";

import { SpeakerHigh, SpeakerSlash } from "@phosphor-icons/react";
import { useState } from "react";
import { Button } from "../atoms/Button";
import { Panel } from "../molecules/Panel";
import {
  PRACTICE_CATEGORIES,
  type PracticeCategory,
} from "@/lib/data/interviewPractice";
import type { StudentAccount } from "@/lib/data/student";
import type { CameraState } from "@/lib/hooks/useInterviewMedia";
import app from "@/styles/app.module.css";

export interface PracticeSetupPanelProps {
  camera: CameraState;
  categories?: PracticeCategory[];
  selectedCategory: string;
  profile?: StudentAccount | null;
  voiceGender: string;
  rate: number;
  autoRead: boolean;
  isSpeaking?: boolean;
  onSelectCategory: (categoryId: string) => void;
  onShuffle: () => void;
  onSelectVoiceGender: (gender: string) => void;
  onSelectRate: (rate: number) => void;
  onToggleAutoRead: (enabled: boolean) => void;
  onTestVoice: () => void;
  onTurnOnCamera: () => void;
  onStart: () => void;
}

/** Panel persiapan simulasi latihan interview dengan tombol uji suara dan tanpa spoiler soal. */
export function PracticeSetupPanel({
  camera,
  categories = PRACTICE_CATEGORIES,
  selectedCategory,
  profile,
  voiceGender,
  rate,
  autoRead,
  isSpeaking = false,
  onSelectCategory,
  onShuffle,
  onSelectVoiceGender,
  onSelectRate,
  onToggleAutoRead,
  onTestVoice,
  onTurnOnCamera,
  onStart,
}: PracticeSetupPanelProps) {
  const [shuffledNotification, setShuffledNotification] = useState<boolean>(false);
  const startLabel = camera === "on" ? "Mulai Latihan Interview" : "Mulai Latihan (Tanpa Kamera)";
  const currentCategory = categories.find((c) => c.id === selectedCategory) ?? categories[0];

  const handleShuffleClick = () => {
    onShuffle();
    setShuffledNotification(true);
    setTimeout(() => {
      setShuffledNotification(false);
    }, 2000);
  };

  return (
    <Panel title="Pengaturan Latihan Mandiri" tag="Simulasi">
      <div className={app.stack} style={{ gap: 18 }}>
        <div style={{ display: "grid", gap: 6 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
            <label htmlFor="practice-category" style={{ fontWeight: 500, fontSize: 14, color: "var(--ink)" }}>
              Bidang Spesialisasi Latihan:
            </label>
            <button
              type="button"
              onClick={handleShuffleClick}
              style={{
                padding: "6px 14px",
                borderRadius: "4px",
                border: "1px solid var(--border)",
                background: "var(--surface)",
                color: "var(--ink)",
                fontSize: 13,
                fontWeight: 500,
                cursor: "pointer",
              }}
              aria-label="Acak kombinasi pertanyaan latihan baru"
            >
              {shuffledNotification ? "Soal Diacak!" : "Acak Soal Baru"}
            </button>
          </div>

          <select
            id="practice-category"
            value={selectedCategory}
            onChange={(e) => onSelectCategory(e.target.value)}
            style={{
              padding: "10px 12px",
              borderRadius: "6px",
              border: "1px solid var(--border)",
              background: "var(--surface)",
              color: "var(--ink)",
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.id === "profile" && profile?.studyProgram
                  ? `${cat.name} (${profile.studyProgram})`
                  : cat.name}
              </option>
            ))}
          </select>
          {currentCategory && (
            <p style={{ margin: 0, fontSize: 13, color: "var(--text-subtle)", lineHeight: 1.4 }}>
              {currentCategory.description}
            </p>
          )}
        </div>

        <div
          style={{
            padding: "14px 16px",
            borderRadius: "6px",
            border: "1px solid var(--border)",
            background: "var(--surface-raised)",
            display: "grid",
            gap: 12,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
            <span style={{ fontWeight: 600, fontSize: 13, color: "var(--ink)" }}>
              Pengaturan Suara Pewawancara AI:
            </span>
            <button
              type="button"
              onClick={onTestVoice}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "5px 12px",
                borderRadius: "4px",
                border: "1px solid var(--border)",
                background: isSpeaking ? "var(--cat-lilac)" : "var(--surface)",
                color: "var(--ink)",
                fontSize: 12,
                fontWeight: 500,
                cursor: "pointer",
              }}
              aria-label="Uji suara pewawancara AI"
            >
              {isSpeaking ? <SpeakerSlash size={16} aria-hidden /> : <SpeakerHigh size={16} aria-hidden />}
              <span>{isSpeaking ? "Hentikan Uji" : "Uji Suara"}</span>
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
            <label style={{ display: "grid", gap: 4 }}>
              <span style={{ fontSize: 13, color: "var(--ink)", fontWeight: 500 }}>Karakter Suara:</span>
              <select
                value={voiceGender}
                onChange={(e) => onSelectVoiceGender(e.target.value)}
                style={{
                  padding: "6px 10px",
                  borderRadius: "6px",
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

            <label style={{ display: "grid", gap: 4 }}>
              <span style={{ fontSize: 13, color: "var(--ink)", fontWeight: 500 }}>Kecepatan Bicara:</span>
              <select
                value={rate}
                onChange={(e) => onSelectRate(Number(e.target.value))}
                style={{
                  padding: "6px 10px",
                  borderRadius: "6px",
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
          </div>

          <label style={{ display: "inline-flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13 }}>
            <input
              type="checkbox"
              checked={autoRead}
              onChange={(e) => onToggleAutoRead(e.target.checked)}
              style={{ accentColor: "var(--ink)", cursor: "pointer" }}
            />
            <span style={{ color: "var(--ink)" }}>Bacakan otomatis tiap soal saat sesi dimulai</span>
          </label>
        </div>

        <div className={app.row} style={{ flexWrap: "wrap", gap: 10 }}>
          {camera === "off" && (
            <Button onClick={onTurnOnCamera}>
              Nyalakan Kamera
            </Button>
          )}
          <Button variant={camera === "off" ? "ghost" : "primary"} onClick={onStart}>
            {startLabel}
          </Button>
        </div>
      </div>
    </Panel>
  );
}
