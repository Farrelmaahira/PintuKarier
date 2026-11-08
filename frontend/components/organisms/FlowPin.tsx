"use client";

import { useRef } from "react";
import { FlowPanel } from "../molecules/FlowPanel";
import { FLOW } from "@/lib/data/landing/flow";
import { gsap, setupGsap, useGSAP } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/reducedMotion";
import landing from "@/styles/landing.module.css";

setupGsap();

/** Walkthrough horizontal yang di-pin (start "top top"), satu panel per langkah user flow. */
export function FlowPin() {
  const wrap = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const progress = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const mm = gsap.matchMedia();
      mm.add("(min-width: 992px)", () => {
        const distance = () => track.current!.scrollWidth - window.innerWidth;
        const tween = gsap.to(track.current, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: wrap.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => gsap.set(progress.current, { scaleX: self.progress }),
          },
        });
        // Gambar tiap panel mengendap saat melewati tengah layar.
        gsap.utils.toArray<HTMLElement>("[data-flow-img]").forEach((img) => {
          gsap.fromTo(
            img,
            { scale: 1.15 },
            {
              scale: 1,
              ease: "none",
              scrollTrigger: { trigger: img, containerAnimation: tween, start: "left right", end: "center center", scrub: true },
            },
          );
        });
      });
    },
    { scope: wrap },
  );

  return (
    <div ref={wrap} className={landing.flowWrap}>
      <div ref={track} className={landing.flowTrack}>
        <div className={landing.flowIntro}>
          <h2 className={landing.h2Display} data-split="words">
            Satu lamaran, tujuh langkah.
          </h2>
          <p className={landing.flowLead}>
            Ikutin Raka dari unggah CV sampai datanya bantu dosen revisi mata kuliah. Termasuk momen dia belum
            lolos, tapi pulang bawa feedback.
          </p>
        </div>
        {FLOW.map((s, i) => (
          <FlowPanel key={i} no={i + 1} {...s} />
        ))}
      </div>
      <div className={landing.flowProgress} aria-hidden>
        <span ref={progress} />
      </div>
    </div>
  );
}
