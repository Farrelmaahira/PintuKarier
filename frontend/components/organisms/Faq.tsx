"use client";

import { useRef, useState } from "react";
import { FaqItem } from "../molecules/FaqItem";
import { FAQ } from "@/lib/data/landing/faq";
import { gsap, ScrollTrigger, setupGsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/reducedMotion";
import landing from "@/styles/landing.module.css";

setupGsap();

/** Akordeon GSAP, satu terbuka dalam satu waktu; tinggi jawaban di-tween ke auto. */
export function Faq() {
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<number | null>(null);
  const toggle = (index: number) => {
    const panels = ref.current!.querySelectorAll<HTMLElement>("[data-answer]");
    const reduce = prefersReducedMotion();
    panels.forEach((panel, position) => {
      const show = position === index && open !== index;
      gsap.to(panel, {
        height: show ? "auto" : 0,
        duration: reduce ? 0 : show ? 0.525 : 0.65,
        onComplete: () => ScrollTrigger.refresh(),
      });
    });
    setOpen(open === index ? null : index);
  };

  return (
    <div ref={ref} className={landing.faq}>
      {FAQ.map(([question, answer], index) => (
        <FaqItem
          key={question}
          index={index}
          question={question}
          answer={answer}
          open={open === index}
          onToggle={() => toggle(index)}
        />
      ))}
    </div>
  );
}
