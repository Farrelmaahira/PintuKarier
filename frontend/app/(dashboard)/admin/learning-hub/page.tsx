import type { Metadata } from "next";
import { PageHeader } from "@/components/molecules/PageHeader";
import { AdminLearningManager } from "@/components/organisms/AdminLearningManager";
import shell from "@/styles/shell.module.css";

export const metadata: Metadata = {
  title: "Kelola Learning Hub & Drill - Pusat Karier PNJ",
  description:
    "Pengaturan katalog kurikulum industri dan studi kasus drill kompetensi mahasiswa lintas 7 jurusan.",
};

export default function AdminLearningHubPage() {
  return (
    <main id="content" className={shell.page}>
      <PageHeader
        href="/admin/learning-hub"
        title="Manajemen Learning Hub & Drill"
        lead="Konfigurasi modul kurikulum adaptif industri dan studi kasus drill untuk mahasiswa lintas 7 jurusan Politeknik Negeri Jakarta."
      />
      <AdminLearningManager />
    </main>
  );
}
