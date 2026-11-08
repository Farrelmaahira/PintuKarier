import { Button } from "../atoms/Button";
import { EmptyState } from "../molecules/EmptyState";
import { Panel } from "../molecules/Panel";
import type { FeedbackData } from "@/lib/data/student";

interface LatestFeedbackPanelProps {
  feedback?: FeedbackData;
}

/** Feedback terbaru dari HRD, atau penjelasan kenapa belum ada. */
export function LatestFeedbackPanel({ feedback }: LatestFeedbackPanelProps) {
  return (
    <Panel title="Feedback terbaru">
      {feedback ? (
        <>
          <p>
            {feedback.position} di {feedback.company}: {feedback.area.length} kompetensi yang bisa kamu asah, lengkap sama saran belajarnya.
          </p>
          <Button href="/mahasiswa/feedback" size="sm">
            Baca feedback
          </Button>
        </>
      ) : (
        <EmptyState title="Belum ada feedback" img="undraw/empty" large>
          Begitu HRD selesai meninjau, feedback-nya muncul di sini.
        </EmptyState>
      )}
    </Panel>
  );
}
