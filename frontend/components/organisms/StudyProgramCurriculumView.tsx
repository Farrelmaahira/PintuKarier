"use client";

import { useState } from "react";
import { BookOpen, Check } from "@phosphor-icons/react";
import { Badge } from "../atoms/Badge";
import { Button } from "../atoms/Button";
import { Notice } from "../molecules/Notice";
import { Panel } from "../molecules/Panel";
import { CURRICULUM_RECOMMENDATIONS } from "@/lib/data/studyProgram/curriculum";
import app from "@/styles/app.module.css";

export function StudyProgramCurriculumView() {
  const [adoptedModules, setAdoptedModules] = useState<Record<string, boolean>>({});

  const toggleAdopt = (id: string) => {
    setAdoptedModules((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className={app.stack} style={{ gap: 24 }}>
      <Notice tone="info">
        AI Menganalisis alasan gugur kandidat tiap semester dan mengusulkan revisi silabus/RPS serta modul proyek PBL ke mata kuliah terkait.
      </Notice>

      <div style={{ display: "grid", gap: 20 }}>
        {CURRICULUM_RECOMMENDATIONS.map((rec) => {
          const adopted = !!adoptedModules[rec.id];
          return (
            <Panel
              key={rec.id}
              title={`Rekomendasi: ${rec.competency}`}
              tag={`Mata Kuliah: ${rec.course} (Semester ${rec.semester})`}
              actions={
                <Badge tone={adopted ? "green" : "accent"}>
                  {adopted ? "Sudah Diadopsi ke RPS" : "Usulan AI Baru"}
                </Badge>
              }
            >
              <div className={app.stack} style={{ gap: 16 }}>
                <div style={{ padding: "12px 14px", background: "var(--surface-warm)", borderLeft: "4px solid var(--cat-orange)", fontSize: 14 }}>
                  <strong>Defisit di Seleksi Industri:</strong> {rec.deficit}
                </div>

                <div>
                  <h4 style={{ fontSize: 15, fontWeight: 500, marginBottom: 10 }}>
                    Usulan Modul Praktikum Baru:
                  </h4>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 12 }}>
                    {rec.newModules.map((mod, idx) => (
                      <div
                        key={idx}
                        style={{
                          padding: 14,
                          border: "1px solid var(--line)",
                          background: "var(--surface)",
                          display: "grid",
                          gap: 6,
                        }}
                      >
                        <span style={{ fontSize: 12, fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}>
                          {mod.schedule}
                        </span>
                        <strong style={{ fontSize: 14 }}>{mod.title}</strong>
                        <p style={{ fontSize: 13, color: "var(--text-muted)", margin: 0, lineHeight: 1.4 }}>
                          {mod.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display: "grid", gap: 8, padding: 14, background: "var(--surface)", border: "var(--border)" }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "baseline" }}>
                    <strong style={{ fontSize: 14, minWidth: "140px" }}>Rekomendasi PBL:</strong>
                    <span style={{ fontSize: 14, color: "var(--text-muted)" }}>{rec.pblProject}</span>
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "baseline", borderTop: "1px dashed var(--line)", paddingTop: 8 }}>
                    <strong style={{ fontSize: 14, minWidth: "140px" }}>Sertifikasi Mitra:</strong>
                    <span style={{ fontSize: 14, color: "var(--ink)", fontWeight: 500 }}>{rec.partnerCertification}</span>
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 4 }}>
                  <Button
                    size="sm"
                    variant={adopted ? "ghost" : "primary"}
                    onClick={() => toggleAdopt(rec.id)}
                    icon={adopted ? <Check size={18} /> : <BookOpen size={18} />}
                  >
                    {adopted ? "Batalkan Adopsi" : "Adopsi ke RPS Semester Depan"}
                  </Button>
                </div>
              </div>
            </Panel>
          );
        })}
      </div>
    </div>
  );
}
