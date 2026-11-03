"use client";

import { useRef } from "react";
import { ArrowDown, ArrowUpRight } from "@phosphor-icons/react";
import { HeroCta } from "../atoms/HeroCta";
import { ChapterList } from "../molecules/ChapterList";
import { HeroIllustration } from "./HeroIllustration";
import { CHAPTERS, STAGES } from "@/lib/data/landing/hero";
import { useHeroStage } from "@/lib/hooks/useHeroStage";
import { scrollToTarget } from "@/lib/scrollToTarget";
import landing from "@/styles/landing.module.css";

/**
 * Hero dengan ilustrasi yang di-pin; empat chapter di kiri memutar satu tahap masing-masing:
 * pulpen mengisi CV, kartu skor mendarat, stempel HRD menekan, penjepit membawa CV ke Dasbor Prodi.
 */
export function HeroStory() {
  const ref = useRef<HTMLElement>(null);
  const stage = useHeroStage(ref);

  return (
    <section ref={ref} id="overview" className={landing.hero} data-theme-section="light">
      <div className={landing.heroText}>
        <div className={landing.heroFirst}>
          <h1 className={landing.h1} data-split="words" data-split-trigger="intro" data-stagger="0.07">
            Ditolak? Sekarang kamu tau kenapa.
          </h1>
          <p className={landing.heroSub}>
            Pintu Karier bikin hasil seleksi kerja jadi feedback kompetensi. Buat kamu yang melamar, buat HRD yang menyeleksi, dan buat prodi yang nyusun kurikulum.
          </p>
          <div className={landing.heroCtas}>
            <HeroCta href="/register" icon={<ArrowUpRight size={22} aria-hidden />}>
              Daftar gratis
            </HeroCta>
            <a
              href="#cara-kerja"
              className={landing.textLink}
              onClick={(event) => {
                event.preventDefault();
                scrollToTarget("#cara-kerja");
              }}
            >
              Lihat cara kerjanya <ArrowDown size={16} aria-hidden />
            </a>
          </div>
        </div>
        <ChapterList chapters={CHAPTERS} activeIndex={stage} />
      </div>
      <HeroIllustration status={STAGES[stage]!} />
    </section>
  );
}
