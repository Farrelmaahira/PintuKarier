import { Badge } from "../atoms/Badge";
import { Button } from "../atoms/Button";
import { computeScore } from "@/lib/computeScore";
import type { FeedbackData } from "@/lib/data/student";
import { CATEGORY_TONE } from "@/lib/tone";
import app from "@/styles/app.module.css";
import rows from "@/styles/rows.module.css";

interface FeedbackRowProps {
  feedback: FeedbackData;
  selected: boolean;
  onSelect: () => void;
}

/** Satu feedback di daftar pilihan; baris yang sedang dibuka diberi penanda di tepi kiri. */
export function FeedbackRow({
  feedback,
  selected,
  onSelect,
}: FeedbackRowProps) {
  return (
    <li
      className={rows.row}
      onClick={onSelect}
      style={{
        cursor: "pointer",
        background: selected ? "var(--surface-warm)" : "transparent",
        borderLeft: selected ? "4px solid var(--ink)" : "4px solid transparent",
      }}
    >
      <div className={rows.main}>
        <div className={rows.top}>
          <strong className={app.name}>{feedback.position}</strong>
          <Badge tone={CATEGORY_TONE[feedback.category]!}>
            {feedback.category}
          </Badge>
        </div>
        <dl className={rows.facts}>
          <div>
            <dt>Perusahaan</dt>
            <dd>{feedback.company}</dd>
          </div>
          <div>
            <dt>Penilai</dt>
            <dd>{feedback.sender}</dd>
          </div>
          <div>
            <dt>Tanggal</dt>
            <dd>{feedback.date}</dd>
          </div>
          <div>
            <dt>Skor Bukti</dt>
            <dd className="num">{computeScore(feedback.dimensions)}/100</dd>
          </div>
        </dl>
      </div>
      <div className={rows.actions}>
        <Button
          size="sm"
          variant={selected ? "primary" : "ghost"}
          onClick={onSelect}
        >
          {selected ? "Sedang dibuka" : "Buka feedback"}
        </Button>
      </div>
    </li>
  );
}
