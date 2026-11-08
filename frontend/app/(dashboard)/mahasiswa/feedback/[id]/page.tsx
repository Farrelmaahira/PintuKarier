import type { Metadata } from "next";
import { Suspense } from "react";
import { Skeleton } from "@/components/atoms/Skeleton";
import { PageHeader } from "@/components/molecules/PageHeader";
import { FeedbackDetailSection } from "@/components/organisms/FeedbackDetailSection";
import shell from "@/styles/shell.module.css";

export const metadata: Metadata = { title: "Detail feedback" };

export default function FeedbackDetailPage({ params }: PageProps<"/mahasiswa/feedback/[id]">) {
  return (
    <main id="content" className={shell.page}>
      <PageHeader href="/mahasiswa" title="Feedback kompetensi" lead="Feedback tertulis dari HRD untuk lamaran ini: apa yang udah oke, apa yang perlu diasah, dan mulai belajar dari mana." />
      <Suspense fallback={<Skeleton height="480px" />}>
        <FeedbackDetailSection params={params} />
      </Suspense>
    </main>
  );
}
