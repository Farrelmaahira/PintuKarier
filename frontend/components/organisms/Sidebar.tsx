"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  BookOpen,
  Briefcase,
  Buildings,
  ChartBar,
  ChatCircleText,
  GraduationCap,
  House,
  PlusCircle,
  SignOut,
  UploadSimple,
  User,
  Users,
  VideoCamera,
} from "@phosphor-icons/react";
import { Logo } from "../atoms/Logo";
import { logout } from "@/lib/actions/logout";
import { DASHBOARD_MENU, ROLE_INFO, type Session } from "@/lib/data/auth";
import dashboard from "@/styles/dashboard.module.css";

const ICON = {
  house: House,
  upload: UploadSimple,
  video: VideoCamera,
  chat: ChatCircleText,
  users: Users,
  briefcase: Briefcase,
  chart: ChartBar,
  user: User,
  book: BookOpen,
  building: Buildings,
  cap: GraduationCap,
  plus: PlusCircle,
} as const;

interface SidebarProps {
  session: Session;
}

/** Sidebar dashboard: brand, peran, menu peran, akun, dan tombol keluar. Jadi bar atas di mobile. */
export function Sidebar({ session }: SidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const fullPath = searchParams.toString() ? `${pathname}?${searchParams.toString()}` : pathname;
  const info = ROLE_INFO[session.role];
  const menu = DASHBOARD_MENU[session.role];
  const profile = menu.find((item) => item.href.endsWith("/profil"));
  const primaryMenu = menu.filter((item) => item !== profile);

  const active =
    menu.find((item) => item.href === fullPath) ||
    menu
      .filter((item) => {
        if (item.href === info.home) {
          return pathname === item.href;
        }
        return pathname === item.href || pathname.startsWith(`${item.href}/`);
      })
      .sort((a, b) => b.href.length - a.href.length)[0];

  return (
    <aside className={dashboard.sidebar} style={{ "--tone": info.tone } as React.CSSProperties}>
      <Link href="/" className={dashboard.brand}>
        <Logo size={28} />
        Pintu Karier
      </Link>
      <span className={dashboard.role}>Dashboard {info.label}</span>
      <nav className={dashboard.menu} aria-label="Menu dashboard">
        {primaryMenu.map((item) => {
          const Icon = ICON[item.icon as keyof typeof ICON];
          return (
            <Link key={item.href} href={item.href} aria-current={active === item ? "page" : undefined}>
              <Icon size={20} aria-hidden />
              {item.label}
            </Link>
          );
        })}
        {profile && (() => {
          const Icon = ICON[profile.icon as keyof typeof ICON];
          return (
            <Link key={profile.href} href={profile.href} aria-current={active === profile ? "page" : undefined}>
              <Icon size={20} aria-hidden />
              {profile.label}
            </Link>
          );
        })()}
      </nav>
      <div className={dashboard.account}>
        <form action={logout}>
          <button type="submit" className={dashboard.logout} aria-label="Keluar">
            <SignOut size={20} />
            <span>Keluar</span>
          </button>
        </form>
      </div>
    </aside>
  );
}
