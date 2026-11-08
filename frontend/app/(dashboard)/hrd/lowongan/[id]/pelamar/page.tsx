import type { Metadata } from "next";
import { Suspense } from "react";
import { Skeleton } from "@/components/atoms/Skeleton";
import { PageHeader } from "@/components/molecules/PageHeader";
import { VacancyApplicants } from "@/components/organisms/VacancyApplicants";
import shell from "@/styles/shell.module.css";

export const metadata: Metadata = { title: "Pelamar lowongan" };

export default function VacancyApplicantsPage({ params }: PageProps<"/hrd/lowongan/[id]/pelamar">) {
  return (
    <main id="content" className={shell.page}>
      <PageHeader
        href="/hrd"
        back={{ href: "/hrd/lowongan", label: "Semua lowongan" }}
        title="Pelamar"
        lead="Kandidat untuk lowongan ini, sudah diurutkan. Tiap skor ada alasan dan kutipan buktinya, jadi kamu tinggal cek dan mutusin."
      />
      <Suspense fallback={<Skeleton height="480px" />}>
        <VacancyApplicants params={params} />
      </Suspense>
    </main>
  );
}
