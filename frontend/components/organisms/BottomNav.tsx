"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight } from "@phosphor-icons/react";
import { TABS } from "@/lib/data/landing/tabs";
import { ScrollTrigger, setupGsap, useGSAP } from "@/lib/gsap";
import { scrollToTarget } from "@/lib/scrollToTarget";
import landing from "@/styles/landing.module.css";

setupGsap();

export function BottomNav() {
  const [active, setActive] = useState("overview");

  useGSAP(() => {
    const triggers = TABS.map((t) => {
      const el = document.getElementById(t.id);
      if (!el) return null;
      return ScrollTrigger.create({
        trigger: el,
        start: "top 50%",
        end: "bottom 50%",
        onToggle: (self) => self.isActive && setActive(t.id),
      });
    });
    return () => triggers.forEach((t) => t?.kill());
  });

  return (
    <nav className={landing.tabbar} aria-label="Bagian halaman">
      {TABS.map((t) => (
        <a
          key={t.id}
          href={`#${t.id}`}
          className={landing.tab}
          aria-current={active === t.id ? "true" : undefined}
          style={{ "--tone": t.tone } as React.CSSProperties}
          onClick={(e) => {
            e.preventDefault();
            scrollToTarget(`#${t.id}`);
          }}
        >
          {t.label}
        </a>
      ))}
      <Link href="/register" className={landing.tabCta}>
        <span>Daftar gratis</span>
        <span className={landing.tabCtaIcon}>
          <ArrowUpRight size={22} />
        </span>
      </Link>
    </nav>
  );
}
