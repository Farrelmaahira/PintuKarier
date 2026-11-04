import type { Metadata } from "next";
import { PageHeader } from "@/components/molecules/PageHeader";
import { AdminOverviewSection } from "./AdminOverviewSection";
import shell from "@/styles/shell.module.css";

export const metadata: Metadata = { title: "Dasbor Eksekutif Kampus" };

export default function AdminPage() {
  return (
    <main id="content" className={shell.page}>
      <PageHeader
        href="/admin"
        title="Dasbor Eksekutif Kampus"
        lead="Pengawasan makro serapan kerja, kesiapan kompetensi lulusan, dan kepatuhan feedback industri di seluruh 7 jurusan Politeknik Negeri Jakarta."
      />
      <AdminOverviewSection />
    </main>
  );
}
