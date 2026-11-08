import { ApplyFlow } from "./ApplyFlow";
import { VacancyList } from "./VacancyList";
import { api } from "@/lib/api";
import type { Application, CvProfile, Vacancy } from "@/lib/data/student";
import { toVacancySummary } from "@/lib/toVacancySummary";

interface ApplySectionProps {
  searchParams: Promise<{ lowongan?: string | string[] }>;
}

/** Data alur lamaran dari API: daftar lowongan, atau satu lowongan beserta lamaran yang sudah berjalan. */
export async function ApplySection({ searchParams }: ApplySectionProps) {
  // `lowongan` adalah nama parameter di URL (/mahasiswa/lamar?lowongan=...), jadi tidak ikut diganti.
  const { lowongan: vacancyId } = await searchParams;
  if (typeof vacancyId !== "string" || !vacancyId) {
    const vacancies = await api<Vacancy[]>("/lowongan");
    return <VacancyList vacancies={vacancies.map(toVacancySummary)} />;
  }
  const [vacancy, applications] = await Promise.all([
    api<Vacancy>(`/lowongan/${encodeURIComponent(vacancyId)}`),
    api<Application[]>("/lamaran"),
  ]);
  const application = applications.find((item) => item.vacancy === vacancy.id) ?? null;
  const profile =
    application && application.stageCode !== "applied"
      ? await api<CvProfile>(`/lamaran/${encodeURIComponent(application.id)}/profil`)
      : null;
  return <ApplyFlow vacancy={vacancy} application={application} profile={profile} />;
}
