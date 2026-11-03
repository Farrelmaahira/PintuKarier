import { gsap, ScrollTrigger } from "../gsap";
import type { Cleanup, Select } from "./select";

/** Wiggle while in view (random drift, "house-wiggle"). */
export function wiggleInView(select: Select) {
  select("[data-wiggle]").forEach((el) => {
    const amplitude = Number(el.dataset.wiggle || 5);
    const timeline = gsap.timeline({ repeat: -1, repeatRefresh: true, paused: true }).to(el, {
      x: `random(${-amplitude}, ${amplitude})`,
      y: `random(${-amplitude}, ${amplitude})`,
      duration: gsap.utils.random(1.2, 2),
      ease: "house-wiggle",
    });
    ScrollTrigger.create({
      trigger: el,
      start: "top bottom",
      end: "bottom top",
      onToggle: (self) => (self.isActive ? timeline.play() : timeline.pause()),
    });
  });
}

/** Parallax (yPercent start -> end, scrubbed) and images that grow into place. Desktop only. */
export function scrollScrub(select: Select) {
  select("[data-parallax]").forEach((el) => {
    const [from, to] = (el.dataset.parallax || "20,-20").split(",").map(Number);
    gsap.fromTo(
      el,
      { yPercent: from },
      {
        yPercent: to,
        ease: "none",
        scrollTrigger: { trigger: el.parentElement ?? el, start: "top bottom", end: "bottom top", scrub: true },
      },
    );
  });
  select("[data-scale-in]").forEach((el) => {
    gsap.fromTo(
      el,
      { scale: 0.86 },
      {
        scale: 1,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top bottom", end: "center center", scrub: true },
      },
    );
  });
}

/** Magnetic buttons: follow the pointer, spring back elastically. Desktop with hover only. */
export function magneticButtons(select: Select): Cleanup {
  const cleanups: Cleanup[] = [];
  select("[data-magnetic]").forEach((el) => {
    const strength = Number(el.dataset.magnetic || 30);
    const move = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - 0.5) * (strength / 16);
      const y = ((event.clientY - rect.top) / rect.height - 0.5) * (strength / 16);
      gsap.to(el, { x: `${x}em`, y: `${y}em`, ease: "power4.out", duration: 1.6 });
    };
    const leave = () => gsap.to(el, { x: 0, y: 0, ease: "elastic.out(1, 0.3)", duration: 1.6 });
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    cleanups.push(() => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    });
  });
  return () => cleanups.forEach((cleanup) => cleanup());
}
