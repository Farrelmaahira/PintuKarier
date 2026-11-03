import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import landing from "@/styles/landing.module.css";

/** Penutup halaman depan: ajakan daftar. */
export function ClosingSection() {
  return (
    <section className={landing.closing} data-theme-section="light" data-scroll-end>
      <h2 className={landing.closingTitle} data-split="words">
        Lamar, belajar, lamar lagi. Kali ini lebih siap.
      </h2>
      <Link href="/register" className={landing.closingBar}>
        <span>Daftar gratis</span>
        <span className={landing.closingIcon}>
          <ArrowUpRight size={26} />
        </span>
      </Link>
    </section>
  );
}
