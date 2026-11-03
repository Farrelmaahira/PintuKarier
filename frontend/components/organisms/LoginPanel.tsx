"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState, useState } from "react";
import { SignIn } from "@phosphor-icons/react";
import { Button } from "../atoms/Button";
import { AuthArt } from "../molecules/AuthArt";
import { Field } from "../molecules/Field";
import { Notice } from "../molecules/Notice";
import { Segmented } from "../molecules/Segmented";
import { login, type AuthState } from "@/lib/actions/login";
import { USER_ROLES, ROLE_INFO, type UserRole } from "@/lib/data/auth";
import auth from "@/styles/auth.module.css";

const ROLE_LABELS = USER_ROLES.map((userRole) => ROLE_INFO[userRole].label);

interface RoleLoginPlaceholder {
  email: string;
  password: string;
}

const LOGIN_PLACEHOLDERS: Record<UserRole, RoleLoginPlaceholder> = {
  mahasiswa: {
    email: "nama@kampus.ac.id",
    password: "Minimal 8 karakter",
  },
  hrd: {
    email: "hrd@perusahaan.com",
    password: "Minimal 8 karakter",
  },
  prodi: {
    email: "kaprodi@kampus.ac.id",
    password: "Minimal 8 karakter",
  },
  admin: {
    email: "admin@kampus.ac.id",
    password: "Minimal 8 karakter",
  },
};

/** Form masuk + ilustrasi per peran. */
export function LoginPanel() {
  const params = useSearchParams();
  const next = params.get("next") ?? "";
  const [state, action, pending] = useActionState<AuthState, FormData>(login, {});
  const [role, setRole] = useState(USER_ROLES.find((userRole) => next.startsWith(ROLE_INFO[userRole].home)) ?? "mahasiswa");
  const info = ROLE_INFO[role];

  return (
    <div className={auth.split}>
      <div className={auth.formSide}>
        <div className={auth.head}>
          <h1 className={auth.title}>Masuk dulu, yuk.</h1>
          <p className={auth.lead}>Satu akun, langsung ke dashboard sesuai peran kamu.</p>
        </div>
        <div className={auth.group}>
          <span className={auth.label}>Masuk sebagai</span>
          <Segmented label="Peran" options={ROLE_LABELS} value={info.label} onChange={(label) => setRole(USER_ROLES[ROLE_LABELS.indexOf(label)]!)} />
        </div>
        <form action={action} className={auth.form} noValidate>
          <input type="hidden" name="next" value={next} />
          <Field
            key={`email-${role}`}
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            defaultValue={state.email}
            placeholder={LOGIN_PLACEHOLDERS[role].email}
          />
          <Field
            label="Password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder={LOGIN_PLACEHOLDERS[role].password}
          />
          {params.get("expired") && !state.error && <Notice tone="error">Sesi kamu udah habis. Masuk lagi, ya.</Notice>}
          {params.get("terdaftar") && !state.error && <Notice tone="success">Akun kamu udah jadi. Masuk dulu, ya.</Notice>}
          {state.error && <Notice tone="error">{state.error}</Notice>}
          <Button type="submit" loading={pending} block icon={<SignIn size={22} />}>
            Masuk
          </Button>
        </form>
        <p className={auth.switch}>
          Belum punya akun? <Link href={`/register?peran=${role}`}>Daftar gratis</Link>
        </p>
      </div>
      <AuthArt img={info.img} tone={info.tone} tag={info.label} title={info.title} description={info.description} />
    </div>
  );
}
