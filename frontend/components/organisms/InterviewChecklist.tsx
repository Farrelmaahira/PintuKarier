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
  return (
    <Panel title="Sebelum mulai interview">
      <ul className={app.list}>
        <li>3 pertanyaan, tiap jawaban maksimal 2 menit. Bisa selesai lebih cepat.</li>
        <li>
          Sistem akan mendeteksi jika kamera tertutup (gelap) atau dinonaktifkan, dan interview akan otomatis dijeda.
        </li>
        <li>
          Snapshot wajah dan rekaman suara (.mp3) akan disimpan agar HRD dapat mengonfirmasi keaslian kandidat.
        </li>
      </ul>
      <div className={app.row}>
        {real ? (
          camera === "on" ? (
            <Button variant="primary" onClick={onStart}>
              Gas, mulai interview
            </Button>
          ) : (
            <Button variant="primary" onClick={onTurnOnCamera} icon={<VideoCamera size={22} />}>
              Nyalakan Kamera
            </Button>
          )
        ) : (
          <>
            {camera !== "on" && (
              <Button onClick={onTurnOnCamera} icon={<VideoCamera size={22} />}>
                Nyalakan Kamera
              </Button>
            )}
            <Button variant={camera === "off" ? "ghost" : "primary"} onClick={onStart}>
              {camera === "on" ? "Gas, mulai interview" : "Mulai tanpa kamera (demo simulasi)"}
            </Button>
          </>
        )}
      </div>
    </Panel>
  );
}
