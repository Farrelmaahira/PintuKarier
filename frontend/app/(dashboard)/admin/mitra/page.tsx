import type { Metadata } from "next";
import { PageHeader } from "@/components/molecules/PageHeader";
import { AdminMitraClient } from "./AdminMitraClient";
import shell from "@/styles/shell.module.css";

export const metadata: Metadata = { title: "Mitra Industri & Audit SLA - PNJ" };

export default function AdminMitraPage() {
  return (
    <main id="content" className={shell.page}>
      <PageHeader
        href="/admin/mitra"
        title="Mitra Perusahaan & Audit SLA"
        lead="Daftar korporasi mitra rekrutmen resmi Politeknik Negeri Jakarta beserta kepatuhan pengiriman feedback ke kandidat."
      />
      <AdminMitraClient />
    </main>
  );
}
