import type { Metadata } from "next";
import { PageHeader } from "@/components/molecules/PageHeader";
import { StudyProgramOverview } from "@/components/organisms/StudyProgramOverview";
import { STUDY_PROGRAM } from "@/lib/data/studyProgram/info";
import shell from "@/styles/shell.module.css";

export const metadata: Metadata = { title: "Dasbor Utama Program Studi" };

export default function StudyProgramPage() {
  return (
    <main id="content" className={shell.page}>
      <PageHeader
        href="/prodi"
        title="Dasbor Prodi"
        lead={`${STUDY_PROGRAM.name}, ${STUDY_PROGRAM.campus}. Kurikulum dan kebutuhan industri dalam satu ringkasan.`}
      />
      <StudyProgramOverview />
    </main>
  );
}
