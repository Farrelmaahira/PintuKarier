import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FeedbackDetail } from "./FeedbackDetail";
import { api } from "@/lib/api";
import type { FeedbackData } from "@/lib/data/student";
import app from "@/styles/app.module.css";

interface FeedbackDetailSectionProps {
  params: Promise<{ id: string }>;
}

/** Satu feedback lengkap, dicari dari daftar feedback milik mahasiswa ini. */
export async function FeedbackDetailSection({ params }: FeedbackDetailSectionProps) {
  const { id } = await params;
  const feedback = (await api<FeedbackData[]>("/feedback")).find((item) => item.id === id);
  if (!feedback) notFound();

  return (
    <div className={app.stack} style={{ gap: 24 }}>
      <Link href="/mahasiswa/feedback" className={app.back} style={{ marginBottom: 0 }}>
        <ArrowLeft size={16} aria-hidden /> Kembali ke daftar feedback
      </Link>
      <FeedbackDetail feedback={feedback} />
    </div>
  );
}
