import type { Metadata } from "next";
import { Suspense } from "react";
import { Skeleton } from "@/components/atoms/Skeleton";
import { PageHeader } from "@/components/molecules/PageHeader";
import { ApplySection } from "@/components/organisms/ApplySection";
import shell from "@/styles/shell.module.css";

export const metadata: Metadata = { title: "Lamar lowongan" };

export default function ApplyPage({ searchParams }: PageProps<"/mahasiswa/lamar">) {
  return (
    <main id="content" className={shell.page}>
      <PageHeader
        href="/mahasiswa"
        title="Lamar lowongan"
        lead="Unggah CV sekali, profil kamu keisi otomatis. Cek, jawab 3 pertanyaan, terus AI Interview."
      />
      {/* ?lowongan= dibaca saat request, jadi data lamaran dimuat di dalam Suspense. */}
      <Suspense fallback={<Skeleton height="420px" />}>
        <ApplySection searchParams={searchParams} />
      </Suspense>
    </main>
  );
}
