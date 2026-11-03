import { VideoCamera } from "@phosphor-icons/react";
import { Button } from "../atoms/Button";
import { Panel } from "../molecules/Panel";
import type { CameraState } from "@/lib/hooks/useInterviewMedia";
import app from "@/styles/app.module.css";

interface InterviewChecklistProps {
  camera: CameraState;
  real: boolean;
  onTurnOnCamera: () => void;
  onStart: () => void;
}

/** Panel "Sebelum mulai": aturan interview dan pilihan menyalakan kamera. */
export function InterviewChecklist({ camera, real, onTurnOnCamera, onStart }: InterviewChecklistProps) {
  const startLabel = camera === "on" ? "Gas, mulai interview" : real ? "Mulai tanpa kamera" : "Mulai tanpa kamera (demo)";
  return (
    <Panel title="Sebelum mulai">
      <ul className={app.list}>
        <li>3 pertanyaan, tiap jawaban maksimal 2 menit. Bisa selesai lebih cepat.</li>
        <li>Jawaban direkam lalu ditranskripsi otomatis buat dinilai.</li>
        <li>Rekaman cuma dipakai buat seleksi lowongan ini, sesuai persetujuan kamu.</li>
      </ul>
      <div className={app.row}>
        {camera === "off" && (
          <Button onClick={onTurnOnCamera} icon={<VideoCamera size={22} />}>
            Nyalain kamera
          </Button>
        )}
        <Button variant={camera === "off" ? "ghost" : "primary"} onClick={onStart}>
          {startLabel}
        </Button>
      </div>
    </Panel>
  );
}
