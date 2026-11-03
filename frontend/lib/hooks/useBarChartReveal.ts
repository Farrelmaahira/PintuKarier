"use client";

import type { RefObject } from "react";
import { gsap, setupGsap, useGSAP } from "../gsap";
import { prefersReducedMotion } from "../reducedMotion";

setupGsap();

/**
 * Saat grafik masuk layar: legenda dan label fade in, bar tumbuh dari kiri berurutan,
 * dan angkanya menghitung naik dari 0. Penanda ada di markup: data-bar, data-value, data-fade.
 */
export function useBarChartReveal(chart: RefObject<HTMLElement | null>, unit: string) {
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const select = gsap.utils.selector(chart);
      const timeline = gsap.timeline({ scrollTrigger: { trigger: chart.current, start: "top 75%", once: true } });
      timeline.from(select("[data-bar]"), { scaleX: 0, transformOrigin: "left center", duration: 1.2, stagger: 0.08 }, 0);
      (select("[data-value]") as HTMLElement[]).forEach((label, index) => {
        const target = Number(label.dataset.value);
        const counter = { value: 0 };
        const digits = Number.isInteger(target) ? 0 : 1;
        label.textContent = `0${unit}`; // mulai dari nol bareng bar yang sudah dikempiskan
        timeline.to(
          counter,
          {
            value: target,
            duration: 1.2,
            onUpdate: () => {
              label.textContent = counter.value.toLocaleString("id-ID", { maximumFractionDigits: digits }) + unit;
            },
          },
          index * 0.08,
        );
      });
      timeline.from(select("[data-fade]"), { autoAlpha: 0, y: 12, duration: 0.6, stagger: 0.05 }, 0);
    },
    { scope: chart },
  );
}
