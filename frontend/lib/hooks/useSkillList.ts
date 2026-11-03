"use client";

import { useState } from "react";

/** Daftar skill yang bisa ditambah (tanpa duplikat, huruf besar-kecil diabaikan) dan dihapus. */
export function useSkillList(initial: string[]) {
  const [skills, setSkills] = useState<string[]>(initial);
  const [draft, setDraft] = useState("");

  const add = () => {
    const value = draft.trim();
    if (value && !skills.some((skill) => skill.toLowerCase() === value.toLowerCase())) setSkills([...skills, value]);
    setDraft("");
  };
  const remove = (skill: string) => setSkills((current) => current.filter((item) => item !== skill));

  return { skills, setSkills, draft, setDraft, add, remove };
}
