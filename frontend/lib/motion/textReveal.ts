import { gsap, ScrollTrigger, SplitText } from "../gsap";
import { INTRO_REVEAL } from "../intro";
import { onIntro } from "../onIntro";
import type { Cleanup, Select } from "./select";

/** Word reveals: yPercent 25 -> 0, stagger 0.05, at top 90%. */
export function revealWords(select: Select): Cleanup {
  const offs: Cleanup[] = [];
  select('[data-split="words"]').forEach((el) => {
    const split = SplitText.create(el, { type: "words", wordsClass: "split-word" });
    gsap.set(split.words, { autoAlpha: 0, yPercent: 25 });
    const play = () =>
      gsap.to(split.words, {
        autoAlpha: 1,
        yPercent: 0,
        stagger: Number(el.dataset.stagger ?? 0.05),
        delay: Number(el.dataset.delay ?? 0),
      });
    if (el.dataset.splitTrigger === "intro") offs.push(onIntro(INTRO_REVEAL, () => gsap.delayedCall(0.35, play)));
    else ScrollTrigger.create({ trigger: el, start: "top 90%", once: true, onEnter: play });
  });
  return () => offs.forEach((off) => off());
}

/** Ghost loader: each text line hidden under a pulsing block, then revealed. */
export function ghostLoader(select: Select) {
  select("[data-ghost]").forEach((el) => {
    const dark = el.dataset.ghost === "dark";
    const split = SplitText.create(el, { type: "lines", linesClass: "split-line" });
    split.lines.forEach((line, index) => {
      const block = document.createElement("span");
      block.className = "ghost-block";
      block.style.background = dark ? "#31404e" : "#dfdfdf";
      line.appendChild(block);
      gsap
        .timeline({ scrollTrigger: { trigger: line, start: "top 92%", once: true } })
        .to(block, {
          backgroundColor: dark ? "#5a6d7f" : "#bbbec0",
          duration: 0.22,
          ease: "power1.inOut",
          repeat: 1,
          yoyo: true,
          delay: 0.06 * index,
        })
        .to(block, { autoAlpha: 0, duration: 0.3, ease: "power2.inOut" });
    });
  });
}

/** Scramble-in for short mono strings (rejection messages, tags). */
export function scrambleIn(select: Select) {
  select("[data-scramble]").forEach((el) => {
    const text = el.textContent ?? "";
    ScrollTrigger.create({
      trigger: el,
      start: "top 85%",
      once: true,
      onEnter: () =>
        gsap.fromTo(
          el,
          { scrambleText: { text: " ", chars: "upperCase" } },
          { scrambleText: { text, chars: "upperCase", speed: 0.6 }, duration: 1.2, ease: "none" },
        ),
    });
  });
}
