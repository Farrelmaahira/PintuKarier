import type { Metadata } from "next";
import { Suspense } from "react";
import { Skeleton } from "@/components/atoms/Skeleton";
import { PageHeader } from "@/components/molecules/PageHeader";
import { VacancyEditSection } from "@/components/organisms/VacancyEditSection";
import shell from "@/styles/shell.module.css";

export const metadata: Metadata = { title: "Ubah lowongan" };

export default function EditVacancyPage({ params }: PageProps<"/hrd/lowongan/[id]/edit">) {
  return (
    <main id="content" className={shell.page}>
      <PageHeader href="/hrd" back={{ href: "/hrd/lowongan", label: "Semua lowongan" }} title="Ubah lowongan" lead="Perubahan syarat tidak menghapus lamaran yang sudah masuk." />
      <Suspense fallback={<Skeleton height="480px" />}>
        <VacancyEditSection params={params} />
      </Suspense>
    </main>
  );
}
