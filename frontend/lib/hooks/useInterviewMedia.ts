"use client";

import { useEffect, useRef, useState } from "react";
import { uploadFile } from "../uploadFile";

export type CameraState = "off" | "on" | "denied";

export interface MediaUploadState {
  attemptCount: number;
  uploadError: string | null;
}

export interface UseInterviewMediaReturn {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  camera: CameraState;
  recording: boolean;
  micError: string | null;
  uploadError: string | null;
  attemptCount: number;
  uploads: React.RefObject<Promise<unknown>[]>;
  recordings: React.RefObject<(Blob | undefined)[]>;
  setUploadError: (err: string | null) => void;
  startRecording: (questionIndex: number) => Promise<void>;
  stopRecording: () => void;
  stopStream: () => void;
  turnOnCamera: () => Promise<void>;
  retryUploads: () => void;
}

/**
 * Kamera, mikrofon, rekaman per jawaban, dan upload-nya.
 * Rekaman disimpan sampai terunggah supaya bisa dikirim ulang kalau gagal.
 * Mode latihan tetap menyalakan mikrofon lokal agar pengenalan suara dan transkrip berfungsi.
 */
export function useInterviewMedia(
  applicationId: string | undefined,
  real: boolean,
  onRecordingComplete?: (questionIndex: number, blob: Blob) => void,
): UseInterviewMediaReturn {
  const [camera, setCamera] = useState<"off" | "on" | "denied">("off");
  const [recording, setRecording] = useState<boolean>(false);
  const [micError, setMicError] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [attemptCount, setAttemptCount] = useState<number>(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const stream = useRef<MediaStream | null>(null);
  const recorder = useRef<MediaRecorder | null>(null);
  const recordings = useRef<(Blob | undefined)[]>([]);
  const uploads = useRef<Promise<unknown>[]>([]);
  const startedAt = useRef<number>(0);

  const stopStream = () => stream.current?.getTracks().forEach((track) => track.stop());
  // Kamera dan mikrofon dimatikan saat keluar halaman.
  useEffect(() => () => stream.current?.getTracks().forEach((track) => track.stop()), []);

  const upload = (index: number) => {
    const blob = recordings.current[index]!;
    const extension = blob.type.includes("mp4") ? "mp4" : "webm";
    const duration = Math.round((Date.now() - startedAt.current) / 1000);
    uploads.current[index] = uploadFile(applicationId!, index + 1, blob, `jawaban-${index + 1}.${extension}`, duration).then(() => {
      recordings.current[index] = undefined;
    });
    return uploads.current[index];
  };

  const startRecording = async (questionIndex: number) => {
    setMicError(null);
    try {
      if (!stream.current?.getAudioTracks().length) {
        stream.current = await navigator.mediaDevices.getUserMedia({ audio: true });
      }
      const mimeType = MediaRecorder.isTypeSupported("audio/webm") ? "audio/webm" : "audio/mp4";
      const mediaRecorder = new MediaRecorder(new MediaStream(stream.current.getAudioTracks()), { mimeType });
      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (event) => event.data.size && chunks.push(event.data);
      uploads.current[questionIndex] = new Promise<void>((resolve) => {
        mediaRecorder.onstop = () => resolve();
      }).then(() => {
        const audioBlob = new Blob(chunks, { type: mimeType });
        recordings.current[questionIndex] = audioBlob;
        onRecordingComplete?.(questionIndex, audioBlob);
        if (real && applicationId) {
          return upload(questionIndex);
        }
      });
      mediaRecorder.start();
      recorder.current = mediaRecorder;
      startedAt.current = Date.now();
      setRecording(true);
    } catch {
      setMicError("Mikrofon belum diizinkan. Izinkan akses mikrofon di browser, terus coba lagi.");
    }
  };

  const stopRecording = () => {
    if (recorder.current?.state === "recording") recorder.current.stop();
    recorder.current = null;
    setRecording(false);
  };

  const turnOnCamera = async () => {
    try {
      stream.current = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (videoRef.current) videoRef.current.srcObject = stream.current;
      setCamera("on");
    } catch {
      setCamera("denied");
    }
  };

  const retryUploads = () => {
    setUploadError(null);
    recordings.current.forEach((blob, index) => blob && upload(index));
    setAttemptCount((count) => count + 1);
  };

  return {
    videoRef,
    camera,
    recording,
    micError,
    uploadError,
    setUploadError,
    attemptCount,
    uploads,
    recordings,
    startRecording,
    stopRecording,
    stopStream,
    turnOnCamera,
    retryUploads,
  };
}
