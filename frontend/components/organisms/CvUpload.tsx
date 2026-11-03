"use client";

import { useState } from "react";
import { Button } from "../atoms/Button";
import { CvDropZone } from "../molecules/CvDropZone";
import { CvParseProgress } from "../molecules/CvParseProgress";
import { Notice } from "../molecules/Notice";
import { getApplicationProfile } from "@/lib/actions/getApplicationProfile";
import { startApplication } from "@/lib/actions/startApplication";
import { cvParseFailure, parseStepOf } from "@/lib/cvParse";
import type { CvProfile } from "@/lib/data/student";
import { uploadFile } from "@/lib/uploadFile";
import { waitForJob } from "@/lib/waitForJob";
import app from "@/styles/app.module.css";

const STEPS = ["Mengunggah file", "Menunggu antrean AI", "Membaca CV dan mengenali pengalaman", "Mengisi profil otomatis"];
const EMPTY_PROFILE: CvProfile = { summary: "", skills: [], experience: [], projects: [], organizations: [], certifications: [] };

interface CvUploadProps {
  vacancyId: string;
  applicationId: string | null;
  onDone: (applicationId: string, profile: CvProfile, fileName: string) => void;
}

/** Unggah CV PDF/gambar langsung ke storage, lalu tunggu AI Engine mengekstrak profil. */
export function CvUpload({ vacancyId, applicationId, onDone }: CvUploadProps) {
  const [fileName, setFileName] = useState<string | null>(null);
  const [step, setStep] = useState(-1);
  const [error, setError] = useState<string | null>(null);
  // Diisi saat CV sudah terkirim tapi AI gagal membacanya: mahasiswa boleh lanjut isi manual.
  const [manualApplicationId, setManualApplicationId] = useState<string | null>(null);

  const processFile = async (file: File) => {
    setFileName(file.name);
    setError(null);
    setManualApplicationId(null);
    setStep(0);
    try {
      let id = applicationId;
      if (!id) {
        const started = await startApplication(vacancyId);
        if (!started.ok) throw new Error(started.error);
        id = started.data.id;
      }
      const job = await waitForJob(await uploadFile(id, null, file, file.name), (status) => setStep(parseStepOf(status)));
      if (job.status === "failed") {
        setManualApplicationId(id);
        throw cvParseFailure(job, "Coba unggah ulang atau lanjut isi profil manual.");
      }
      const profile = await getApplicationProfile(id);
      if (!profile.ok) throw new Error(profile.error);
      onDone(id, profile.data, file.name);
    } catch (e) {
      setStep(-1);
      setError(e instanceof Error ? e.message : "Upload gagal, coba lagi.");
    }
  };

  if (step >= 0) return <CvParseProgress fileName={fileName} step={step} steps={STEPS} />;

  return (
    <div className={app.uploadWrap}>
      <CvDropZone hint="Foto CV kertas juga bisa." onFile={processFile} onError={setError} />
      {error && <Notice tone="error">{error}</Notice>}
      {manualApplicationId && (
        <Button variant="ghost" size="sm" onClick={() => onDone(manualApplicationId, EMPTY_PROFILE, fileName ?? "")}>
          Lanjut isi profil manual
        </Button>
      )}
    </div>
  );
}
