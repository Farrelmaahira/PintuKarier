import { cookies } from "next/headers";
import { SESSION_COOKIE, type Session } from "./data/auth";

/**
 * Menyimpan sesi di cookie httpOnly selama 8 jam. Token di dalamnya ditandatangani Golang API dan
 * dicek di setiap panggilan; peran di cookie hanya dipakai proxy.ts untuk mengarahkan halaman.
 */
export async function setSession(session: Session) {
  (await cookies()).set(SESSION_COOKIE, JSON.stringify(session), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
}
