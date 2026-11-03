"use client";

import { useState, type RefObject } from "react";
import { gsap, setupGsap, useGSAP } from "../gsap";
import { INTRO_DONE } from "../intro";
import { attachLoaderJoke } from "../motion/loaderJoke";
import { playLoaderTimeline } from "../motion/loaderTimeline";
import type { Select } from "../motion/select";

setupGsap();

/** Memutar intro loader sekali per sesi; `gone` true saat intro tidak perlu diputar atau sudah selesai. */
export function useLoaderIntro(overlay: RefObject<HTMLDivElement | null>) {
  const [gone, setGone] = useState(false);

  useGSAP(
    () => {
      const root = document.documentElement;
      if (root.dataset.intro !== "play" || !overlay.current) {
        setGone(true);
        return;
      }
      const select: Select = (selector) => gsap.utils.selector(overlay.current)(selector) as HTMLElement[];
      playLoaderTimeline(overlay.current, select, () => {
        root.dataset.intro = "done";
        window.dispatchEvent(new Event(INTRO_DONE));
        setGone(true);
      });
      return attachLoaderJoke(select);
    },
    { scope: overlay },
  );

  return gone;
}
