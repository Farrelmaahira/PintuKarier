"use client";

import { useState, useTransition } from "react";
import { Button } from "../atoms/Button";
import { KeyValue } from "../molecules/KeyValue";
import { Notice } from "../molecules/Notice";
import { ProfileEntryList } from "../molecules/ProfileEntryList";
import { SkillEditor } from "../molecules/SkillEditor";
import { saveApplicationProfile } from "@/lib/actions/saveApplicationProfile";
import type { CvProfile } from "@/lib/data/student";
import { useSkillList } from "@/lib/hooks/useSkillList";
import app from "@/styles/app.module.css";
import ui from "@/styles/ui.module.css";

const EMPTY_PROFILE: CvProfile = { summary: "", skills: [], experience: [], projects: [], organizations: [], certifications: [] };

interface ProfileReviewProps {
  applicationId: string;
  profile: CvProfile | null;
  onNext: () => void;
}

/** Profil hasil ekstraksi CV; mahasiswa cek dan rapikan skill sebelum lanjut. */
export function ProfileReview({ applicationId, profile, onNext }: ProfileReviewProps) {
  const cvProfile = profile ?? EMPTY_PROFILE;
  const skillList = useSkillList(cvProfile.skills);
  const [error, setError] = useState<string | null>(null);
  const [saving, startSaving] = useTransition();
  const isParsed = Boolean(cvProfile.summary || cvProfile.skills.length || cvProfile.experience.length || cvProfile.projects.length);
  const sections = [
    ["Pengalaman", cvProfile.experience],
    ["Proyek", cvProfile.projects],
    ["Organisasi", cvProfile.organizations],
  ] as const;

  const saveAndContinue = () =>
    startSaving(async () => {
      setError(null);
      const result = await saveApplicationProfile(applicationId, { ...cvProfile, skills: skillList.skills });
      if (!result.ok) return setError(result.error);
      onNext();
    });

  return (
    <div className={app.stack}>
      {isParsed ? (
        <Notice tone="success">CV kebaca! Cek lagi ya, kalau ada yang meleset tinggal benerin.</Notice>
      ) : (
        <Notice tone="info">CV kamu belum kebaca otomatis. Tambahkan skill kamu di bawah, sisanya tetap dinilai dari CV dan jawaban kamu.</Notice>
      )}
      {cvProfile.summary && <KeyValue items={[["Ringkasan", cvProfile.summary]]} />}
      <div className={ui.field}>
        <span className={ui.label}>Skill ({skillList.skills.length})</span>
        <SkillEditor
          skills={skillList.skills}
          draft={skillList.draft}
          placeholder="Tambah skill, misal TypeScript"
          addLabel="Tambah skill"
          iconSize={20}
          onDraftChange={skillList.setDraft}
          onAdd={skillList.add}
          onRemove={skillList.remove}
        />
      </div>
      {sections.map(([title, entries]) => entries.length > 0 && <ProfileEntryList key={title} title={title} entries={[...entries]} />)}
      {cvProfile.certifications.length > 0 && (
        <div className={ui.field}>
          <span className={ui.label}>Sertifikasi</span>
          {cvProfile.certifications.map((certification) => (
            <span key={certification} className={app.meta}>
              {certification}
            </span>
          ))}
        </div>
      )}
      {error && <Notice tone="error">{error}</Notice>}
      <Button onClick={saveAndContinue} loading={saving} disabled={!skillList.skills.length || saving}>
        Udah bener, lanjut
      </Button>
    </div>
  );
}
