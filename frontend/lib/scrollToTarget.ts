import { lenisRef } from "./intro";

/** Smooth-scrolls to an element through Lenis when it is running. */
export function scrollToTarget(target: string | HTMLElement) {
  if (lenisRef.current) lenisRef.current.scrollTo(target, { offset: -68, duration: 1.4 });
  else {
    const el = typeof target === "string" ? document.querySelector(target) : target;
    el?.scrollIntoView({ behavior: "smooth" });
  }
}
