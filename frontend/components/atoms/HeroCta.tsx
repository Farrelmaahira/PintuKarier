import Link from "next/link";
import type { ReactNode } from "react";
import landing from "@/styles/landing.module.css";

interface HeroCtaProps {
  href: string;
  children: ReactNode;
  icon: ReactNode;
}

/** CTA besar halaman depan, ikut efek magnetik dari Motion. */
export function HeroCta({ href, children, icon }: HeroCtaProps) {
  return (
    <Link href={href} className={landing.cta} data-magnetic="22">
      <span className={landing.ctaLabel}>{children}</span>
      <span className={landing.ctaIcon}>{icon}</span>
    </Link>
  );
}
