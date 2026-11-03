import { CandidateRow } from "../molecules/CandidateRow";
import { EmptyState } from "../molecules/EmptyState";
import type { Candidate } from "@/lib/data/candidate";
import rows from "@/styles/rows.module.css";

interface CandidateListProps {
  visible: Candidate[];
  ranked: Candidate[];
  totalCount: number;
}

/** Daftar kandidat urut skor; `ranked` menentukan nomor urut walau daftar sedang difilter. */
export function CandidateList({ visible, ranked, totalCount }: CandidateListProps) {
  if (!visible.length) {
    return (
      <EmptyState
        title={totalCount ? "Belum ada kandidat di kategori ini" : "Belum ada kandidat yang dianalisis"}
        img="undraw/empty"
        large
      >
        Coba filter lain, atau jalankan analisis buat kandidat yang baru selesai interview.
      </EmptyState>
    );
  }
  return (
    <ul className={rows.list}>
      {visible.map((candidate) => (
        <CandidateRow key={candidate.id} candidate={candidate} rank={ranked.indexOf(candidate) + 1} />
      ))}
    </ul>
  );
}
