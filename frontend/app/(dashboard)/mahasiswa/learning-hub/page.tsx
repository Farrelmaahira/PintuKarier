import type { Metadata } from "next";
import { PageHeader } from "@/components/molecules/PageHeader";
import { StudentLearningHubClient } from "./StudentLearningHubClient";
import shell from "@/styles/shell.module.css";

export const metadata: Metadata = {
  title: "Learning Hub & Drill Kompetensi - PintuKarier",
};

export default function StudentLearningHubPage() {
  return (
    <main id="content" className={shell.page}>
      <PageHeader
        href="/mahasiswa/learning-hub"
        title="Learning Hub & Drill Kompetensi"
        lead="Katalog materi industri terkurasi dan studi kasus interaktif untuk menutup kesenjangan kompetensi yang teridentifikasi dari riwayat seleksi kamu."
      />
      <StudentLearningHubClient />
    </main>
  );
}
