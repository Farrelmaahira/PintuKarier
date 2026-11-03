"use server";

import { redirect } from "next/navigation";
import { api } from "../api";
import { validateEmail } from "../validateEmail";
import type { UserRole } from "../data/auth";
import { safeNext } from "../safeNext";
import { setSession } from "../setSession";

export interface AuthState {
  error?: string;
  email?: string;
}

interface SessionResponse {
  token: string;
  role: UserRole;
  name: string;
  email: string;
  institution?: string;
}

/** Login lewat Golang API, simpan token di sesi, lalu ke dashboard perannya. */
export async function login(
  _prev: AuthState,
  form: FormData,
): Promise<AuthState> {
  const email = String(form.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(form.get("password") ?? "");
  const emailError = validateEmail(email);
  if (emailError) return { error: emailError, email };
  if (!password) return { error: "Password-nya diisi dulu ya.", email };

  let response: SessionResponse;
  try {
    response = await api<SessionResponse>("/auth/login", {
      method: "POST",
      body: { email, password },
      auth: false,
    });
  } catch (e) {
    return {
      error:
        (e as Error).cause === 401
          ? "Email atau password salah."
          : (e as Error).message,
      email,
    };
  }
  await setSession({
    role: response.role,
    name: response.name,
    email: response.email,
    token: response.token,
    institution: response.institution,
  });
  redirect(safeNext(form.get("next"), response.role));
}
