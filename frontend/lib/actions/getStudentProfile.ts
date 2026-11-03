"use server";

import { api } from "../api";
import { attempt } from "../attempt";
import type { StudentAccount } from "../data/student";

/** Profil akun setelah job profil_cv melengkapinya dari CV. */
export async function getStudentProfile() {
  return attempt(() => api<StudentAccount>("/me/profil"));
}
