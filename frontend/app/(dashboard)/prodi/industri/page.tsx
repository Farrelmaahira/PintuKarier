import type { Metadata } from "next";
import { PageHeader } from "@/components/molecules/PageHeader";
import { StudyProgramIndustryView } from "@/components/organisms/StudyProgramIndustryView";
import { STUDY_PROGRAM } from "@/lib/data/studyProgram/info";
import shell from "@/styles/shell.module.css";

export const metadata: Metadata = { title: "Kebutuhan Industri & IKU - Prodi" };

export default function IndustryPage() {
  return (
    <main id="content" className={shell.page}>
      <PageHeader
        href="/prodi"
        title="Kebutuhan Industri & Target IKU"
        lead={`${STUDY_PROGRAM.name}, ${STUDY_PROGRAM.campus}. Peta frekuensi teknologi yang disyaratkan mitra, target IKU 1 (masa tunggu kerja), dan dokumen audit LAM-INFOKOM.`}
      />
      <StudyProgramIndustryView />
    </main>
  );
}
