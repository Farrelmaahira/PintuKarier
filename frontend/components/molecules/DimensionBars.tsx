import { Meter } from "../atoms/Meter";
import { DIMENSIONS } from "@/lib/data/scoring";
import app from "@/styles/app.module.css";

interface DimensionBarsProps {
  values: readonly number[];
}

/** Skor per dimensi Evidence-Based Scoring beserta bobotnya. */
export function DimensionBars({ values }: DimensionBarsProps) {
  return (
    <ul className={app.dims}>
      {DIMENSIONS.map((d, i) => (
        <li key={d.name} className={app.dim}>
          <span className={app.dimName}>
            {d.name} <span className={app.dimWeight}>{d.weight}%</span>
          </span>
          <Meter value={values[i]!} label={d.name} tone={d.highlight} />
          <span className="num">{values[i]}</span>
        </li>
      ))}
    </ul>
  );
}
