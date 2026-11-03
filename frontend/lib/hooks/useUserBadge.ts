"use client";

import { useMemo } from "react";
import { ROLE_INFO, type UserRole } from "../data/auth";

export interface UserBadgeParams {
  name?: string;
  institution?: string;
  role?: UserRole | string;
}

export const ROLE_PROFILE_HREF: Record<string, string> = {
  mahasiswa: "/mahasiswa/profil",
  hrd: "/hrd/profil",
  prodi: "/prodi/profil",
};

export interface UserBadgeResult {
  displayName: string;
  displayInstitution: string;
  initial: string;
  tone: string;
  profileHref: string;
}

export function useUserBadge({
  name = "Pengguna",
  institution,
  role = "mahasiswa",
}: UserBadgeParams): UserBadgeResult {
  return useMemo(() => {
    const validRole = (role in ROLE_INFO ? role : "mahasiswa") as UserRole;
    const tone = ROLE_INFO[validRole]?.tone ?? "var(--cat-lilac)";
    const initial = name ? name.trim().charAt(0).toUpperCase() : "U";
    const profileHref = ROLE_PROFILE_HREF[validRole] ?? "/mahasiswa/profil";

    let displayInstitution = institution?.trim() || "";
    if (!displayInstitution) {
      if (validRole === "hrd") {
        displayInstitution = "PT Arunika Teknologi";
      } else {
        displayInstitution = "Politeknik Negeri Jakarta";
      }
    }

    return {
      displayName: name,
      displayInstitution,
      initial,
      tone,
      profileHref,
    };
  }, [name, institution, role]);
}
