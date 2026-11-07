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
  const startLabel = camera === "on" ? "Gas, mulai interview" : real ? "Nyalakan Kamera untuk Melamar" : "Mulai tanpa kamera (demo simulasi)";
  const isStrictReal = real && camera !== "on";

  return (
    <Panel title="Sebelum mulai interview">
      <ul className={app.list}>
        <li>3 pertanyaan, tiap jawaban maksimal 2 menit. Bisa selesai lebih cepat.</li>
        <li>
          <strong>Anti-Joki & Integritas:</strong> Kamera wajib aktif selama interview lamaran resmi berlangsung.
        </li>
        <li>
          Sistem akan mendeteksi jika kamera tertutup (gelap) atau dinonaktifkan, dan interview akan otomatis dijeda.
        </li>
        <li>
          Snapshot wajah dan rekaman suara (.mp3) akan disimpan agar HRD dapat mengonfirmasi keaslian kandidat.
        </li>
      </ul>
      <div className={app.row}>
        {camera !== "on" && (
          <Button onClick={onTurnOnCamera} icon={<VideoCamera size={22} />}>
            Nyalakan Kamera
          </Button>
        )}
        <Button
          variant={camera === "off" ? "ghost" : "primary"}
          onClick={onStart}
          disabled={isStrictReal}
        >
          {startLabel}
        </Button>
      </div>
      {isStrictReal && (
        <p style={{ margin: "10px 0 0 0", fontSize: 13, color: "var(--cat-orange)" }}>
          ⚠️ Untuk melamar lowongan sungguhan, kamu wajib menyalakan kamera untuk verifikasi wajah anti-joki.
        </p>
      )}
    </Panel>
  );
}
