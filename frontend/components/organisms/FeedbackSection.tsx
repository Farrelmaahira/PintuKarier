import { api } from "@/lib/api";
import type { FeedbackData } from "@/lib/data/student";
import { FeedbackLetter } from "./FeedbackLetter";

/** Semua feedback yang sudah dikirim HRD ke mahasiswa ini. */
export async function FeedbackSection() {
  return <FeedbackLetter feedbackList={await api<FeedbackData[]>("/feedback")} />;
}
