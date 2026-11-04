import type { Metadata } from "next";
import { PageHeader } from "@/components/molecules/PageHeader";
import { StudentReadinessClient } from "./StudentReadinessClient";
import shell from "@/styles/shell.module.css";

export const metadata: Metadata = { title: "Readiness Tracker - PintuKarier" };

export default function StudentReadinessPage() {
  return (
    <main id="content" className={shell.page}>
      <PageHeader
        href="/mahasiswa/readiness"
        title="Readiness Tracker"
        lead="Evaluasi kesiapan kerja berbasis 5 dimensi bukti portofolio, drill kompetensi, dan histori peningkatan skor kamu."
      />
      <StudentReadinessClient />
    </main>
  );
}
