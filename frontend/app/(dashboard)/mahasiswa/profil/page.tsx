import type { Metadata } from "next";
import { Suspense } from "react";
import { Skeleton } from "@/components/atoms/Skeleton";
import { PageHeader } from "@/components/molecules/PageHeader";
import { StudentProfileSection } from "@/components/organisms/StudentProfileSection";
import shell from "@/styles/shell.module.css";

export const metadata: Metadata = { title: "Profil & CV Mahasiswa" };

export default function StudentProfilePage() {
  return (
    <main id="content" className={shell.page}>
      <PageHeader
        href="/mahasiswa"
        title="Profil & CV Saya"
        lead="Kelola biodata akademik dan keahlian kamu yang dibaca HRD mitra saat kamu melamar."
      />
      <Suspense fallback={<Skeleton height="480px" />}>
        <StudentProfileSection />
      </Suspense>
    </main>
  );
}
