"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { DotsNine, SignIn, UserPlus, X } from "@phosphor-icons/react";
import { Logo } from "../atoms/Logo";
import shell from "@/styles/shell.module.css";

const LINKS = [
  { href: "/login", label: "Masuk", tone: "var(--cat-yellow)" },
];

/** Bar atas halaman publik: brand, tautan, CTA Daftar di kanan. Menu titik 3x3 di mobile. */
export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState<string | null>(null);
  // Menu tertutup sendiri begitu path berubah, tanpa effect.
  const isOpen = open === pathname;

  const links = LINKS.map((link) => (
    <Link
      key={link.href}
      href={link.href}
      aria-current={pathname === link.href ? "page" : undefined}
      style={{ "--tone": link.tone } as React.CSSProperties}
      onClick={() => setOpen(null)}
    >
      {link.href === "/login" && <SignIn size={18} aria-hidden style={{ marginRight: 8 }} />}
      {link.label}
    </Link>
  ));
  const cta = (
    <Link href="/register" className={shell.walletBtn} onClick={() => setOpen(null)}>
      <UserPlus size={18} aria-hidden />
      Daftar gratis
    </Link>
  );

  return (
    <nav className={shell.nav} aria-label="Utama">
      <Link href="/" className={shell.brand}>
        <Logo size={32} />
        Pintu Karier
      </Link>
      <div className={shell.links}>{links}</div>
      <div className={shell.wallet}>{cta}</div>
      <button
        type="button"
        className={shell.menuBtn}
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
        aria-label={isOpen ? "Tutup menu" : "Buka menu"}
        onClick={() => setOpen(isOpen ? null : pathname)}
      >
        {isOpen ? <X size={26} /> : <DotsNine size={26} />}
      </button>
      <div id="mobile-menu" className={shell.mobileMenu} data-open={isOpen}>
        {links}
        <div className={shell.mobileWallet}>{cta}</div>
      </div>
    </nav>
  );
}
