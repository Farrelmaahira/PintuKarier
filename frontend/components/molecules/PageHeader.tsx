import type { ReactNode } from "react";
import { Suspense } from "react";
import { getSession } from "@/lib/getSession";
import { LANDING_ROLES } from "@/lib/data/roles";
import { UserProfileBadge } from "./UserProfileBadge";
import shell from "@/styles/shell.module.css";

export interface PageHeaderUser {
  name: string;
  institution?: string;
  role?: string;
}

export interface PageHeaderProps {
  href: string;
  title: string;
  lead: ReactNode;
  user?: PageHeaderUser;
  children?: ReactNode;
}

async function HeaderUserBadge({
  href,
  user,
}: {
  href: string;
  user?: PageHeaderUser;
}) {
  const session = !user ? await getSession() : null;
  const role = LANDING_ROLES.find((item) => item.href === href);

  const currentUser =
    user ||
    (session
      ? {
          name: session.name,
          institution: session.institution,
          role: session.role,
        }
      : null);

  if (currentUser) {
    return (
      <UserProfileBadge
        name={currentUser.name}
        institution={currentUser.institution}
        role={currentUser.role}
      />
    );
  }

  if (role) {
    return (
      <div
        className={shell.role}
        style={{ "--tone": role.tone } as React.CSSProperties}
      >
        <span className={shell.roleSwatch} aria-hidden />
        <span>
          Untuk:
          <br />
          {role.who}
        </span>
      </div>
    );
  }

  return null;
}

export function PageHeader({
  href,
  title,
  lead,
  user,
  children,
}: PageHeaderProps) {
  return (
    <header className={shell.header}>
      <div>
        <h1 className={shell.title}>{title}</h1>
        <p className={shell.lead}>{lead}</p>
        {children}
      </div>
      <Suspense fallback={null}>
        <HeaderUserBadge href={href} user={user} />
      </Suspense>
    </header>
  );
}
