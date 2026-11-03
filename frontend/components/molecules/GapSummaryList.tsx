interface GapSummaryListProps {
  gaps: [string, number][];
}

/** Daftar singkat kompetensi dengan persentase kandidat yang belum memenuhi. */
export function GapSummaryList({ gaps }: GapSummaryListProps) {
  return (
    <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: 8 }}>
      {gaps.map(([name, percent]) => (
        <li
          key={name}
          style={{ display: "flex", justifyContent: "space-between", padding: "6px 10px", background: "var(--surface-warm)", fontSize: 13, borderLeft: "3px solid var(--cat-orange)" }}
        >
          <span>{name}</span>
          <strong className="num">{percent}% kurang</strong>
        </li>
      ))}
    </ul>
  );
}
