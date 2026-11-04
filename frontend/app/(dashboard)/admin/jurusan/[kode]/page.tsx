import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/molecules/PageHeader";
import { DEPARTMENT_DETAILS } from "@/lib/data/admin/departmentDetails";
import { DepartmentDetailClient } from "./DepartmentDetailClient";
import shell from "@/styles/shell.module.css";

interface PageProps {
  params: Promise<{ kode: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { kode } = await params;
  const upperCode = kode.toUpperCase();
  const dept = DEPARTMENT_DETAILS[upperCode];

  return {
    title: dept ? `Detail Jurusan ${dept.name} - PNJ` : "Detail Jurusan - PNJ",
    description: dept?.description ?? "Rincian statistik dan kurikulum jurusan Politeknik Negeri Jakarta.",
  };
}

export default async function DepartmentDetailPage({ params }: PageProps) {
  const { kode } = await params;
  const upperCode = kode.toUpperCase();
  const dept = DEPARTMENT_DETAILS[upperCode];

  if (!dept) {
    notFound();
  }

  return (
    <main id="content" className={shell.page}>
      <PageHeader
        href="/admin/jurusan"
        title={`Jurusan ${dept.name}`}
        lead={dept.description}
      />
      <DepartmentDetailClient dept={dept} />
    </main>
  );
}

