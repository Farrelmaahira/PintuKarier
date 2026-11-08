import { ArrowDownRight, ArrowUpRight, Minus } from "@phosphor-icons/react/dist/ssr";
import { Meter } from "../atoms/Meter";
import app from "@/styles/app.module.css";

interface CompetencyRowProps {
  rank: number;
  name: string;
  percent: number;
  previous?: number | null;
  course?: string;
}

/**
 * Satu kompetensi di peringkat Dasbor Prodi: % kandidat yang belum memenuhi dan perubahannya.
 * `sebelumnya` undefined = kompetensi baru muncul, null = tidak ada periode pembanding.
 */
export function CompetencyRow({ rank, name, percent, previous, course }: CompetencyRowProps) {
  const delta = previous == null ? null : percent - previous;
  // Naik = makin banyak yang gugur, jadi naik diberi oranye.
  const tone = delta === null || delta === 0 ? "none" : delta > 0 ? "up" : "down";
  return (
    <li className={app.comp} data-reveal-item>
      <span className={app.rank}>{String(rank).padStart(2, "0")}</span>
      <div className={app.compMain}>
        <div className={app.compHead}>
          <strong>{name}</strong>
          <span className="num">{percent}%</span>
        </div>
        <Meter value={percent} label={`${name}: ${percent}% kandidat belum memenuhi`} tone={rank === 1 ? "var(--cat-orange)" : "var(--accent)"} />
        {course && <span className={app.meta}>Mata kuliah terkait: {course}</span>}
      </div>
      {previous !== null && (
      <span className={app.delta} data-tone={tone}>
        {delta === null ? (
          "Baru"
        ) : (
          <>
            {delta > 0 ? <ArrowUpRight size={14} /> : delta < 0 ? <ArrowDownRight size={14} /> : <Minus size={14} />}
            {delta > 0 ? "+" : ""}
            {delta} poin
          </>
        )}
      </span>
      )}
    </li>
  );
}
