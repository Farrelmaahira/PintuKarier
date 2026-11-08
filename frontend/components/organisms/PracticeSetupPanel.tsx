"use client";

import { Shuffle, SpeakerHigh, SpeakerSlash } from "@phosphor-icons/react";
import { useState } from "react";
import { Button } from "../atoms/Button";
import { Panel } from "../molecules/Panel";
import { SelectField } from "../molecules/SelectField";
import {
  PRACTICE_CATEGORIES,
  type PracticeCategory,
} from "@/lib/data/interviewPractice";
import type { StudentAccount } from "@/lib/data/student";
import type { CameraState } from "@/lib/hooks/useInterviewMedia";
import ui from "@/styles/ui.module.css";

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
      <div className={ui.formStack}>
        <SelectField
          label="Bidang spesialisasi latihan"
          value={selectedCategory}
          onChange={onSelectCategory}
          options={categories.map((cat) => ({
            value: cat.id,
            label: cat.id === "profile" && profile?.studyProgram ? `${cat.name} (${profile.studyProgram})` : cat.name,
          }))}
          helper={currentCategory?.description}
          labelAction={
            <Button size="sm" variant="ghost" onClick={handleShuffleClick} icon={<Shuffle size={16} aria-hidden />}>
              {shuffledNotification ? "Soal diacak!" : "Acak soal baru"}
            </Button>
          }
        />

        <fieldset className={ui.formSection}>
          <div className={ui.labelRow}>
            <legend className={ui.label}>Suara pewawancara AI</legend>
            <Button size="sm" variant="ghost" onClick={onTestVoice} icon={isSpeaking ? <SpeakerSlash size={16} aria-hidden /> : <SpeakerHigh size={16} aria-hidden />}>
              {isSpeaking ? "Hentikan uji" : "Uji suara"}
            </Button>
          </div>

          <div className={ui.formGrid}>
            <SelectField
              label="Karakter suara"
              value={voiceGender}
              onChange={onSelectVoiceGender}
              options={[
                { value: "wanita", label: "Suara Wanita" },
                { value: "pria", label: "Suara Pria" },
              ]}
            />
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
          </div>

          <label className={ui.checkRow}>
            <input type="checkbox" checked={autoRead} onChange={(e) => onToggleAutoRead(e.target.checked)} />
            Bacakan otomatis tiap soal saat sesi dimulai
          </label>
        </fieldset>

        <div className={ui.btnRow}>
          {camera === "off" && <Button onClick={onTurnOnCamera}>Nyalakan Kamera</Button>}
          <Button variant={camera === "off" ? "ghost" : "primary"} onClick={onStart}>
            {startLabel}
          </Button>
        </div>
      </div>
    </Panel>
  );
}
