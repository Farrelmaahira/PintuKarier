"use client";

import Link from "next/link";
import { User } from "@phosphor-icons/react";
import { useUserBadge, type UserBadgeParams } from "@/lib/hooks/useUserBadge";
import shell from "@/styles/shell.module.css";

export interface UserProfileBadgeProps extends UserBadgeParams {
  className?: string;
}

export function UserProfileBadge({
  name,
  institution,
  role,
  className,
}: UserProfileBadgeProps) {
  const { displayName, displayInstitution, tone, profileHref } = useUserBadge({
    name,
    institution,
    role,
  });

  return (
    <Link
      href={profileHref}
      className={shell.userBadgeLink}
      aria-label={`Buka profil ${displayName}`}
    >
      <div
        className={`${shell.userBadge} ${className ?? ""}`.trim()}
        style={{ "--tone": tone } as React.CSSProperties}
      >
        <div className={shell.userBadgeIcon} aria-hidden>
          <User size={42} weight="bold" />
        </div>
        <div className={shell.userBadgeInfo}>
          <span className={shell.userBadgeName}>{displayName}</span>
          {displayInstitution && (
            <span className={shell.userBadgeInstansi}>{displayInstitution}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
