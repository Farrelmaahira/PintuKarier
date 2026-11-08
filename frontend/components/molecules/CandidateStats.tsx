import { Stat } from "./Stat";
import { StatGrid } from "./StatGrid";
import type { Candidate } from "@/lib/data/candidate";
import { computeScore } from "@/lib/computeScore";

interface CandidateStatsProps {
  applicants: number;
  candidates: Candidate[];
}

/** Ringkasan angka kandidat satu lowongan: pelamar, yang sudah dianalisis, rata-rata skor, dan yang menunggu keputusan. */
export function CandidateStats({ applicants, candidates }: CandidateStatsProps) {
  const averageScore = candidates.length
    ? Math.round(candidates.reduce((total, candidate) => total + computeScore(candidate.dimensions), 0) / candidates.length)
    : 0;
  const undecided = candidates.filter((candidate) => candidate.decision === "Belum diputuskan").length;
  return (
    <StatGrid cols={4}>
      <Stat label="Total pelamar" value={applicants} />
      <Stat label="Selesai dianalisis" value={candidates.length} />
      <Stat label="Rata-rata skor" value={averageScore} />
      <Stat label="Nunggu keputusan" value={undecided} />
    </StatGrid>
  );
}
