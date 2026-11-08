import { Panel } from "../molecules/Panel";
import { CvUpload } from "./CvUpload";
import { PreScreening } from "./PreScreening";
import { ProfileReview } from "./ProfileReview";
import { APPLY_STEPS } from "@/lib/data/apply";
import type { CvProfile, Vacancy } from "@/lib/data/student";

interface ApplyStepPanelProps {
  step: number;
  vacancy: Vacancy;
  applicationId: string | null;
  profile: CvProfile | null;
  onCvDone: (applicationId: string, profile: CvProfile, fileName: string) => void;
  onNext: () => void;
}

/** Isi panel untuk langkah 0 sampai 2 alur lamaran: unggah CV, cek profil, pre-screening. */
export function ApplyStepPanel({ step, vacancy, applicationId, profile, onCvDone, onNext }: ApplyStepPanelProps) {
  return (
    <Panel title={APPLY_STEPS[step]} tag={vacancy.position}>
      {step === 0 && <CvUpload vacancyId={vacancy.id} applicationId={applicationId} onDone={onCvDone} />}
      {step === 1 && applicationId && <ProfileReview applicationId={applicationId} profile={profile} onNext={onNext} />}
      {step === 2 && applicationId && (
        <PreScreening applicationId={applicationId} questions={vacancy.prescreenQuestions} onNext={onNext} />
      )}
    </Panel>
  );
}
