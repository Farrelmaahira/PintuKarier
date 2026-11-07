import Link from "next/link";
import { ArrowLeft, FilePdf } from "@phosphor-icons/react/dist/ssr";
import { Badge } from "../atoms/Badge";
import { Button } from "../atoms/Button";
import { ScoreBox } from "../atoms/ScoreBox";
import { computeScore } from "@/lib/computeScore";
import type { Candidate } from "@/lib/data/candidate";
import { CATEGORY_TONE } from "@/lib/tone";
import app from "@/styles/app.module.css";
import shell from "@/styles/shell.module.css";

interface CandidateHeaderProps {
  candidate: Candidate;
}

/** Kepala halaman kandidat: tautan kembali, nama, lowongan yang dilamar, dan skor. */
export function CandidateHeader({ candidate }: CandidateHeaderProps) {
  const tone = CATEGORY_TONE[candidate.category]!;
  // `lowongan` adalah nama parameter di URL (/hrd?lowongan=...).
  const backHref = candidate.vacancy ? `/hrd?lowongan=${encodeURIComponent(candidate.vacancy)}` : "/hrd";
  return (
    <header className={shell.header}>
      <div>
        <Link href={backHref} className={app.back}>
          <ArrowLeft size={16} aria-hidden /> Semua kandidat
        </Link>
        <h1 className={shell.title}>
          {candidate.name}
          {candidate.prodiVerified && (
            <span style={{ marginLeft: 12, verticalAlign: "middle" }}>
              <Badge tone="green" title="Klaim kompetensi & sertifikasi tervalidasi Prodi">
                🛡️ Terverifikasi Prodi PNJ
              </Badge>
            </span>
          )}
        </h1>
        <p className={shell.lead}>
          {candidate.studyProgram} · angkatan {candidate.cohortYear} · melamar {candidate.position} pada {candidate.appliedOn}
        </p>
        {candidate.cvUrl && (
          <div style={{ marginTop: 10 }}>
            <a href={candidate.cvUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
              <Button variant="ghost" icon={<FilePdf size={18} color="var(--cat-red)" />}>
                Unduh / Lihat Dokumen CV Asli
              </Button>
            </a>
          </div>
        )}
      </div>
      <div className={app.scoreHead}>
        <ScoreBox value={computeScore(candidate.dimensions)} tone={tone} big />
        <Badge tone={tone}>{candidate.category}</Badge>
      </div>
    </header>
  );
}
