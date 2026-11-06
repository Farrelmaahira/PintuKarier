"use client";

import { Notice } from "../molecules/Notice";
import { AcademicDataForm } from "./AcademicDataForm";
import { ClaimEvidenceSection } from "./ClaimEvidenceSection";
import { ProfileSidebar } from "./ProfileSidebar";
import { SkillsPanel } from "./SkillsPanel";
import { StudentAccount } from "@/lib/data/student";
import { useStudentProfile } from "@/lib/hooks/useStudentProfile";
import shell from "@/styles/shell.module.css";

interface StudentProfileProps {
  initial: StudentAccount;
}

export function StudentProfile({ initial }: StudentProfileProps) {
  const { profile, skillList, saved, saving, error, updateProfileField, fillFromCv, saveProfile } = useStudentProfile(initial);

  return (
    <div className={shell.split}>
      <div className={shell.stack}>
        {saved && <Notice tone="success">Profil kamu berhasil diperbarui.</Notice>}
        {error && <Notice tone="error">{error}</Notice>}
        <AcademicDataForm profile={profile} saving={saving} onFieldChange={updateProfileField} onSubmit={saveProfile} />
        <SkillsPanel skillList={skillList} />
        <ClaimEvidenceSection studentName={profile.name} />
      </div>
      <div className={shell.stack}>
        <ProfileSidebar onCvParsed={fillFromCv} />
      </div>
    </div>
  );
}
