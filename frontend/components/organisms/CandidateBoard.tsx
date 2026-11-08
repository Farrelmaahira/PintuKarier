import { Plus } from "@phosphor-icons/react/dist/ssr";
import { Button } from "../atoms/Button";
import { EmptyState } from "../molecules/EmptyState";
import { Panel } from "../molecules/Panel";
import { ActiveCandidateBoard } from "./ActiveCandidateBoard";
import type { Candidate } from "@/lib/data/candidate";
import type { Vacancy } from "@/lib/data/student";

interface CandidateBoardProps {
  vacancies: Vacancy[];
  activeVacancy: Vacancy | null;
  candidates: Candidate[];
}

export function CandidateBoard({ vacancies, activeVacancy, candidates }: CandidateBoardProps) {
  if (!activeVacancy) {
    return (
      <Panel title="Kandidat">
        <EmptyState title="Belum ada lowongan" img="undraw/empty" large action={<Button href="/hrd/lowongan/baru">Buat lowongan</Button>}>
          Buat lowongan dulu. Kandidat muncul di sini setelah mereka selesai AI Interview dan kamu jalankan analisis.
        </EmptyState>
      </Panel>
    );
  }
  return (
    <ActiveCandidateBoard
      vacancies={vacancies}
      activeVacancy={activeVacancy}
      candidates={candidates}
      extraActions={
        <Button size="sm" variant="ghost" href="/hrd/lowongan/baru" icon={<Plus size={18} />}>
          Buat lowongan
        </Button>
      }
    />
  );
}
