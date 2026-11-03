import { notFound } from "next/navigation";
import { DimensionBars } from "../molecules/DimensionBars";
import { EvidenceItem } from "../molecules/EvidenceItem";
import { CandidateHeader } from "../molecules/CandidateHeader";
import { Notice } from "../molecules/Notice";
import { Panel } from "../molecules/Panel";
import { TranscriptItem } from "../molecules/TranscriptItem";
import { CandidateReview } from "./CandidateReview";
import { CandidateSidePanels } from "./CandidateSidePanels";
import { api } from "@/lib/api";
import type { Candidate } from "@/lib/data/candidate";
import app from "@/styles/app.module.css";
import shell from "@/styles/shell.module.css";

interface CandidateDetailProps {
  params: Promise<{ id: string }>;
}

/** Halaman analisis kandidat: skor, alasan, bukti, transkrip, dan panel keputusan HRD. */
export async function CandidateDetail({ params }: CandidateDetailProps) {
  const { id } = await params;
  // 404 dan 403 (kandidat lowongan HRD lain) sama-sama tampil sebagai tidak ditemukan.
  const candidate = await api<Candidate>(`/kandidat/${encodeURIComponent(id)}`).catch((e: Error) => {
    if (e.cause === 404 || e.cause === 403) notFound();
    throw e;
  });

  return (
    <main id="content" className={shell.page}>
      <CandidateHeader candidate={candidate} />
      {candidate.warning && (
        <Notice tone="error">
          <strong>Prompt injection terdeteksi.</strong> {candidate.warning}
        </Notice>
      )}
      <div className={shell.split}>
        <div className={shell.stack}>
          <Panel title="Alasan penilaian" tag="Evidence-Based Scoring">
            <p className={app.letter}>{candidate.reason}</p>
            <DimensionBars values={candidate.dimensions} />
          </Panel>
          <Panel title="Bukti per syarat" flush>
            <ul className={app.evidenceList}>
              {candidate.evidence.map((item, index) => (
                <EvidenceItem key={`${item.requirement}-${index}`} evidence={item} />
              ))}
            </ul>
          </Panel>
          <Panel title="Transkrip AI Interview" flush>
            <ol className={app.evidenceList}>
              {candidate.transcript.map((entry, index) => (
                <TranscriptItem
                  key={index}
                  no={index + 1}
                  question={candidate.interviewQuestions?.[index] ?? ""}
                  answer={entry.answer}
                  duration={entry.duration}
                />
              ))}
            </ol>
          </Panel>
        </div>
        <div className={shell.stack}>
          <CandidateReview candidate={candidate} />
          <CandidateSidePanels candidate={candidate} />
        </div>
      </div>
    </main>
  );
}
