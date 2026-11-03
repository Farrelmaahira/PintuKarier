import type { Metadata } from "next";
import { PageHeader } from "@/components/molecules/PageHeader";
import { StudyProgramCurriculumView } from "@/components/organisms/StudyProgramCurriculumView";
import { STUDY_PROGRAM } from "@/lib/data/studyProgram/info";
import shell from "@/styles/shell.module.css";

export const metadata: Metadata = { title: "Rekomendasi RPS & PBL - Prodi" };

export default function CurriculumPage() {
  return (
    <main id="content" className={shell.page}>
      <PageHeader
        href="/prodi"
        title="Rekomendasi RPS & Proyek PBL"
        lead={`${STUDY_PROGRAM.name}, ${STUDY_PROGRAM.campus}. Diagnostik kurikulum berbasis data industri untuk memperbarui silabus mata kuliah dan modul praktikum.`}
      />
      <StudyProgramCurriculumView />
    </main>
  );
}
