"use client";

import { useRef, useState, type RefObject } from "react";
import { gsap, ScrollTrigger, setupGsap, useGSAP } from "../gsap";
import { INTRO_REVEAL } from "../intro";
import { playHeroTransition } from "../motion/heroTransitions";
import type { Select } from "../motion/select";
import { onIntro } from "../onIntro";
import { prefersReducedMotion } from "../reducedMotion";

setupGsap();

/**
 * Tahap hero yang sedang aktif: chapter yang masuk zona baca memutar satu tahap di ilustrasi,
 * dan potongan ilustrasi jatuh masuk setelah intro selesai.
 */
export function useHeroStage(scope: RefObject<HTMLElement | null>) {
  const [stage, setStage] = useState(0);
  const stageRef = useRef(0);

  useGSAP(
    (_context, contextSafe) => {
      const select: Select = (selector) => gsap.utils.selector(scope)(selector) as HTMLElement[];
      const mobile = window.matchMedia("(max-width: 991px)").matches;

      /** Transisi ke tahap `next` dari tahap yang sedang tampil, dua arah. */
      const goTo = contextSafe!((next: number) => {
        const previous = stageRef.current;
        if (next === previous) return;
        stageRef.current = next;
        setStage(next);
        if (!prefersReducedMotion()) playHeroTransition(select, previous, next);
      });

      // Fokus chapter menggerakkan tahap. Di mobile ilustrasi menutup atas layar, jadi zona baca lebih bawah.
      select("[data-chapter]").forEach((chapter, index) => {
        ScrollTrigger.create({
          trigger: chapter,
          start: mobile ? "top 82%" : "top 62%",
          end: mobile ? "bottom 62%" : "bottom 38%",
          onToggle: (self) => {
            if (self.isActive) goTo(index);
          },
        });
      });

      if (prefersReducedMotion()) return;
      gsap.set(select("[data-piece]"), { autoAlpha: 0, yPercent: -30 });
      return onIntro(INTRO_REVEAL, () => {
        gsap.to(select("[data-piece]"), {
          autoAlpha: 1,
          yPercent: 0,
          duration: 1,
          delay: 0.45,
          ease: "back.out(1.5)",
          stagger: { each: 0.07, from: "random" },
        });
      });
    },
    { scope },
  );

  return stage;
}
