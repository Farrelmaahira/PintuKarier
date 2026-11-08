import type { Metadata } from "next";
import { Suspense } from "react";
import { Skeleton } from "@/components/atoms/Skeleton";
import { PageHeader } from "@/components/molecules/PageHeader";
import { FeedbackSection } from "@/components/organisms/FeedbackSection";
import shell from "@/styles/shell.module.css";

export const metadata: Metadata = { title: "Feedback kompetensi" };

export default function FeedbackPage() {
  return (
    <main id="content" className={shell.page}>
      <PageHeader
        href="/mahasiswa"
        title="Belum lolos, tapi sekarang jelas."
        lead="Ini feedback tertulis dari HRD: apa yang udah oke, apa yang perlu diasah, dan mulai belajar dari mana."
      />
      <Suspense fallback={<Skeleton height="480px" />}>
        <FeedbackSection />
      </Suspense>
    </main>
  );
}
