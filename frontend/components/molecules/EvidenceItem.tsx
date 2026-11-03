import { Badge } from "../atoms/Badge";
import { Tag } from "../atoms/Tag";
import type { Evidence } from "@/lib/data/candidate";
import { EVIDENCE_TONE } from "@/lib/tone";
import app from "@/styles/app.module.css";

interface EvidenceItemProps {
  evidence: Evidence;
}

export function EvidenceItem({ evidence }: EvidenceItemProps) {
  return (
    <li className={app.evidence}>
      <div className={app.evidenceHead}>
        <strong>{evidence.requirement}</strong>
        {evidence.mustHave && <Tag>Wajib</Tag>}
        <Badge tone={EVIDENCE_TONE[evidence.status]}>{evidence.status}</Badge>
      </div>
      {evidence.quote ? (
        <blockquote className={app.quote}>
          “{evidence.quote}”<cite>Sumber: {evidence.source}</cite>
        </blockquote>
      ) : (
        <p className={app.missing}>
          Nggak ketemu buktinya di CV, pre-screening, maupun interview.
        </p>
      )}
    </li>
  );
}
