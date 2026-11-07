import Link from "next/link";
import { CaretRight, ShieldWarning } from "@phosphor-icons/react/dist/ssr";
import { Badge } from "../atoms/Badge";
import { ScoreBox } from "../atoms/ScoreBox";
import type { Candidate } from "@/lib/data/candidate";
import { computeScore } from "@/lib/computeScore";
import { CATEGORY_TONE, DECISION_TONE } from "@/lib/tone";
import app from "@/styles/app.module.css";
import rows from "@/styles/rows.module.css";

interface CandidateRowProps {
  candidate: Candidate;
  rank: number;
}

/** Satu kandidat di daftar prioritas HRD. */
export function CandidateRow({ candidate, rank }: CandidateRowProps) {
  const unmetCount = candidate.evidence.filter((item) => item.status !== "Terpenuhi").length;
  return (
    <li className={`${rows.row} ${app.candidate}`} data-reveal-item>
      <Link href={`/hrd/kandidat/${candidate.id}`} className={app.rowLink}>
        <span className={app.rank}>{String(rank).padStart(2, "0")}</span>
        <ScoreBox value={computeScore(candidate.dimensions)} tone={CATEGORY_TONE[candidate.category]!} />
        <span className={rows.main}>
          <span className={rows.top}>
            <strong className={app.name}>{candidate.name}</strong>
            {candidate.prodiVerified && (
              <Badge tone="green" title="Sertifikasi & portofolio telah divalidasi oleh Program Studi PNJ">
                🛡️ Terverifikasi Prodi PNJ
              </Badge>
            )}
            <Badge tone={CATEGORY_TONE[candidate.category]}>{candidate.category}</Badge>
            {candidate.warning && (
              <span className={app.flag}>
                <ShieldWarning size={16} aria-hidden /> Prompt injection
              </span>
            )}
          </span>
          <span className={app.meta}>
            {candidate.studyProgram} · angkatan {candidate.cohortYear} ·{" "}
            {unmetCount ? `${unmetCount} syarat belum penuh` : "semua syarat terpenuhi"}
          </span>
        </span>
        <span className={app.rowEnd}>
          <Badge tone={DECISION_TONE[candidate.decision]}>{candidate.decision}</Badge>
          <CaretRight size={20} aria-hidden />
        </span>
      </Link>
    </li>
  );
}
