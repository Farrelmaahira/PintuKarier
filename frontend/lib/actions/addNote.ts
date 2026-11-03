"use server";

import { refresh } from "next/cache";
import { api } from "../api";
import { attempt } from "../attempt";
import type { FollowUpNote } from "../data/studyProgram/types";

/** Catat tindak lanjut kurikulum untuk satu kompetensi. */
export async function addNote(
  studyProgramId: string,
  input: { competency: string; course: string; action: string },
) {
  const r = await attempt(() =>
    api<FollowUpNote>(`/prodi/${encodeURIComponent(studyProgramId)}/catatan`, {
      method: "POST",
      body: input,
    }),
  );
  if (r.ok) refresh();
  return r;
}
