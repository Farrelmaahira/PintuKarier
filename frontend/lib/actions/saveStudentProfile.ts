"use server";

import { refresh } from "next/cache";
import { api } from "../api";
import { attempt } from "../attempt";
import type { StudentAccount } from "../data/student";

/** Simpan profil akun mahasiswa (nama, NIM, prodi, IPK, skill). */
export async function saveStudentProfile(profile: StudentAccount) {
  const r = await attempt(() =>
    api<StudentAccount>("/me/profil", { method: "PUT", body: profile }),
  );
  if (r.ok) refresh();
  return r;
}
