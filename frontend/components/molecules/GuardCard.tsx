import landing from "@/styles/landing.module.css";
import app from "@/styles/app.module.css";

interface GuardCardProps {
  title: string;
  limitation: string;
  difference: string;
  chip: string;
}

/** Satu baris pembeda: keterbatasan solusi lama vs cara Lulusin. */
export function GuardCard({ title, limitation, difference, chip }: GuardCardProps) {
  return (
    <div className={landing.guard} data-reveal-item>
      <h3>{title}</h3>
      <p>
        <span className={app.strike}>{limitation}</span>
      </p>
      <p>{difference}</p>
      <span className={`${landing.reject} ${app.accept}`} data-scramble>
        {chip}
      </span>
    </div>
  );
}
