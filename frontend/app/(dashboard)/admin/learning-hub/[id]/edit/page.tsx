import type { Metadata } from "next";
import { PageHeader } from "@/components/molecules/PageHeader";
import { AdminLearningEditor } from "@/components/organisms/AdminLearningEditor";
import shell from "@/styles/shell.module.css";

export const metadata: Metadata = { title: "Ubah modul - Pusat Karier PNJ" };

export default async function EditLearningModulePage({ params }: PageProps<"/admin/learning-hub/[id]/edit">) {
  const { id } = await params;
  return (
    <main id="content" className={shell.page}>
      <PageHeader href="/admin/learning-hub" back={{ href: "/admin/learning-hub", label: "Semua modul" }} title="Ubah modul" lead="Perubahan langsung tampil di Learning Hub mahasiswa." />
      <AdminLearningEditor moduleId={id} />
    </main>
  );
}
