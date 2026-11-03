import type { Metadata } from "next";
import { Suspense } from "react";
import { Skeleton } from "@/components/atoms/Skeleton";
import { PageHeader } from "@/components/molecules/PageHeader";
import { PracticeInterviewSection } from "@/components/organisms/PracticeInterviewSection";
import shell from "@/styles/shell.module.css";

export const metadata: Metadata = { title: "Latihan AI Interview" };

export default function InterviewPage() {
  return (
    <main id="content" className={shell.page}>
      <PageHeader
        href="/mahasiswa"
        title="Latihan AI Interview"
        lead="Simulasi tanya jawab wawancara kerja terarah dengan AI. Pilih bidang peminatan atau sesuaikan dengan program studi kamu untuk latihan yang personal."
      />
      <Suspense fallback={<Skeleton height="480px" />}>
        <PracticeInterviewSection />
      </Suspense>
    </main>
  );
}
