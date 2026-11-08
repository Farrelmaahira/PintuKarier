"use client";

import { ArrowClockwise } from "@phosphor-icons/react";
import { Button } from "@/components/atoms/Button";
import { Notice } from "@/components/molecules/Notice";
import shell from "@/styles/shell.module.css";

interface DashboardErrorProps {
  error: Error & { digest?: string };
  retry: () => void;
}

/** Error API di dashboard: pesan yang bisa dipulihkan, bukan halaman rusak. */
export default function DashboardError({ retry }: DashboardErrorProps) {
  return (
    <main id="content" className={shell.page}>
      <Notice tone="error">Data belum bisa dimuat. Bisa jadi server lagi sibuk atau koneksi kamu putus sebentar.</Notice>
      <div>
        <Button onClick={retry} icon={<ArrowClockwise size={20} />}>
          Coba lagi
        </Button>
      </div>
    </main>
  );
}
