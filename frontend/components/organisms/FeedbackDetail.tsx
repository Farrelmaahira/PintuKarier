import { Badge } from "../atoms/Badge";
import { Button } from "../atoms/Button";
import { ScoreBox } from "../atoms/ScoreBox";
import { DimensionBars } from "../molecules/DimensionBars";
import { ImprovementAreaList } from "../molecules/ImprovementAreaList";
import { Panel } from "../molecules/Panel";
import { computeScore } from "@/lib/computeScore";
import type { FeedbackData } from "@/lib/data/student";
import { CATEGORY_TONE } from "@/lib/tone";
import app from "@/styles/app.module.css";
import shell from "@/styles/shell.module.css";

interface FeedbackDetailProps {
  feedback: FeedbackData;
}

/** Isi satu feedback: ringkasan, kekuatan, area pengembangan, dan hasil evaluasi. */
export function FeedbackDetail({ feedback }: FeedbackDetailProps) {
  const tone = CATEGORY_TONE[feedback.category]!;
  return (
    <div className={shell.split}>
      <div className={app.stack}>
        <Panel title={`${feedback.position} · ${feedback.company}`} tag={`Dari ${feedback.sender} · ${feedback.date}`}>
          <p className={app.letter}>{feedback.summary}</p>
          <div className={app.stack}>
            <span className={app.label}>Yang udah oke</span>
            <ul className={app.list}>
              {feedback.strengths.map((strength) => (
                <li key={strength}>{strength}</li>
              ))}
            </ul>
          </div>
        </Panel>
        <Panel title="Kompetensi yang perlu kamu kembangin" flush>
          <ImprovementAreaList areas={feedback.area} />
        </Panel>
        <p className={app.letter}>{feedback.closing}</p>
      </div>
      <div className={app.stack}>
        <Panel title="Hasil evaluasi">
          <div className={app.scoreHead}>
            <ScoreBox value={computeScore(feedback.dimensions)} tone={tone} big />
            <Badge tone={tone}>{feedback.category}</Badge>
          </div>
          <DimensionBars values={feedback.dimensions} />
          <p className={app.meta}>
            Skor dihitung dari bukti di CV, pre-screening, dan AI Interview kamu. Keputusan akhirnya dari HRD.
          </p>
        </Panel>
        <Button href="/mahasiswa">Kembali ke beranda</Button>
      </div>
    </div>
  );
}
