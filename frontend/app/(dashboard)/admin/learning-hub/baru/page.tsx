import type { Metadata } from "next";
import { PageHeader } from "@/components/molecules/PageHeader";
import { AdminLearningEditor } from "@/components/organisms/AdminLearningEditor";
import shell from "@/styles/shell.module.css";

export const metadata: Metadata = { title: "Modul baru - Pusat Karier PNJ" };

export default function NewLearningModulePage() {
  return (
    <main id="content" className={shell.page}>
      <PageHeader href="/admin/learning-hub" back={{ href: "/admin/learning-hub", label: "Semua modul" }} title="Modul baru" lead="Tambah modul belajar dan studi kasus drill untuk mahasiswa." />
      <AdminLearningEditor />
    </main>
  );
}
