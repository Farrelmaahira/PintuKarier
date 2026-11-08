"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState, useState } from "react";
import { UserPlus } from "@phosphor-icons/react";
import { Button } from "../atoms/Button";
import { AuthArt } from "../molecules/AuthArt";
import { Field } from "../molecules/Field";
import { Notice } from "../molecules/Notice";
import { RoleChooser } from "../molecules/RoleChooser";
import { RoleChosen } from "../molecules/RoleChosen";
import type { AuthState } from "@/lib/actions/login";
import { register } from "@/lib/actions/register";
import { USER_ROLES, ROLE_INFO, type UserRole } from "@/lib/data/auth";
import auth from "@/styles/auth.module.css";

const INSTITUTION_FIELD: Record<UserRole, { label: string; placeholder: string }> = {
  mahasiswa: { label: "Program studi", placeholder: "D4 Teknik Informatika" },
  hrd: { label: "Nama perusahaan", placeholder: "PT Arunika Teknologi" },
  prodi: { label: "Program studi yang kamu kelola", placeholder: "D4 Teknik Informatika" },
  admin: { label: "Unit / Lembaga Kampus", placeholder: "Pusat Karier PNJ" },
};

/** Form daftar dengan field menyesuaikan peran, plus persetujuan penggunaan data. */
export function RegisterPanel() {
  // `peran` adalah nama parameter di URL (/register?peran=hrd), jadi tidak ikut diganti.
  const initialRole = useSearchParams().get("peran");
  const [role, setRole] = useState<UserRole | null>(USER_ROLES.includes(initialRole as UserRole) ? (initialRole as UserRole) : null);
  const [state, action, pending] = useActionState<AuthState, FormData>(register, {});
  const info = ROLE_INFO[role ?? "mahasiswa"];

  return (
    <div className={auth.split}>
      <div className={auth.formSide}>
        <div className={auth.head}>
          <h1 className={auth.title}>Bikin akun, gratis.</h1>
          <p className={auth.lead}>Mahasiswa nggak dipungut biaya. HRD dan prodi masuk lewat kerja sama kampus.</p>
        </div>
        {role ? (
          <>
            <RoleChosen role={role} onChange={() => setRole(null)} />
            <form action={action} className={auth.form} noValidate>
              <input type="hidden" name="role" value={role} />
              <Field label="Nama lengkap" name="name" autoComplete="name" placeholder="Raka Pratama" />
              <Field label="Email" name="email" type="email" autoComplete="email" defaultValue={state.email} placeholder="nama@kampus.ac.id" />
              <Field label="Password" name="password" type="password" autoComplete="new-password" placeholder="Minimal 8 karakter" />
              <Field key={role} label={INSTITUTION_FIELD[role].label} name="institution" placeholder={INSTITUTION_FIELD[role].placeholder} />
              <label className={auth.check}>
                <input type="checkbox" name="agree" />
                <span>Aku setuju data lamaran dan rekaman interview dipakai untuk seleksi, dan hasilnya dirangkum anonim untuk program studi.</span>
              </label>
              {state.error && <Notice tone="error">{state.error}</Notice>}
              <Button type="submit" loading={pending} block icon={<UserPlus size={22} />}>
                Daftar & masuk
              </Button>
            </form>
          </>
        ) : (
          <div className={auth.group}>
            <span className={auth.label}>Aku daftar sebagai</span>
            <RoleChooser onChoose={setRole} />
          </div>
        )}
        <p className={auth.switch}>
          Udah punya akun? <Link href={role ? `/login?peran=${role}` : "/login"}>Masuk</Link>
        </p>
      </div>
      <AuthArt img={role === "mahasiswa" || !role ? "daftar" : info.img} tone={info.tone} tag={`Daftar · ${info.label}`} title={info.title} description={info.description} />
    </div>
  );
}
