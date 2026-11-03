import { Faq } from "./Faq";
import landing from "@/styles/landing.module.css";

export function FaqSection() {
  return (
    <section id="faq" className={landing.section} data-theme-section="light">
      <div className={landing.wrap}>
        <h2 className={landing.h2Display} data-split="words">
          FAQ
        </h2>
        <Faq />
        <p className={landing.faqNote}>Detail lengkap ada di concept paper. Semua data di demo fiktif.</p>
      </div>
    </section>
  );
}
