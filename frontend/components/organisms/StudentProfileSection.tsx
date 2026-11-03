import { api } from "@/lib/api";
import type { StudentAccount } from "@/lib/data/student";
import { StudentProfile } from "./StudentProfile";

/** Ambil profil dari API saat request, lalu serahkan ke form client. */
export async function StudentProfileSection() {
  return <StudentProfile initial={await api<StudentAccount>("/me/profil")} />;
}
