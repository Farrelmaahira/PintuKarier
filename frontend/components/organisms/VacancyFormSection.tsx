import { api } from "@/lib/api";
import type { Vacancy } from "@/lib/data/student";
import { VacancyForm } from "./VacancyForm";

/** Lowongan milik HRD pemanggil (backend memfilter per akun). */
export async function VacancyFormSection() {
  return <VacancyForm vacancies={await api<Vacancy[]>("/lowongan")} />;
}
