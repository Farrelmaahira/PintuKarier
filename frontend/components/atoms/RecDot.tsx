import app from "@/styles/app.module.css";

interface RecDotProps {
  live: boolean;
}

/** Titik merekam yang berdenyut. */
export function RecDot({ live }: RecDotProps) {
  return <span className={app.recDot} data-live={live} aria-hidden />;
}
