"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState, useState } from "react";
import { SignIn, Lightning } from "@phosphor-icons/react";
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

/** Form masuk + ilustrasi per peran. */
export function LoginPanel() {
  const params = useSearchParams();
  const next = params.get("next") ?? "";
  const [state, action, pending] = useActionState<AuthState, FormData>(login, {});
  const initialRole = USER_ROLES.find((userRole) => next.startsWith(ROLE_INFO[userRole].home)) ?? "mahasiswa";
  const [role, setRole] = useState<UserRole>(initialRole);
  const [email, setEmail] = useState<string>(LOGIN_PLACEHOLDERS[initialRole].email);
  const [password, setPassword] = useState<string>(LOGIN_PLACEHOLDERS[initialRole].password);

  const info = ROLE_INFO[role];

  const handleRoleSelect = (label: string) => {
    const nextRole = USER_ROLES[ROLE_LABELS.indexOf(label)] ?? "mahasiswa";
    setRole(nextRole);
    setEmail(LOGIN_PLACEHOLDERS[nextRole].email);
    setPassword(LOGIN_PLACEHOLDERS[nextRole].password);
  };

  const fillDemo = () => {
    setEmail(LOGIN_PLACEHOLDERS[role].email);
    setPassword(LOGIN_PLACEHOLDERS[role].password);
  };

  return (
    <div className={auth.split}>
      <div className={auth.formSide}>
        <div className={auth.head}>
          <h1 className={auth.title}>Masuk dulu, yuk.</h1>
          <p className={auth.lead}>Satu akun, langsung ke dashboard sesuai peran kamu.</p>
        </div>
        <div className={auth.group}>
          <span className={auth.label}>Masuk sebagai</span>
          <Segmented label="Peran" options={ROLE_LABELS} value={info.label} onChange={handleRoleSelect} />
        </div>
        <form action={action} className={auth.form} noValidate>
          <input type="hidden" name="next" value={next} />
          <Field
            key={`email-${role}`}
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={setEmail}
            placeholder={LOGIN_PLACEHOLDERS[role].email}
          />
          <Field
            key={`password-${role}`}
            label="Password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={setPassword}
            placeholder={LOGIN_PLACEHOLDERS[role].password}
          />

          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "-6px" }}>
            <button
              type="button"
              onClick={fillDemo}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                fontSize: "12px",
                fontFamily: "var(--font-mono, monospace)",
                background: "#f0f0f0",
                border: "1px solid #000f1d",
                padding: "3px 8px",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              <Lightning size={14} weight="fill" color="#ffd731" />
              Isi akun demo ({LOGIN_PLACEHOLDERS[role].email})
            </button>
          </div>

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
