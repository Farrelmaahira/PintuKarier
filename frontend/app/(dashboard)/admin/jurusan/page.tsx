import type { Metadata } from "next";
import { PageHeader } from "@/components/molecules/PageHeader";
import { AdminJurusanClient } from "./AdminJurusanClient";
import shell from "@/styles/shell.module.css";

export const metadata: Metadata = { title: "Statistik 7 Jurusan - PNJ" };

export default function AdminJurusanPage() {
  return (
    <main id="content" className={shell.page}>
      <PageHeader
        href="/admin/jurusan"
        title="Statistik Jurusan"
        lead="Daya serap lulusan dan kesenjangan kompetensi per jurusan."
      />
      <AdminJurusanClient />
    </main>
  );
}
