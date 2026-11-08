import type { FeedbackData } from "@/lib/data/student";
import app from "@/styles/app.module.css";

interface ImprovementAreaListProps {
  areas: FeedbackData["area"];
}

/** Kompetensi yang perlu dikembangkan, lengkap dengan alasan, saran, dan mata kuliah terkait. */
export function ImprovementAreaList({ areas }: ImprovementAreaListProps) {
  return (
    <ol className={app.areas}>
      {areas.map((area, index) => (
        <li key={area.competency} className={app.area}>
          <span className={app.areaNo}>{String(index + 1).padStart(2, "0")}</span>
          <div className={app.stack}>
            <strong className={app.name}>{area.competency}</strong>
            <p>
              <span className={app.label}>Kenapa: </span>
              {area.why}
            </p>
            <p>
              <span className={app.label}>Coba ini: </span>
              {area.advice}
            </p>
            <span className={app.meta}>Mata kuliah terkait: {area.course}</span>
          </div>
        </li>
      ))}
    </ol>
  );
}
