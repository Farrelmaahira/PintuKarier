"use server";

import { api } from "../api";
import { attempt } from "../attempt";

/** Minta link upload bertanda tangan untuk CV profil (applicationId null), CV lamaran (questionNumber null), atau jawaban interview 1-3. */
export async function requestUpload(
  applicationId: string | null,
  questionNumber: number | null,
  name: string,
  size: number,
) {
  const path =
    applicationId === null
      ? "/me/cv"
      : `/lamaran/${encodeURIComponent(applicationId)}/${questionNumber === null ? "cv" : `interview/${questionNumber}`}`;
  return attempt(() =>
    api<{ uploadUrl: string; key: string }>(path, {
      method: "POST",
      body: { name, size },
    }),
  );
}
