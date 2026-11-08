import { ReadinessDimension } from "@/lib/data/readiness/types";
import { scoreTone, TONE_COLOR } from "@/lib/tone";
import { Meter } from "../atoms/Meter";
import { Tag } from "../atoms/Tag";
import { Callout } from "../molecules/Callout";
import { Panel } from "../molecules/Panel";
import { ScoreCell } from "../molecules/ScoreCell";
import rows from "@/styles/rows.module.css";
import app from "@/styles/app.module.css";

export interface ReadinessDimensionBreakdownProps {
  dimensions: ReadinessDimension[];
}

export function ReadinessDimensionBreakdown({ dimensions }: ReadinessDimensionBreakdownProps) {
  return (
    <Panel title="Rincian 5 Dimensi Penilaian" tag="Berbasis Bukti" flush>
      <ul className={rows.list}>
        {dimensions.map((dim) => (
          <li key={dim.name} className={rows.row}>
            <div className={rows.main}>
              <div className={rows.top}>
                <strong>{dim.name}</strong>
                <Tag>Bobot {dim.weight}%</Tag>
              </div>
              <p className={app.meta}>{dim.description}</p>
              <Meter value={dim.score} label={dim.name} tone={TONE_COLOR[scoreTone(dim.score)]} />
              <Callout tone="plain" title="Bukti terverifikasi portofolio / magang">{dim.evidence}</Callout>
            </div>
            <ScoreCell value={dim.score.toFixed(1)} label="/100" />
          </li>
        ))}
      </ul>
    </Panel>
  );
}
