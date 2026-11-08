import { PencilSimple } from "@phosphor-icons/react/dist/ssr";
import { notFound } from "next/navigation";
import { Badge } from "../atoms/Badge";
import { Button } from "../atoms/Button";
import { ChipList } from "../molecules/ChipList";
import { KeyValue } from "../molecules/KeyValue";
import { PageHeader } from "../molecules/PageHeader";
import { Panel } from "../molecules/Panel";
import { api } from "@/lib/api";
import type { Vacancy } from "@/lib/data/student";
import { formatDeadline } from "@/lib/toVacancySummary";
import shell from "@/styles/shell.module.css";
import ui from "@/styles/ui.module.css";

/** Pratinjau lowongan satu halaman; 404 dan 403 (milik HRD lain) tampil sebagai tidak ditemukan. */
export async function VacancyPreview({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const vacancy = await api<Vacancy>(`/lowongan/${encodeURIComponent(id)}`).catch((e: Error) => {
    if (e.cause === 404 || e.cause === 403) notFound();
    throw e;
  });

  return (
    <main id="content" className={shell.page}>
      <PageHeader
        back={{ href: "/hrd/lowongan", label: "Semua lowongan" }}
        title={vacancy.position}
        lead={`${vacancy.company} · ${vacancy.location}`}
        aside={
          <div className={ui.btnRow}>
            <Badge tone={vacancy.closed ? "orange" : "green"}>{vacancy.closed ? "Ditutup" : "Dibuka"}</Badge>
            <Button size="sm" variant="ghost" href={`/hrd/lowongan/${vacancy.id}/edit`} icon={<PencilSimple size={18} />}>
              Edit
            </Button>
          </div>
        }
      />
      <div className={shell.split}>
        <div className={shell.stack}>
          <Panel title="Deskripsi">
            <p style={{ whiteSpace: "pre-line" }}>{vacancy.description || "Belum ada deskripsi."}</p>
          </Panel>
          <Panel title="Syarat wajib">
            <ChipList items={vacancy.mustHave} />
          </Panel>
          {vacancy.niceToHave.length > 0 && (
            <Panel title="Nilai plus">
              <ChipList items={vacancy.niceToHave} />
            </Panel>
          )}
        </div>
        <Panel title="Ringkasan">
          <KeyValue
            items={[
              ["Tipe", vacancy.type],
              ["Kelompok", vacancy.jobField],
              ["Perusahaan", vacancy.company],
              ["Lokasi", vacancy.location],
              ["Batas lamar", formatDeadline(vacancy.deadline)],
              ["Pelamar", `${vacancy.applicants} orang`],
            ]}
          />
        </Panel>
      </div>
    </main>
  );
}
