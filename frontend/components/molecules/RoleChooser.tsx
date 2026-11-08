import { Briefcase, Buildings, GraduationCap, UserCircle } from "@phosphor-icons/react/dist/ssr";
import type { ReactNode } from "react";
import { ROLE_INFO, USER_ROLES, type UserRole } from "@/lib/data/auth";
import auth from "@/styles/auth.module.css";

export const ROLE_ICON: Record<UserRole, ReactNode> = {
  mahasiswa: <UserCircle size={22} aria-hidden />,
  hrd: <Briefcase size={22} aria-hidden />,
  prodi: <GraduationCap size={22} aria-hidden />,
  admin: <Buildings size={22} aria-hidden />,
};

interface RoleChooserProps {
  onChoose: (role: UserRole) => void;
}

/** Langkah pertama masuk/daftar: pilih peran, satu per baris dengan ikon. */
export function RoleChooser({ onChoose }: RoleChooserProps) {
  return (
    <div className={auth.roleGrid} role="group" aria-label="Pilih peran">
      {USER_ROLES.map((role) => (
        <button key={role} type="button" className={auth.roleOption} onClick={() => onChoose(role)}>
          {ROLE_ICON[role]}
          {ROLE_INFO[role].label}
        </button>
      ))}
    </div>
  );
}
