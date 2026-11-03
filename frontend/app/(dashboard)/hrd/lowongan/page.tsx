import type { Metadata } from "next";
import { Suspense } from "react";
import { Skeleton } from "@/components/atoms/Skeleton";
import { PageHeader } from "@/components/molecules/PageHeader";
import { VacancyFormSection } from "@/components/organisms/VacancyFormSection";
import shell from "@/styles/shell.module.css";

export const metadata: Metadata = { title: "Lowongan" };

export default function VacanciesPage() {
  return (
    <main id="content" className={shell.page}>
      <PageHeader
        href="/hrd"
        title="Lowongan"
        lead="Bikin lowongan dengan syarat wajib yang jelas. Syarat inilah yang dicocokkan ke bukti di CV dan interview."
      />
      <Suspense fallback={<Skeleton height="360px" />}>
        <VacancyFormSection />
      </Suspense>
    </main>
  );
}
