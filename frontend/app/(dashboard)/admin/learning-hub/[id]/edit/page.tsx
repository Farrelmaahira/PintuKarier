import type { Metadata } from "next";
import { Suspense } from "react";
import { Skeleton } from "@/components/atoms/Skeleton";
import { PageHeader } from "@/components/molecules/PageHeader";
import { LearningEditSection } from "@/components/organisms/LearningEditSection";
import shell from "@/styles/shell.module.css";

export const metadata: Metadata = { title: "Ubah modul - Pusat Karier PNJ" };

export default function EditLearningModulePage({ params }: PageProps<"/admin/learning-hub/[id]/edit">) {
  return (
    <main id="content" className={shell.page}>
      <PageHeader href="/admin/learning-hub" back={{ href: "/admin/learning-hub", label: "Semua modul" }} title="Ubah modul" lead="Perubahan langsung tampil di Learning Hub mahasiswa." />
      <Suspense fallback={<Skeleton height="480px" />}>
        <LearningEditSection params={params} />
      </Suspense>
    </main>
  );
}
