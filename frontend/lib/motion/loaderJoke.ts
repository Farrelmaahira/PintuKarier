import { gsap } from "../gsap";
import type { Cleanup, Select } from "./select";

/** Tombol tutup di loader cuma bercanda: teks diacak sebentar lalu dikembalikan. */
export function attachLoaderJoke(select: Select): Cleanup {
  const closeButton = select("[data-close]")[0]!;
  const [openTag, closeTag] = select("[data-tag]") as [HTMLElement, HTMLElement];
  const status = select("[data-status]")[0]!;
  let joking = false;

  const onClose = () => {
    if (joking) return;
    joking = true;
    const before = [openTag.textContent ?? "", closeTag.textContent ?? "", status.textContent ?? ""];
    gsap.to(openTag, { scrambleText: { text: "<sabar-dulu>" } });
    gsap.to(closeTag, { scrambleText: { text: "</sabar-dulu>" } });
    gsap.to(status, { scrambleText: { text: "BARU JUGA NYAMPE", chars: "upperCase" } });
    gsap.delayedCall(2, () => {
      gsap.to(openTag, { scrambleText: { text: before[0]! } });
      gsap.to(closeTag, { scrambleText: { text: before[1]! } });
      gsap.to(status, { scrambleText: { text: before[2]!, chars: "upperCase" } });
      joking = false;
    });
  };
  closeButton.addEventListener("click", onClose);
  return () => closeButton.removeEventListener("click", onClose);
}
