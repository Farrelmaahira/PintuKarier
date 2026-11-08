import { ROLE_INFO, type UserRole } from "@/lib/data/auth";
import { ROLE_ICON } from "./RoleChooser";
import auth from "@/styles/auth.module.css";

interface RoleChosenProps {
  role: UserRole;
  onChange: () => void;
}

/** Peran yang dipilih, dengan tombol untuk menggantinya. */
export function RoleChosen({ role, onChange }: RoleChosenProps) {
  return (
    <div className={auth.roleChosen}>
      <strong>
        {ROLE_ICON[role]}
        {ROLE_INFO[role].label}
      </strong>
      <button type="button" className={auth.roleChange} onClick={onChange}>
        Ganti peran
      </button>
    </div>
  );
}
