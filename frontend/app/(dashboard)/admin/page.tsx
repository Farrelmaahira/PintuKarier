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
        title="Dasbor Kampus"
        lead="Serapan kerja, kesiapan lulusan, dan SLA feedback di seluruh jurusan."
      />
      <AdminOverviewSection />
    </main>
  );
}
