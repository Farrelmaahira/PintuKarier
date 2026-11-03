import landing from "@/styles/landing.module.css";

interface FaqItemProps {
  index: number;
  question: string;
  answer: string;
  open: boolean;
  onToggle: () => void;
}

/** Satu baris FAQ; tinggi jawaban dianimasikan oleh organism Faq. */
export function FaqItem({ index, question, answer, open, onToggle }: FaqItemProps) {
  return (
    <div className={landing.faqItem} data-state={open ? "open" : "closed"}>
      <button type="button" id={`faq-q-${index}`} className={landing.faqButton} aria-expanded={open} aria-controls={`faq-${index}`} onClick={onToggle}>
        <span className={landing.faqQ}>{question}</span>
        <span className={landing.faqToggle} aria-hidden>
          <span className={landing.faqDots}>
            {Array.from({ length: 9 }, (_, dot) => (
              <i key={dot} />
            ))}
          </span>
        </span>
      </button>
      <div id={`faq-${index}`} className={landing.faqAnswer} data-answer role="region" aria-labelledby={`faq-q-${index}`}>
        <p>{answer}</p>
      </div>
    </div>
  );
}
