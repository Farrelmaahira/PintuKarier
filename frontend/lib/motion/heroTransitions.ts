import { gsap } from "../gsap";
import type { Select } from "./select";

/** Animasi ilustrasi hero saat berpindah dari tahap `previous` ke `next`, dua arah. */
export function playHeroTransition(select: Select, previous: number, next: number) {
  const timeline = gsap.timeline();

  if (next >= 1 && previous < 1) {
    timeline
      .to(select("[data-token]"), { xPercent: 70, yPercent: -95, rotate: -4, scale: 0.9, duration: 0.7, ease: "back.inOut(1.2)" })
      .fromTo(select("[data-score]"), { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.4 }, "-=0.15");
  }
  if (next < 1 && previous >= 1) {
    timeline
      .to(select("[data-score]"), { autoAlpha: 0, y: 10, duration: 0.25 })
      .to(select("[data-token]"), { xPercent: 0, yPercent: 0, rotate: 0, scale: 1, duration: 0.6 }, "<");
  }
  if (next >= 2 && previous < 2) {
    // Stempel turun ke CV, gepeng sebentar, meninggalkan cap.
    timeline
      .to(select("[data-stamp]"), { xPercent: -46, yPercent: 62, duration: 0.45, ease: "power3.in" })
      .to(select("[data-stamp-body]"), { scaleY: 0.84, scaleX: 1.05, transformOrigin: "50% 100%", duration: 0.12 })
      .fromTo(select("[data-ink]"), { scale: 1.6, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.3, ease: "back.out(2)" }, "<")
      .to(select("[data-cv]"), { y: 6, duration: 0.08, yoyo: true, repeat: 1 }, "<")
      .to(select("[data-stamp-body]"), { scaleY: 1, scaleX: 1, duration: 0.35, ease: "elastic.out(1, 0.4)" })
      .to(select("[data-stamp]"), { xPercent: 0, yPercent: 0, duration: 0.6, ease: "back.out(1.3)" }, "<");
  }
  if (next < 2 && previous >= 2) {
    timeline.to(select("[data-ink]"), { autoAlpha: 0, scale: 0.9, duration: 0.3 });
  }
  if (next >= 3 && previous < 3) {
    timeline
      .to(select("[data-clip]"), { xPercent: -150, yPercent: 95, rotate: -30, duration: 0.7, ease: "back.inOut(1.4)" })
      .fromTo(select("[data-prodi]"), { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.4 }, "-=0.15");
  }
  if (next < 3 && previous >= 3) {
    timeline
      .to(select("[data-prodi]"), { autoAlpha: 0, y: 10, duration: 0.25 })
      .to(select("[data-clip]"), { xPercent: 0, yPercent: 0, rotate: 0, duration: 0.6 }, "<");
  }
  if (next === 0) {
    // Pulpen mengisi CV.
    timeline.fromTo(
      select("[data-pen]"),
      { xPercent: 0, yPercent: 0 },
      { xPercent: -26, yPercent: -16, duration: 0.35, yoyo: true, repeat: 1, ease: "power2.inOut" },
    );
  }
  timeline.fromTo(select("[data-status]"), { scale: 0.9 }, { scale: 1, duration: 0.4, ease: "back.out(3)" }, 0);
}
