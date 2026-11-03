"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { saveStudentProfile } from "../actions/saveStudentProfile";
import type { StudentAccount } from "../data/student";
import { useSkillList } from "./useSkillList";

export type StudentProfileData = Omit<StudentAccount, "skills">;
export type UpdateProfileField = <K extends keyof StudentProfileData>(field: K, value: StudentProfileData[K]) => void;

// Field yang bisa diisi job profil_cv, dengan label untuk pemberitahuan ke mahasiswa.
const FILLABLE_FROM_CV = {
  studentNumber: "NIM",
  campus: "perguruan tinggi",
  semester: "semester",
  gpa: "IPK",
  summary: "ringkasan",
} as const;

/**
 * Custom hook untuk mengelola state dan business logic profil mahasiswa.
 * Data awal dari GET /me/profil, simpan lewat PUT /me/profil.
 */
export function useStudentProfile(initial: StudentAccount) {
  const { skills: initialSkills, ...initialFields } = initial;
  const [profile, setProfile] = useState<StudentProfileData>(initialFields);
  const skillList = useSkillList(initialSkills);
  const { skills, setSkills } = skillList;
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, startSaving] = useTransition();
  // fillFromCv dipanggil setelah job CV selesai, jauh setelah render yang membuatnya; label harus pakai isian terbaru.
  const latest = useRef({ profile, skills });
  useEffect(() => {
    latest.current = { profile, skills };
  });

  const updateProfileField: UpdateProfileField = (field, value) => setProfile((prev) => ({ ...prev, [field]: value }));

  // Profil di server sudah dilengkapi dari CV; ketikan di form yang belum disimpan tetap menang.
  // Balikan daftar yang baru terisi supaya mahasiswa tahu apa yang perlu dicek.
  const fillFromCv = ({ skills: cvSkills, ...serverFields }: StudentAccount): string[] => {
    const now = latest.current;
    const filled = (Object.keys(FILLABLE_FROM_CV) as (keyof typeof FILLABLE_FROM_CV)[])
      .filter((key) => !now.profile[key] && serverFields[key])
      .map((key) => FILLABLE_FROM_CV[key]);
    const notYetAdded = (existing: string[]) =>
      cvSkills.filter((cvSkill) => !existing.some((skill) => skill.toLowerCase() === cvSkill.toLowerCase()));
    const newSkills = notYetAdded(now.skills);
    setProfile((prev) => ({
      ...serverFields,
      ...Object.fromEntries(Object.entries(prev).filter(([, value]) => value !== "" && value !== 0)),
    }));
    // prev, bukan skills: mahasiswa bisa menambah skill selama CV diproses.
    setSkills((prev) => [...prev, ...notYetAdded(prev)]);
    return newSkills.length ? [...filled, `${newSkills.length} skill`] : filled;
  };

  const saveProfile = (event?: React.FormEvent) => {
    event?.preventDefault();
    setError(null);
    startSaving(async () => {
      const result = await saveStudentProfile({ ...profile, skills });
      if (!result.ok) return setError(result.error);
      setSaved(true);
      setTimeout(() => setSaved(false), 3500);
    });
  };

  return { profile, skillList, saved, saving, error, updateProfileField, fillFromCv, saveProfile };
}
