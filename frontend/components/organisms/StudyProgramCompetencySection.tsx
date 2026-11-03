import { api } from "@/lib/api";
import type { FollowUpNote, Ranking } from "@/lib/data/studyProgram/types";
import { StudyProgramCompetencyView } from "./StudyProgramCompetencyView";

/** Agregat kompetensi prodi pemanggil dan catatan tindak lanjutnya. Grup di bawah 10 kandidat sudah dibuang server. */
export async function StudyProgramCompetencySection() {
  const me = await api<{ studyProgramId: string; institution: string }>("/me");
  const [ranking, notes] = await Promise.all([
    api<Ranking>(`/prodi/${encodeURIComponent(me.studyProgramId)}/ranking`),
    api<FollowUpNote[]>(`/prodi/${encodeURIComponent(me.studyProgramId)}/catatan`),
  ]);
  return <StudyProgramCompetencyView ranking={ranking} notes={notes} studyProgramId={me.studyProgramId} studyProgramName={me.institution} />;
}
