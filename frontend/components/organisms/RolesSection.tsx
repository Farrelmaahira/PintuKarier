import { RoleCard } from "../molecules/RoleCard";
import { LANDING_ROLES } from "@/lib/data/roles";
import landing from "@/styles/landing.module.css";

/** Tiga peran dalam kolom bertingkat dengan parallax. */
export function RolesSection() {
  return (
    <section id="peran" className={landing.warm} data-theme-section="light">
      <div className={landing.wrap}>
        <h2 className={landing.h2Display} data-split="words">
          Tiga pihak, satu siklus.
        </h2>
        <p className={landing.sub}>
          Mahasiswa melamar, HRD menyeleksi, prodi belajar dari hasilnya. Semua dapet sesuatu, nggak ada yang kerja sia-sia.
        </p>
        <div className={landing.roles}>
          {LANDING_ROLES.map((role, index) => (
            <div key={role.href} className={landing.roleCol} data-parallax={index % 2 === 1 ? "30,-15" : "0,0"}>
              <RoleCard role={role} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
