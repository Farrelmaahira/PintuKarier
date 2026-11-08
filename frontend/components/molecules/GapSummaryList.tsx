import app from "@/styles/app.module.css";

interface GapSummaryListProps {
  gaps: [string, number][];
}

/** Daftar singkat kompetensi dengan persentase kandidat yang belum memenuhi. */
export function GapSummaryList({ gaps }: GapSummaryListProps) {
  return (
    <div>
      {gaps.map(([name, percent]) => (
        <div key={name} className={app.jobCardCount} style={{ paddingBottom: 8 }}>
          <span>{name}</span>
          <span className="num">{percent}% kurang</span>
        </div>
      ))}
    </div>
  );
}
