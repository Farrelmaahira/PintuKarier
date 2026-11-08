"use client";

import { useState } from "react";
import { BookOpen, Check } from "@phosphor-icons/react";
import { Badge } from "../atoms/Badge";
import { Button } from "../atoms/Button";
import { Callout } from "../molecules/Callout";
import { KeyValue } from "../molecules/KeyValue";
import { Notice } from "../molecules/Notice";
import { Panel } from "../molecules/Panel";
import { CURRICULUM_RECOMMENDATIONS } from "@/lib/data/studyProgram/curriculum";
import app from "@/styles/app.module.css";
import rows from "@/styles/rows.module.css";
import shell from "@/styles/shell.module.css";

export function StudyProgramCurriculumView() {
  const [adoptedModules, setAdoptedModules] = useState<Record<string, boolean>>({});

  const toggleAdopt = (id: string) => {
    setAdoptedModules((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className={shell.stack}>
      <Notice tone="info">AI Menganalisis alasan gugur kandidat tiap semester dan mengusulkan revisi silabus/RPS serta modul proyek PBL ke mata kuliah terkait.</Notice>

      {CURRICULUM_RECOMMENDATIONS.map((rec) => {
        const adopted = !!adoptedModules[rec.id];
        return (
          <Panel
            key={rec.id}
            title={`Rekomendasi: ${rec.competency}`}
            tag={`Mata Kuliah: ${rec.course} (Semester ${rec.semester})`}
            actions={<Badge tone={adopted ? "green" : "accent"}>{adopted ? "Sudah Diadopsi ke RPS" : "Usulan AI Baru"}</Badge>}
          >
            <Callout tone="warn" title="Defisit di Seleksi Industri">
              {rec.deficit}
            </Callout>

            <span className={app.label}>Usulan Modul Praktikum Baru</span>
            <div className={app.jobGrid}>
              {rec.newModules.map((mod) => (
                <div key={mod.title} className={app.jobCard}>
                  <div className={app.jobCardTop}>
                    <span className={`${app.meta} num`}>{mod.schedule}</span>
                  </div>
                  <div className={app.jobCardBody}>
                    <strong className={app.name}>{mod.title}</strong>
                    <p className={app.meta}>{mod.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <KeyValue
              items={[
                ["Rekomendasi PBL", rec.pblProject],
                ["Sertifikasi Mitra", rec.partnerCertification],
              ]}
            />

            <div className={rows.actions}>
              <Button size="sm" variant={adopted ? "ghost" : "primary"} onClick={() => toggleAdopt(rec.id)} icon={adopted ? <Check size={18} /> : <BookOpen size={18} />}>
                {adopted ? "Batalkan Adopsi" : "Adopsi ke RPS Semester Depan"}
              </Button>
            </div>
          </Panel>
        );
      })}
    </div>
  );
}
