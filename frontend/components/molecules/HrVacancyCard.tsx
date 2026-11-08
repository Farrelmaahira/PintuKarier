"use client";

import Link from "next/link";
import { useState } from "react";
import { Buildings, Calendar, Eye, MapPin, PencilSimple, Trash, Users } from "@phosphor-icons/react";
import { Badge } from "../atoms/Badge";
import { Button } from "../atoms/Button";
import { Callout } from "./Callout";
import { ConfirmDialog } from "./ConfirmDialog";
import { deleteVacancy } from "@/lib/actions/deleteVacancy";
import type { Vacancy } from "@/lib/data/student";
import { formatDeadline } from "@/lib/toVacancySummary";
import app from "@/styles/app.module.css";

interface HrVacancyCardProps {
  vacancy: Vacancy;
}

/** Satu lowongan milik HRD di grid: preview, edit, dan hapus dengan konfirmasi. */
export function HrVacancyCard({ vacancy }: HrVacancyCardProps) {
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function confirmDelete() {
    setDeleting(true);
    setError(null);
    const result = await deleteVacancy(vacancy.id);
    setDeleting(false);
    if (result.ok) setConfirming(false);
    else setError(result.error);
  }

  const close = () => {
    if (!deleting) setConfirming(false);
  };

  return (
    <>
      <li className={app.jobCard}>
        <div className={app.jobCardTop}>
          <span className={app.meta} style={{ fontWeight: 500 }}>
            {vacancy.type}
          </span>
          <Badge tone={vacancy.closed ? "orange" : "green"}>{vacancy.closed ? "Ditutup" : "Dibuka"}</Badge>
        </div>

        <div className={app.jobCardBody}>
          <div className={app.jobCardTitle}>
            <Link href={`/hrd/lowongan/${vacancy.id}`} className={app.name} style={{ display: "block", fontSize: 20 }}>
              {vacancy.position}
            </Link>
            <div className={app.jobCardMeta}>
              <span>
                <Buildings size={15} aria-hidden />
                {vacancy.company}
              </span>
              <span>
                <MapPin size={15} aria-hidden />
                {vacancy.location}
              </span>
              <span>
                <Calendar size={15} aria-hidden />
                Batas: {formatDeadline(vacancy.deadline)}
              </span>
            </div>
          </div>

          <div className={app.jobCardCount}>
            <span>Total pelamar</span>
            <span className="num">{vacancy.applicants} orang</span>
          </div>
        </div>

        <div className={app.jobCardFooterGrid}>
          <Button size="sm" block href={`/hrd/lowongan/${vacancy.id}`} icon={<Eye size={18} />}>
            Preview
          </Button>
          <Button size="sm" block href={`/hrd/lowongan/${vacancy.id}/pelamar`} icon={<Users size={18} />}>
            Pelamar
          </Button>
          <Button size="sm" block variant="ghost" href={`/hrd/lowongan/${vacancy.id}/edit`} icon={<PencilSimple size={18} />}>
            Edit
          </Button>
          <Button
            size="sm"
            block
            variant="danger"
            icon={<Trash size={18} />}
            onClick={() => {
              setError(null);
              setConfirming(true);
            }}
          >
            Hapus
          </Button>
        </div>
      </li>

      {confirming && (
        <ConfirmDialog title="Hapus Lowongan" confirmLabel="Hapus Lowongan" isBusy={deleting} error={error} onConfirm={confirmDelete} onClose={close}>
          <Callout title={vacancy.position}>
            {vacancy.type} · {vacancy.jobField} · {vacancy.applicants} pelamar terdaftar
          </Callout>
          <p>Apakah kamu yakin ingin menghapus lowongan ini? Tindakan ini permanen dan tidak dapat dibatalkan.</p>
          {vacancy.applicants > 0 && (
            <Callout tone="warn" title="Perhatian">
              Lowongan yang sudah punya pelamar tidak bisa dihapus. Tutup lowongan dengan mengatur deadline.
            </Callout>
          )}
        </ConfirmDialog>
      )}
    </>
  );
}
