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
        title="Dasbor Program Studi"
        lead={`${STUDY_PROGRAM.name}, ${STUDY_PROGRAM.campus}. Ringkasan eksekutif link-and-match kurikulum kampus dengan standar seleksi industri.`}
      />
      <StudyProgramOverview />
    </main>
  );
}
