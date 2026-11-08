import type { Metadata } from "next";
import { PageHeader } from "@/components/molecules/PageHeader";
import { ProdiStudentManager } from "@/components/organisms/ProdiStudentManager";
import shell from "@/styles/shell.module.css";

export const metadata: Metadata = {
  title: "Data Mahasiswa & Audit Bukti Portofolio",
};

export default function ProdiMahasiswaPage() {
  return (
    <main id="content" className={shell.page}>
      <PageHeader
        href="/prodi"
        title="Data Mahasiswa"
        lead="Periksa CV dan verifikasi sertifikat mahasiswa. Hasilnya langsung tampil di dashboard HRD."
      />
      <ProdiStudentManager />
    </main>
  );
}

