import { ROLE_INFO, type UserRole } from "./data/auth";

/** Tujuan setelah login: hanya path di area peran itu sendiri, supaya tidak jadi open redirect. */
export function safeNext(next: unknown, role: UserRole): string {
  const home = ROLE_INFO[role].home;
  return typeof next === "string" && (next === home || next.startsWith(`${home}/`)) ? next : home;
}
