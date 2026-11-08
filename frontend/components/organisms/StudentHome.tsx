import { Notice } from "../molecules/Notice";
import { Panel } from "../molecules/Panel";
import { Stat } from "../molecules/Stat";
import { StatGrid } from "../molecules/StatGrid";
import { ApplicationsPanel } from "./ApplicationsPanel";
import { LatestFeedbackPanel } from "./LatestFeedbackPanel";
import { ProfileSummaryPanel } from "./ProfileSummaryPanel";
import { VacanciesPanel } from "./VacanciesPanel";
import { api } from "@/lib/api";
import type { Application, FeedbackData, StudentAccount, Vacancy } from "@/lib/data/student";
import { toVacancySummary } from "@/lib/toVacancySummary";
import shell from "@/styles/shell.module.css";

/** Beranda mahasiswa: lamaran, lowongan terbuka, profil, dan feedback terbaru dari API. */
export async function StudentHome() {
  const [applications, apiVacancies, profile, feedbackList] = await Promise.all([
    api<Application[]>("/lamaran"),
    api<Vacancy[]>("/lowongan"),
    api<StudentAccount>("/me/profil"),
    api<FeedbackData[]>("/feedback"),
  ]);
  const vacancies = apiVacancies.map(toVacancySummary);
  const vacanciesById = new Map(vacancies.map((vacancy) => [vacancy.id, vacancy]));
  const unfinished = applications.find((application) => application.stage <= 2);
  const unfinishedVacancy = unfinished && vacanciesById.get(unfinished.vacancy);

  return (
    <>
      <Panel flush>
        <StatGrid cols={4}>
          <Stat label="Lamaran aktif" value={applications.filter((application) => application.stage < 5).length} />
          <Stat label="Lolos" value={applications.filter((application) => application.status === "Lolos").length} />
          <Stat label="Feedback diterima" value={feedbackList.length} />
          <Stat label="Lowongan terbuka" value={vacancies.filter((vacancy) => vacancy.deadline !== "Ditutup").length} />
        </StatGrid>
      </Panel>
      <div className={shell.split}>
        <div className={shell.stack}>
          <ApplicationsPanel applications={applications} vacancies={vacanciesById} />
          <VacanciesPanel vacancies={vacancies} appliedIds={new Set(applications.map((application) => application.vacancy))} />
        </div>
        <div className={shell.stack}>
          {unfinished && unfinishedVacancy && (
            <Notice tone="pending">
              Lamaran <strong>{unfinishedVacancy.position}</strong> belum selesai. {unfinished.note}
            </Notice>
          )}
          <ProfileSummaryPanel profile={profile} />
          <LatestFeedbackPanel feedback={feedbackList[0]} />
        </div>
      </div>
    </>
  );
}
