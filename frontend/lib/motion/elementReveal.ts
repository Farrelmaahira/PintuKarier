import { gsap } from "../gsap";
import type { Select } from "./select";

/** Card rows: yPercent 40 -> 0, stagger 0.05, 0.725s, at top 80%. */
export function revealRows(select: Select) {
  select("[data-reveal-row]").forEach((row) => {
    gsap.fromTo(
      row.querySelectorAll("[data-reveal-item]"),
      { yPercent: 40, autoAlpha: 0 },
      {
        yPercent: 0,
        autoAlpha: 1,
        stagger: 0.05,
        duration: 0.725,
        scrollTrigger: { trigger: row, start: "top 80%", once: true },
      },
    );
  });
}

/** Counting numbers (money cards). */
export function countUp(select: Select) {
  select("[data-count]").forEach((el) => {
    const target = Number(el.dataset.count);
    const prefix = el.dataset.prefix ?? "";
    const suffix = el.dataset.suffix ?? "";
    const decimals = Number(el.dataset.decimals ?? 0);
    const format = (value: number) =>
      value.toLocaleString("id-ID", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
    const state = { value: 0 };
    el.textContent = prefix + format(0) + suffix;
    gsap.to(state, {
      value: target,
      duration: 1.6,
      ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 85%", once: true },
      onUpdate: () => {
        el.textContent = prefix + format(decimals ? state.value : Math.round(state.value)) + suffix;
      },
    });
  });
}

/** Bars that grow from the left. */
export function growBars(select: Select) {
  select("[data-grow]").forEach((bar) => {
    gsap.fromTo(
      bar.children,
      { scaleX: 0 },
      {
        scaleX: 1,
        transformOrigin: "left center",
        stagger: 0.25,
        duration: 0.9,
        scrollTrigger: { trigger: bar, start: "top 85%", once: true },
      },
    );
  });
}
