import { clipHole } from "../clipHole";
import { gsap } from "../gsap";
import { INTRO_REVEAL } from "../intro";
import type { Select } from "./select";

/** Loader ala Overflow: jendela progres yang membesar lalu membuka halaman di baliknya. */
export function playLoaderTimeline(overlay: HTMLElement, select: Select, onComplete: () => void) {
  const percent = select("[data-pct]")[0]!;
  const windowEl = select("[data-window]")[0]!;
  const bar = select("[data-bar]")[0]!;
  const width = window.innerWidth;
  const height = window.innerHeight;
  // Same sizes as the CSS first paint (--lw / --lh in landing.module.css).
  const windowWidth = Math.min(720, width * 0.9);
  const windowHeight = Math.min(560, height * 0.8);
  const box = { top: (height - windowHeight) / 2, left: (width - windowWidth) / 2 };

  gsap.set(overlay, { clipPath: clipHole(width, height, 0, 0) });
  gsap.set(windowEl, { clipPath: `inset(${box.top}px ${box.left}px ${box.top}px ${box.left}px)` });

  const progress = { value: 0 };
  return gsap
    .timeline({ onComplete })
    .to(select("[data-block]"), { opacity: 1, stagger: 0.1 })
    .to(
      progress,
      {
        value: 100,
        duration: 2,
        ease: "none",
        onUpdate: () => {
          percent.textContent = `${Math.round(progress.value)}%`;
        },
      },
      0,
    )
    .to(select("[data-status]"), { scrambleText: { text: "KANDIDAT SIAP", chars: "upperCase" }, duration: 0.6 }, 1.3)
    .to(select("[data-block]"), { opacity: 0, stagger: 0.01 })
    .to(select("[data-blocks]"), { clipPath: "inset(0 0 100% 0)" }, "<+=0.2")
    .to(select("[data-icon]"), { xPercent: 800 }, "<")
    .to(select("[data-card]"), { scale: 0, duration: 0.5 }, "<+=0.1")
    .to(windowEl, { clipPath: "inset(0px 0px 0px 0px)", duration: 1.25 })
    .to(bar, { y: -(box.top + bar.offsetHeight), duration: 1.25 }, "<")
    .add(() => window.dispatchEvent(new Event(INTRO_REVEAL)), "<+=0.15")
    .to(overlay, { clipPath: clipHole(width, height, width - 64, height - 64), duration: 1.2 }, "<")
    .to(overlay, { clipPath: clipHole(width, height, width + 4, height + 4), duration: 0.5 });
}
