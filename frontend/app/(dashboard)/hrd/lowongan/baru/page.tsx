import type { Metadata } from "next";
import { PageHeader } from "@/components/molecules/PageHeader";
import { VacancyEditor } from "@/components/organisms/VacancyEditor";
import shell from "@/styles/shell.module.css";

export const metadata: Metadata = { title: "Lowongan baru" };

export default function NewVacancyPage() {
  return (
    <main id="content" className={shell.page}>
      <PageHeader
        href="/hrd"
        back={{ href: "/hrd/lowongan", label: "Semua lowongan" }}
        title="Lowongan baru"
        lead="Isi syarat wajib dengan jelas. Syarat inilah yang dicocokkan ke bukti di CV dan interview."
      />
      <VacancyEditor />
    </main>
  );
}
