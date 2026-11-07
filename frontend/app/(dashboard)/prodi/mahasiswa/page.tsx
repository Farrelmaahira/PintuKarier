import type { Metadata } from "next";
import { PageHeader } from "@/components/molecules/PageHeader";
import { ProdiStudentManager } from "@/components/organisms/ProdiStudentManager";
import { STUDY_PROGRAM } from "@/lib/data/studyProgram/info";
import shell from "@/styles/shell.module.css";

export const metadata: Metadata = {
  title: "Data Mahasiswa & Audit Bukti Portofolio",
};

export default function ProdiMahasiswaPage() {
  return (
    <main id="content" className={shell.page}>
      <PageHeader
        href="/prodi"
        title="Data Mahasiswa & Audit Bukti Portofolio"
        lead={`Daftar mahasiswa ${STUDY_PROGRAM.name}. Koordinator prodi dapat memeriksa dokumen CV, memverifikasi keaslian sertifikasi/penghargaan, dan memberikan catatan validasi yang langsung tampil di dashboard HRD.`}
      />
      <ProdiStudentManager />
    </main>
  );
}

