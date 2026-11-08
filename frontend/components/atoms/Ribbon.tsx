import landing from "@/styles/landing.module.css";

interface RibbonProps {
  text: string;
  highlight: string;
}

/** Label pita `# teks }` di atas media kartu. */
export function Ribbon({ text, highlight }: RibbonProps) {
  return (
    <span className={landing.ribbon} style={{ "--hl": highlight } as React.CSSProperties}>
      <span className={landing.ribbonHash}>#</span>
      <span className={landing.ribbonText}>{text}</span>
      <span className={landing.ribbonCap}>{"}"}</span>
    </span>
  );
}
