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
      {camera !== "on" && !finished && (
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
