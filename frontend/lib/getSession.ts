import { cookies } from "next/headers";
import { USER_ROLES, SESSION_COOKIE, type Session } from "./data/auth";

/** Membaca sesi dari cookie; null kalau tidak ada atau rusak. */
export async function getSession(): Promise<Session | null> {
  const raw = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!raw) return null;
  try {
    const s = JSON.parse(raw) as Session;
    if (
      !USER_ROLES.includes(s.role) ||
      typeof s.name !== "string" ||
      typeof s.token !== "string"
    ) {
      return null;
    }
    const defaultInstitution =
      s.role === "hrd" ? "PT Arunika Teknologi" : "Politeknik Negeri Jakarta";
    return {
      ...s,
      institution: s.institution || defaultInstitution,
    };
  } catch {
    return null;
  }
}
