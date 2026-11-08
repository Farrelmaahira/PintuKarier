import type { Metadata } from "next";
import { Suspense } from "react";
import { Skeleton } from "@/components/atoms/Skeleton";
import { VacancyPreview } from "@/components/organisms/VacancyPreview";
import shell from "@/styles/shell.module.css";

export const metadata: Metadata = { title: "Preview lowongan" };

export default function VacancyPreviewPage({ params }: PageProps<"/hrd/lowongan/[id]">) {
  return (
    <Suspense
      fallback={
        <main id="content" className={shell.page}>
          <Skeleton height="72px" />
          <Skeleton height="480px" />
        </main>
      }
    >
      <VacancyPreview params={params} />
    </Suspense>
  );
}
