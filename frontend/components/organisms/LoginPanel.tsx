"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState, useState } from "react";
import { SignIn } from "@phosphor-icons/react";
import { Button } from "../atoms/Button";
import { AuthArt } from "../molecules/AuthArt";
import { Field } from "../molecules/Field";
import { Notice } from "../molecules/Notice";
import { RoleChooser } from "../molecules/RoleChooser";
import { RoleChosen } from "../molecules/RoleChosen";
import { login, type AuthState } from "@/lib/actions/login";
import { USER_ROLES, ROLE_INFO, type UserRole } from "@/lib/data/auth";
import auth from "@/styles/auth.module.css";

interface RoleLoginPlaceholder {
  email: string;
  password: string;
}

const LOGIN_PLACEHOLDERS: Record<UserRole, RoleLoginPlaceholder> = {
  mahasiswa: {
    email: "raka@demo.pintukarier.id",
    password: "demo12345",
  },
  hrd: {
    email: "rani@demo.pintukarier.id",
    password: "demo12345",
  },
  prodi: {
    email: "anita@demo.pintukarier.id",
    password: "demo12345",
  },
  admin: {
    email: "admin@demo.pintukarier.id",
    password: "demo12345",
  },
};

export function LoginPanel() {
  const params = useSearchParams();
  const next = params.get("next") ?? "";
  const [state, action, pending] = useActionState<AuthState, FormData>(login, {});
  // Peran langsung terpilih bila tujuan (?next=) atau ?peran= sudah menunjuknya; selain itu pilih dulu.
  const fromParam = params.get("peran");
  const initialRole = USER_ROLES.find((userRole) => next.startsWith(ROLE_INFO[userRole].home)) ?? (USER_ROLES.includes(fromParam as UserRole) ? (fromParam as UserRole) : null);
  const [role, setRole] = useState<UserRole | null>(initialRole);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const info = ROLE_INFO[role ?? "mahasiswa"];

  return (
    <div className={auth.split}>
      <div className={auth.formSide}>
        <div className={auth.head}>
          <h1 className={auth.title}>Masuk dulu, yuk.</h1>
          <p className={auth.lead}>Satu akun, langsung ke dashboard sesuai peran kamu.</p>
        </div>
        {role ? (
          <>
            <RoleChosen role={role} onChange={() => setRole(null)} />
            <form action={action} className={auth.form} noValidate>
              <input type="hidden" name="next" value={next} />
              <input type="hidden" name="role" value={role} />
              <Field key={`email-${role}`} label="Email" name="email" type="email" autoComplete="email" value={email} onChange={setEmail} placeholder={LOGIN_PLACEHOLDERS[role].email} />
              <Field key={`password-${role}`} label="Password" name="password" type="password" autoComplete="current-password" value={password} onChange={setPassword} placeholder={LOGIN_PLACEHOLDERS[role].password} />

              {params.get("expired") && !state.error && <Notice tone="error">Sesi kamu udah habis. Masuk lagi, ya.</Notice>}
              {params.get("terdaftar") && !state.error && <Notice tone="success">Akun kamu udah jadi. Masuk dulu, ya.</Notice>}
              {state.error && <Notice tone="error">{state.error}</Notice>}
              <Button type="submit" loading={pending} block icon={<SignIn size={22} />}>
                Masuk
              </Button>
            </form>
          </>
        ) : (
          <div className={auth.group}>
            <span className={auth.label}>Masuk sebagai</span>
            <RoleChooser onChoose={setRole} />
          </div>
        )}
        <p className={auth.switch}>
          Belum punya akun? <Link href={role ? `/register?peran=${role}` : "/register"}>Daftar gratis</Link>
        </p>
      </div>
      <AuthArt img={info.img} tone={info.tone} tag={info.label} title={info.title} description={info.description} />
    </div>
  );
}
