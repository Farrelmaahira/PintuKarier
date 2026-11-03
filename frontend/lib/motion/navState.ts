import { ScrollTrigger } from "../gsap";
import type { Cleanup, Select } from "./select";

const KEYS = ["themeNav", "scrollDir", "scrolled", "scrollEnd"];

/**
 * Nav state is page-level; this page owns it while mounted. Like the source, the
 * nav takes the theme of whichever section sits under its vertical midline.
 */
export function setupNavState(select: Select, root: HTMLElement): Cleanup {
  const sections = select("[data-theme-section]");
  const syncTheme = () => {
    const mid = 34;
    // At the very top the nav sits above the first section: default to light.
    let theme = "light";
    for (const section of sections) {
      const rect = section.getBoundingClientRect();
      if (rect.top <= mid && rect.bottom >= mid) {
        theme = section.dataset.themeSection ?? "light";
        break;
      }
    }
    if (root.dataset.themeNav !== theme) root.dataset.themeNav = theme;
  };
  root.dataset.themeNav = "light";
  ScrollTrigger.create({
    start: 0,
    end: "max",
    onUpdate: (self) => {
      root.dataset.scrollDir = self.direction === 1 ? "down" : "up";
      root.dataset.scrolled = String(self.scroll() > 80);
      syncTheme();
    },
    onRefresh: syncTheme,
  });
  const end = select("[data-scroll-end]")[0];
  if (end) {
    ScrollTrigger.create({
      trigger: end,
      start: "top bottom",
      onEnter: () => (root.dataset.scrollEnd = "true"),
      onLeaveBack: () => (root.dataset.scrollEnd = "false"),
    });
  }
  return () => KEYS.forEach((key) => delete root.dataset[key]);
}
