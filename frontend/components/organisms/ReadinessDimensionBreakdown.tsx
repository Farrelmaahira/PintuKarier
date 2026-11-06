import { ReadinessDimension } from "@/lib/data/readiness/types";
import { Tag } from "../atoms/Tag";
import { Meter } from "../atoms/Meter";
import { Panel } from "../molecules/Panel";
import rows from "@/styles/rows.module.css";
import app from "@/styles/app.module.css";

export interface ReadinessDimensionBreakdownProps {
  dimensions: ReadinessDimension[];
}

export function ReadinessDimensionBreakdown({ dimensions }: ReadinessDimensionBreakdownProps) {
  return (
    <Panel
      title="Rincian 5 Dimensi Penilaian Berbasis Bukti"
      tag="5 Dimensi Penilaian"
      flush
    >
      <ul className={rows.list}>
        {dimensions.map((dim) => (
          <li key={dim.name} className={rows.row} style={{ gridTemplateColumns: "1fr auto" }}>
            <div className={rows.main} style={{ gap: "6px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                <strong style={{ fontSize: "16px", letterSpacing: "-0.02em" }}>{dim.name}</strong>
                <Tag>Bobot {dim.weight}%</Tag>
              </div>

              <p style={{ fontSize: "14px", color: "var(--text-muted)", margin: 0 }}>
                {dim.description}
              </p>

              <Meter value={dim.score} label={dim.name} tone="var(--accent)" />

              <blockquote className={app.quote} style={{ margin: "4px 0 0" }}>
                “{dim.evidence}”
                <cite>Bukti Terverifikasi Portofolio / Magang</cite>
              </blockquote>
            </div>

            <div style={{ textAlign: "right", minWidth: "64px" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: "20px" }}>
                {dim.score.toFixed(1)}
              </span>
              <span style={{ display: "block", fontSize: "11px", color: "var(--text-muted)" }}>/100</span>
            </div>
          </li>
        ))}
      </ul>
    </Panel>
  );
}
