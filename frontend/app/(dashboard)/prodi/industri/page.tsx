import type { Metadata } from "next";
import { PageHeader } from "@/components/molecules/PageHeader";
import { StudyProgramIndustryView } from "@/components/organisms/StudyProgramIndustryView";
import shell from "@/styles/shell.module.css";

export const metadata: Metadata = { title: "Kebutuhan Industri & IKU - Prodi" };

export default function IndustryPage() {
  return (
    <main id="content" className={shell.page}>
      <PageHeader
        href="/prodi"
        title="Kebutuhan Industri"
        lead="Teknologi yang dicari mitra dan target IKU 1."
      />
      <StudyProgramIndustryView />
    </main>
  );
}
