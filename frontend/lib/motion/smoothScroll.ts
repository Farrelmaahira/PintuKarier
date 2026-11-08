import Lenis from "lenis";
import { gsap, ScrollTrigger } from "../gsap";
import { INTRO_DONE, lenisRef } from "../intro";
import { onIntro } from "../onIntro";
import type { Cleanup } from "./select";

/** Smooth scroll, synced to GSAP's ticker like the source. */
export function setupSmoothScroll(root: HTMLElement): Cleanup {
  const lenis = new Lenis({ autoRaf: false });
  lenisRef.current = lenis;
  lenis.on("scroll", ScrollTrigger.update);
  const raf = (time: number) => lenisRef.current?.raf(time * 1000);
  gsap.ticker.add(raf);
  gsap.ticker.lagSmoothing(0);
  if (root.dataset.intro === "play") lenis.stop();
  const offIntro = onIntro(INTRO_DONE, () => {
    lenisRef.current?.start();
    ScrollTrigger.refresh();
  });
  return () => {
    offIntro();
    gsap.ticker.remove(raf);
    lenisRef.current?.destroy();
    lenisRef.current = null;
  };
}
