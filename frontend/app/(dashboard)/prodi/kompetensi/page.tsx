import type { Metadata } from "next";
import { Suspense } from "react";
import { Skeleton } from "@/components/atoms/Skeleton";
import { PageHeader } from "@/components/molecules/PageHeader";
import { StudyProgramCompetencySection } from "@/components/organisms/StudyProgramCompetencySection";
import shell from "@/styles/shell.module.css";

export const metadata: Metadata = { title: "Analisis Kompetensi - Prodi" };

export default function CompetencyPage() {
  return (
    <main id="content" className={shell.page}>
      <PageHeader
        href="/prodi"
        title="Analisis Kompetensi"
        lead="Kompetensi yang paling sering membuat lulusan gagal seleksi."
      />
      <Suspense fallback={<Skeleton height="480px" />}>
        <StudyProgramCompetencySection />
      </Suspense>
    </main>
  );
}
