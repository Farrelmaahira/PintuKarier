import type { Metadata } from "next";
import { PageHeader } from "@/components/molecules/PageHeader";
import { StudyProgramCurriculumView } from "@/components/organisms/StudyProgramCurriculumView";
import shell from "@/styles/shell.module.css";

export const metadata: Metadata = { title: "Rekomendasi RPS & PBL - Prodi" };

export default function CurriculumPage() {
  return (
    <main id="content" className={shell.page}>
      <PageHeader
        href="/prodi"
        title="Rekomendasi RPS & PBL"
        lead="Usulan revisi silabus dan modul praktikum dari data industri."
      />
      <StudyProgramCurriculumView />
    </main>
  );
}
