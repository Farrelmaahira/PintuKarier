import { Microphone, Stop } from "@phosphor-icons/react";
import { Button } from "../atoms/Button";
import { Meter } from "../atoms/Meter";
import { Notice } from "../molecules/Notice";
import { Panel } from "../molecules/Panel";
import { ANSWER_SECONDS } from "@/lib/data/interview";
import { type UseInterviewVoiceReturn } from "@/lib/hooks/useInterviewVoice";
import app from "@/styles/app.module.css";

export interface InterviewQuestionProps {
  question: string;
  index: number;
  isLast: boolean;
  seconds: number;
  recording: boolean;
  micError: string | null;
  voice: UseInterviewVoiceReturn;
  onStart: () => void;
  onNext: () => void;
}

/** Satu pertanyaan interview: teks, tombol dengarkan suara, sisa waktu, dan kontrol alur menjawab. */
export function InterviewQuestion({
  question,
  index,
  isLast,
  seconds,
  recording,
  micError,
  voice,
  onStart,
  onNext,
}: InterviewQuestionProps) {
  const handleNext = () => {
    voice.stop();
    onNext();
  };

  const handleStart = () => {
    voice.stop();
    onStart();
  };

  return (
    <Panel title={`Pertanyaan ${index + 1}`} tag="Pewawancara">
      <p className={app.question}>{question}</p>

      <div style={{ margin: "4px 0 12px" }}>
        <button
          type="button"
          onClick={voice.toggleSpeak}
          disabled={recording}
          className={app.action}
          style={{
            padding: "8px 16px",
            borderRadius: "6px",
            border: "1px solid var(--border)",
            background: voice.isSpeaking ? "var(--cat-lilac)" : "var(--surface)",
            color: "var(--ink)",
            fontSize: 14,
            fontWeight: 500,
            cursor: recording ? "not-allowed" : "pointer",
            transition: "all var(--dur) var(--ease)",
          }}
          aria-label={voice.isSpeaking ? "Hentikan suara pertanyaan" : "Dengarkan suara pertanyaan"}
        >
          {voice.isSpeaking ? "Hentikan Suara" : "Dengarkan Soal"}
        </button>
      </div>

      <Meter
        value={(seconds / ANSWER_SECONDS) * 100}
        label="Sisa waktu menjawab"
        tone={seconds <= 20 ? "var(--cat-orange)" : "var(--accent)"}
      />

      <div className={app.row}>
        {recording ? (
          <Button variant="danger" onClick={handleNext} icon={<Stop size={22} />}>
            {isLast ? "Selesai, kirim" : "Selesai, lanjut"}
          </Button>
        ) : (
          <Button onClick={handleStart} icon={<Microphone size={22} />}>
            Mulai jawab
          </Button>
        )}
      </div>
      {micError && <Notice tone="error">{micError}</Notice>}
    </Panel>
  );
}
