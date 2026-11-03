"use client";

import { useRef, type ReactNode } from "react";
import { gsap, setupGsap, useGSAP } from "@/lib/gsap";
import { magneticButtons, scrollScrub, wiggleInView } from "@/lib/motion/ambient";
import { countUp, growBars, revealRows } from "@/lib/motion/elementReveal";
import { setupNavState } from "@/lib/motion/navState";
import { refreshOnLoad } from "@/lib/motion/refreshOnLoad";
import type { Select } from "@/lib/motion/select";
import { setupSmoothScroll } from "@/lib/motion/smoothScroll";
import { ghostLoader, revealWords, scrambleIn } from "@/lib/motion/textReveal";
import { prefersReducedMotion } from "@/lib/reducedMotion";

setupGsap();

interface MotionProps {
  children: ReactNode;
}

/**
 * Landing choreography, same as the Fakturin template, in React + GSAP. The motion style (timings, reveals)
 * follows fakturin/apps/web/DESIGN.md section 7 (Overflow Grid), ported 1:1 to Lulusin. Behavior is declared in
 * markup with data attributes; each effect lives in lib/motion.
 */
export function Motion({ children }: MotionProps) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = document.documentElement;
      const select: Select = (selector) => gsap.utils.selector(scope)(selector) as HTMLElement[];
      const cleanups = [setupNavState(select, root)];
      const runCleanups = () => cleanups.forEach((cleanup) => cleanup());
      if (prefersReducedMotion()) return runCleanups;

      cleanups.push(setupSmoothScroll(root), revealWords(select));
      ghostLoader(select);
      scrambleIn(select);
      revealRows(select);
      countUp(select);
      growBars(select);
      wiggleInView(select);
      cleanups.push(refreshOnLoad());

      const mm = gsap.matchMedia();
      mm.add("(min-width: 992px)", () => scrollScrub(select));
      mm.add("(min-width: 992px) and (hover: hover)", () => magneticButtons(select));
      return runCleanups;
    },
    { scope },
  );

  return (
    <div ref={scope} className="landing-root">
      {children}
    </div>
  );
}
