"use client";

import { useState } from "react";
import { CvDropZone } from "../molecules/CvDropZone";
import { CvParseProgress } from "../molecules/CvParseProgress";
import { Notice } from "../molecules/Notice";
import { getStudentProfile } from "@/lib/actions/getStudentProfile";
import { cvParseFailure, parseStepOf } from "@/lib/cvParse";
import type { StudentAccount } from "@/lib/data/student";
import { uploadFile } from "@/lib/uploadFile";
import { waitForJob } from "@/lib/waitForJob";
import app from "@/styles/app.module.css";

const STEPS = ["Mengunggah file", "Menunggu antrean AI", "Membaca CV", "Melengkapi profil"];

interface ProfileCvUploadProps {
  onDone: (profile: StudentAccount) => string[];
}

/** Unggah CV di halaman profil; AI Engine mengisi field profil akun yang masih kosong. */
export function ProfileCvUpload({ onDone }: ProfileCvUploadProps) {
  const [fileName, setFileName] = useState<string | null>(null);
  const [step, setStep] = useState(-1);
  const [error, setError] = useState<string | null>(null);
  // Daftar field yang baru terisi; null berarti belum ada CV yang selesai dibaca.
  const [filled, setFilled] = useState<string[] | null>(null);

  const processFile = async (file: File) => {
    setFileName(file.name);
    setError(null);
    setFilled(null);
    setStep(0);
    try {
      const job = await waitForJob(await uploadFile(null, null, file, file.name), (status) => setStep(parseStepOf(status)));
      if (job.status === "failed") throw cvParseFailure(job, "Coba unggah ulang atau isi profil manual.");
      const profile = await getStudentProfile();
      if (!profile.ok) throw new Error(profile.error);
      setFilled(onDone(profile.data));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload gagal, coba lagi.");
    }
    setStep(-1);
  };

  if (step >= 0) return <CvParseProgress fileName={fileName} step={step} steps={STEPS} />;

  return (
    <div className={app.uploadWrap}>
      {filled && (
        <Notice tone={filled.length ? "success" : "info"}>
          {filled.length
            ? `Diisi dari ${fileName}: ${filled.join(", ")}. Cek lagi ya, AI bisa salah baca.`
            : `Tidak ada field kosong yang bisa diisi dari ${fileName}.`}
        </Notice>
      )}
      <CvDropZone onFile={processFile} onError={setError} />
      {error && <Notice tone="error">{error}</Notice>}
    </div>
  );
}
