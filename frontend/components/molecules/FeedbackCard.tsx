import { ArrowUpRight, Buildings, UserCircle } from "@phosphor-icons/react/dist/ssr";
import { Badge } from "../atoms/Badge";
import { Button } from "../atoms/Button";
import { computeScore } from "@/lib/computeScore";
import type { FeedbackData } from "@/lib/data/student";
import { CATEGORY_TONE } from "@/lib/tone";
import app from "@/styles/app.module.css";

interface FeedbackCardProps {
  feedback: FeedbackData;
}

/** Kartu feedback satu lowongan, selaras dengan VacancyCard; mengarah ke halaman detail feedback-nya. */
export function FeedbackCard({ feedback }: FeedbackCardProps) {
  return (
    <div className={app.jobCard}>
      <div className={app.jobCardTop}>
        <span className={`${app.meta} num`}>{feedback.date}</span>
        <Badge tone={CATEGORY_TONE[feedback.category]!}>{feedback.category}</Badge>
      </div>

      <div className={app.jobCardBody}>
        <div className={app.jobCardTitle}>
          <strong className={app.name} style={{ display: "block", fontSize: 20 }}>
            {feedback.position}
          </strong>
          <div className={app.jobCardMeta}>
            <span>
              <Buildings size={15} aria-hidden />
              {feedback.company}
            </span>
            <span>
              <UserCircle size={15} aria-hidden />
              {feedback.sender}
            </span>
          </div>
        </div>

        <div className={app.jobCardCount}>
          <span>Skor bukti</span>
          <span className="num">{computeScore(feedback.dimensions)}/100</span>
        </div>
      </div>

      <div className={app.jobCardFooter}>
        <Button href={`/mahasiswa/feedback/${encodeURIComponent(feedback.id)}`} size="sm" block icon={<ArrowUpRight size={18} />}>
          Lihat feedback
        </Button>
      </div>
    </div>
  );
}
