import Link from "next/link";
import { CalendarBlank, CaretRight, GraduationCap, ListChecks, SealCheck, ShieldWarning } from "@phosphor-icons/react/dist/ssr";
import { Badge } from "../atoms/Badge";
import { ScoreBox } from "../atoms/ScoreBox";
import type { Candidate } from "@/lib/data/candidate";
import { computeScore } from "@/lib/computeScore";
import { CATEGORY_TONE, DECISION_TONE } from "@/lib/tone";
import app from "@/styles/app.module.css";
import dashboard from "@/styles/dashboard.module.css";
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
        <span className={app.candMain}>
          <span className={app.candTop}>
            <strong className={`${app.name} ${app.candName}`}>{candidate.name}</strong>
            {candidate.prodiVerified && (
              <span className={dashboard.sealIcon} title="Terverifikasi Prodi PNJ: Sertifikasi & portofolio tervalidasi resmi" aria-label="Terverifikasi Prodi PNJ">
                <SealCheck size={20} weight="fill" />
              </span>
            )}
            {candidate.warning && (
              <span className={app.flag}>
                <ShieldWarning size={16} aria-hidden /> Prompt injection
              </span>
            )}
          </span>
          <span className={app.candFacts}>
            <span title="Program studi">
              <GraduationCap size={15} aria-hidden /> {candidate.studyProgram}
            </span>
            <span title="Angkatan">
              <CalendarBlank size={15} aria-hidden /> Angkatan {candidate.cohortYear}
            </span>
            <span title="Syarat">
              <ListChecks size={15} aria-hidden /> {unmetCount ? `${unmetCount} syarat belum penuh` : "Semua syarat terpenuhi"}
            </span>
          </span>
        </span>
        <span className={app.rowEnd}>
          <span className={app.rowEndBadges}>
            <Badge tone={CATEGORY_TONE[candidate.category]}>{candidate.category}</Badge>
            <Badge tone={DECISION_TONE[candidate.decision]}>{candidate.decision}</Badge>
          </span>
          <CaretRight size={20} aria-hidden />
        </span>
      </Link>
    </li>
  );
}
