import { api } from "@/lib/api";
import type { StudentAccount } from "@/lib/data/student";
import { InterviewRoom } from "./InterviewRoom";

/** Mengambil profil mahasiswa saat request untuk menghasilkan simulasi latihan yang terpersonalisasi. */
export async function PracticeInterviewSection() {
  let profile: StudentAccount | null = null;
  try {
    profile = await api<StudentAccount>("/me/profil");
  } catch {
    profile = null;
  }
  return <InterviewRoom mode="practice" profile={profile} />;
}
