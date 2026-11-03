"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft } from "@phosphor-icons/react";
import { Button } from "../atoms/Button";
import { Notice } from "../molecules/Notice";
import { StatusTrack } from "../molecules/StatusTrack";
import { ApplyStepPanel } from "./ApplyStepPanel";
import { InterviewRoom } from "./InterviewRoom";
import { VacancyDetailPanel } from "./VacancyDetailPanel";
import { APPLY_STEPS, STEP_BY_STAGE_CODE } from "@/lib/data/apply";
import type { Application, CvProfile, Vacancy } from "@/lib/data/student";
import app from "@/styles/app.module.css";
import shell from "@/styles/shell.module.css";

interface ApplyFlowProps {
  vacancy: Vacancy;
  application: Application | null;
  profile: CvProfile | null;
}

/** Alur melamar satu lowongan: unggah CV, cek profil, pre-screening, lalu AI Interview. */
export function ApplyFlow({
  vacancy,
  application,
  profile: initialProfile,
}: ApplyFlowProps) {
  const router = useRouter();
  const [applicationId, setApplicationId] = useState(application?.id ?? null);
  const [profile, setProfile] = useState(initialProfile);
  const [step, setStep] = useState(
    application ? (STEP_BY_STAGE_CODE[application.stageCode] ?? 4) : 0,
  );
  const [cvFileName, setCvFileName] = useState("");

  const backButton = (
    <div style={{ marginBottom: 16 }}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.push("/mahasiswa/lamar")}
        icon={<ArrowLeft size={18} />}
      >
        Ganti pilihan lowongan
      </Button>
    </div>
  );

  if (step >= 4 || (vacancy.closed && !applicationId)) {
    const submitted = step >= 4;
    return (
      <>
        {backButton}
        <Notice tone={submitted ? "success" : "info"}>
          {submitted
            ? `Lamaran ${vacancy.position} kamu udah masuk. Pantau statusnya di beranda.`
            : "Lowongan ini udah ditutup. Coba lowongan lain, ya."}
        </Notice>
        <div style={{ marginTop: 16 }}>
          <Button href="/mahasiswa">Balik ke beranda</Button>
        </div>
      </>
    );
  }

  return (
    <>
      {backButton}
      <StatusTrack
        steps={APPLY_STEPS}
        current={step}
        tone="lilac"
        label="Tahap melamar"
      />
      {step === 3 && applicationId ? (
        <div className={app.stack} style={{ gap: 24, marginTop: 8 }}>
          <InterviewRoom
            vacancy={{ position: vacancy.position, company: vacancy.company }}
            questions={vacancy.interviewQuestions}
            applicationId={applicationId}
            onFinish={() => {
              router.push("/mahasiswa");
              router.refresh();
            }}
          />
        </div>
      ) : (
        <div className={shell.split}>
          <ApplyStepPanel
            step={step}
            vacancy={vacancy}
            applicationId={applicationId}
            profile={profile}
            onCvDone={(id, cvProfile, fileName) => {
              setApplicationId(id);
              setProfile(cvProfile);
              setCvFileName(fileName);
              setStep(1);
            }}
            onNext={() => setStep(step + 1)}
          />
          <VacancyDetailPanel vacancy={vacancy} cvFileName={cvFileName} />
        </div>
      )}
    </>
  );
}
