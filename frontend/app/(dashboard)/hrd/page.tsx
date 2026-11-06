import type { Metadata } from "next";
import { Suspense } from "react";
import { Skeleton } from "@/components/atoms/Skeleton";
import { Notice } from "@/components/molecules/Notice";
import { PageHeader } from "@/components/molecules/PageHeader";
import { Panel } from "@/components/molecules/Panel";
import { CandidateBoardSection } from "@/components/organisms/CandidateBoardSection";
import { DIMENSIONS, CATEGORIES } from "@/lib/data/scoring";
import app from "@/styles/app.module.css";
import shell from "@/styles/shell.module.css";

export const metadata: Metadata = { title: "Dashboard HRD" };

export default async function HrdPage({ searchParams }: PageProps<"/hrd">) {
  return (
    <main id="content" className={shell.page}>
      <PageHeader
        href="/hrd"
        title="Kandidat"
        lead="Kandidat udah diurutkan. Tiap skor ada alasan dan kutipan buktinya, jadi kamu tinggal cek dan mutusin."
      />
      <div className={shell.split}>
        <Suspense fallback={<Skeleton height="480px" />}>
          <CandidateBoardSection searchParams={searchParams} />
        </Suspense>
        <div className={shell.stack}>
          <Panel title="Cara baca skor">
            <ul className={app.list}>
              {DIMENSIONS.map((dimension) => (
                <li key={dimension.name}>
                  <strong>{dimension.name}</strong> ({dimension.weight}%): {dimension.example}
                </li>
              ))}
            </ul>
            <ul className={app.list}>
              {CATEGORIES.map((category) => (
                <li key={category.name}>
                  <strong>{category.name}</strong>: {category.range.toLowerCase()}.
                </li>
              ))}
            </ul>
            <Notice tone="info">AI cuma rekomendasi. Kamu bisa koreksi kategori dan keputusan di halaman tiap kandidat.</Notice>
          </Panel>
        </div>
      </div>
    </main>
  );
}
