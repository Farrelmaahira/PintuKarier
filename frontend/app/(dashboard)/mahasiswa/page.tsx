import type { Metadata } from "next";
import { Suspense } from "react";
import { Skeleton } from "@/components/atoms/Skeleton";
import { PageHeader } from "@/components/molecules/PageHeader";
import { StudentHome } from "@/components/organisms/StudentHome";
import shell from "@/styles/shell.module.css";

export const metadata: Metadata = { title: "Portal Mahasiswa" };

export default function StudentPage() {
  return (
    <main id="content" className={shell.page}>
      <PageHeader
        href="/mahasiswa"
        title="Beranda"
        lead="Pantau semua lamaran kamu di sini. Lolos atau belum, tiap keputusan datang bareng penjelasan."
      />
      <Suspense fallback={<Skeleton height="480px" />}>
        <StudentHome />
      </Suspense>
    </main>
  );
}
