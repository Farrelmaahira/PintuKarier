import { VideoCamera } from "@phosphor-icons/react";
import type { RefObject } from "react";
import { Tag } from "../atoms/Tag";
import { RecordingIndicator } from "./RecordingIndicator";
import type { InterviewPhase } from "@/lib/data/interview";
import type { CameraState } from "@/lib/hooks/useInterviewMedia";
import app from "@/styles/app.module.css";

interface InterviewVideoProps {
  videoRef: RefObject<HTMLVideoElement | null>;
  camera: CameraState;
  phase: InterviewPhase;
  recording: boolean;
  seconds: number;
  questionIndex: number;
  questionCount: number;
}

/** Layar kamera interview: kamera, placeholder, status proses, dan bar rekaman. */
export function InterviewVideo({ videoRef, camera, phase, recording, seconds, questionIndex, questionCount }: InterviewVideoProps) {
  const finished = phase === "processing" || phase === "done";
  return (
    <div className={app.stage16}>
      <video ref={videoRef} className={app.video} data-on={camera === "on" && !finished} autoPlay muted playsInline />
      {phase === "paused_camera" && (
        <div className={app.videoOff} style={{ background: "rgba(0,0,0,0.85)", color: "#ff8c00" }}>
          <VideoCamera size={44} aria-hidden />
          <strong style={{ fontSize: 16 }}>Kamera Terdeteksi Mati / Gelap Tertutup!</strong>
          <span style={{ fontSize: 13, maxWidth: "40ch", textAlign: "center" }}>
            Wawancara resmi dijeda otomatis. Harap nyalakan kembali kamera dan pastikan wajah kamu terlihat jelas.
          </span>
        </div>
      )}
      {camera !== "on" && !finished && phase !== "paused_camera" && (
        <div className={app.videoOff}>
          <VideoCamera size={40} aria-hidden />
          <span>{camera === "denied" ? "Kamera nggak diizinkan. Mode demo tanpa kamera." : "Kamera belum nyala"}</span>
        </div>
      )}
      {finished && (
        <div className={app.videoOff}>
          <span className={app.bigCheck}>{phase === "done" ? "Beres!" : "Memproses…"}</span>
        </div>
      )}
      {phase === "answer" && (
        <div className={app.videoBar}>
          <RecordingIndicator live={recording} seconds={seconds} />
          <Tag>
            Pertanyaan {questionIndex + 1}/{questionCount}
          </Tag>
        </div>
      )}
    </div>
  );
}
