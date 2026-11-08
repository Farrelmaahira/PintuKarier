import type { Metadata } from "next";
import { Suspense } from "react";
import { Skeleton } from "@/components/atoms/Skeleton";
import { CandidateDetail } from "@/components/organisms/CandidateDetail";
import shell from "@/styles/shell.module.css";

export const metadata: Metadata = { title: "Analisis kandidat" };

export default function CandidatePage({ params }: PageProps<"/hrd/kandidat/[id]">) {
  return (
    <Suspense
      fallback={
        <main id="content" className={shell.page}>
          <Skeleton height="72px" />
          <Skeleton height="480px" />
        </main>
      }
    >
      <CandidateDetail params={params} />
    </Suspense>
  );
}
