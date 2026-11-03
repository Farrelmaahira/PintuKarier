"use server";

import { redirect } from "next/navigation";
import { api } from "../api";
import { validateEmail } from "../validateEmail";
import { USER_ROLES, ROLE_INFO, type UserRole } from "../data/auth";
import type { AuthState } from "./login";

/** Daftar akun baru lewat Golang API, lalu arahkan ke login dengan peran yang sudah terpilih. */
export async function register(
  _prev: AuthState,
  form: FormData,
): Promise<AuthState> {
  const name = String(form.get("name") ?? "").trim();
  const email = String(form.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(form.get("password") ?? "");
  const role = String(form.get("role") ?? "") as UserRole;
  const institution = String(form.get("institution") ?? "").trim();

  if (!USER_ROLES.includes(role)) return { error: "Pilih peran kamu dulu.", email };
  if (name.length < 3) return { error: "Nama minimal 3 huruf.", email };
  const emailError = validateEmail(email);
  if (emailError) return { error: emailError, email };
  if (password.length < 8)
    return { error: "Password minimal 8 karakter.", email };
  if (institution.length < 2)
    return {
      error:
        role === "hrd"
          ? "Nama perusahaan wajib diisi."
          : "Program studi wajib diisi.",
      email,
    };
  if (form.get("agree") !== "on")
    return { error: "Centang persetujuan penggunaan data dulu ya.", email };

  try {
    await api("/auth/register", {
      method: "POST",
      body: { name, email, password, role, institution },
      auth: false,
    });
  } catch (e) {
    return {
      error:
        (e as Error).cause === 409
          ? "Email ini sudah terdaftar. Coba masuk aja."
          : (e as Error).message,
      email,
    };
  }
  redirect(
    `/login?terdaftar=1&next=${encodeURIComponent(ROLE_INFO[role].home)}`,
  );
}
