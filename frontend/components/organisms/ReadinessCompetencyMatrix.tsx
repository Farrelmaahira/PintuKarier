import { ReadinessCompetency } from "@/lib/data/readiness/types";
import { Badge } from "../atoms/Badge";
import { Tag } from "../atoms/Tag";
import { Meter } from "../atoms/Meter";
import { Panel } from "../molecules/Panel";
import rows from "@/styles/rows.module.css";

export interface ReadinessCompetencyMatrixProps {
  competencies: ReadinessCompetency[];
}

export function ReadinessCompetencyMatrix({ competencies }: ReadinessCompetencyMatrixProps) {
  return (
    <Panel
      title="Matriks Penguasaan Kompetensi Terverifikasi"
      tag="Keahlian Industri"
      flush
    >
      <ul className={rows.list}>
        {competencies.map((comp) => {
          const tone =
            comp.progress >= 85
              ? "green"
              : comp.progress >= 60
              ? "yellow"
              : "orange";

          return (
            <li key={comp.name} className={rows.row} style={{ gridTemplateColumns: "1fr auto" }}>
              <div className={rows.main} style={{ gap: "6px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                  <strong style={{ fontSize: "16px", letterSpacing: "-0.02em" }}>{comp.name}</strong>
                  <Tag>{comp.category}</Tag>
                  <Badge tone={tone}>{comp.level}</Badge>
                </div>

                <Meter value={comp.progress} label={comp.name} tone="var(--accent)" />

                <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                  <span>Sumber Bukti: </span>
                  <span style={{ fontWeight: 500, color: "var(--ink)" }}>{comp.evidenceSrc}</span>
                </div>
              </div>

              <div style={{ textAlign: "right", minWidth: "60px" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: "18px" }}>
                  {comp.progress.toFixed(0)}%
                </span>
                <span style={{ display: "block", fontSize: "11px", color: "var(--text-muted)" }}>Capaian</span>
              </div>
            </li>
          );
        })}
      </ul>
    </Panel>
  );
}
