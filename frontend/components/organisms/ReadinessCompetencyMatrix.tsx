"use client";

import { useMemo, useState } from "react";
import { ReadinessCompetency } from "@/lib/data/readiness/types";
import { ALL, countBy } from "@/lib/filters";
import { scoreTone, TONE_COLOR } from "@/lib/tone";
import { Badge } from "../atoms/Badge";
import { Meter } from "../atoms/Meter";
import { Tag } from "../atoms/Tag";
import { EmptyState } from "../molecules/EmptyState";
import { FilterBar } from "../molecules/FilterBar";
import { Panel } from "../molecules/Panel";
import { ScoreCell } from "../molecules/ScoreCell";
import rows from "@/styles/rows.module.css";
import app from "@/styles/app.module.css";

export interface ReadinessCompetencyMatrixProps {
  competencies: ReadinessCompetency[];
}

export function ReadinessCompetencyMatrix({ competencies }: ReadinessCompetencyMatrixProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(ALL);
  const [level, setLevel] = useState(ALL);

  const q = query.trim().toLowerCase();
  const searched = useMemo(() => competencies.filter((c) => !q || c.name.toLowerCase().includes(q)), [competencies, q]);
  const categoryCounts = useMemo(() => countBy(searched, (c) => c.category), [searched]);
  const levelCounts = useMemo(() => countBy(searched, (c) => c.level), [searched]);
  const activeCategory = category in categoryCounts ? category : ALL;
  const activeLevel = level in levelCounts ? level : ALL;
  const visible = searched.filter((c) => (activeCategory === ALL || c.category === activeCategory) && (activeLevel === ALL || c.level === activeLevel));

  return (
    <>
      <FilterBar
        search={{ value: query, onChange: setQuery, placeholder: "Cari kompetensi..." }}
        groups={[
          { title: "Kategori", options: Object.keys(categoryCounts), counts: categoryCounts, value: activeCategory, onChange: setCategory },
          { title: "Level", options: Object.keys(levelCounts), counts: levelCounts, value: activeLevel, onChange: setLevel },
        ]}
        shown={visible.length}
        total={competencies.length}
        noun="kompetensi"
        onReset={() => {
          setQuery("");
          setCategory(ALL);
          setLevel(ALL);
        }}
      />

      <Panel title="Matriks Penguasaan Kompetensi" tag="Keahlian Industri" flush>
        {visible.length === 0 ? (
          <EmptyState title="Tidak ada kompetensi yang cocok">Ubah kata kunci atau reset filter.</EmptyState>
        ) : (
          <ul className={rows.list}>
            {visible.map((comp) => {
              const tone = scoreTone(comp.progress);
              return (
                <li key={comp.name} className={rows.row}>
                  <div className={rows.main}>
                    <div className={rows.top}>
                      <strong>{comp.name}</strong>
                      <Tag>{comp.category}</Tag>
                      <Badge tone={tone}>{comp.level}</Badge>
                    </div>
                    <Meter value={comp.progress} label={comp.name} tone={TONE_COLOR[tone]} />
                    <span className={app.meta}>Sumber bukti: {comp.evidenceSrc}</span>
                  </div>
                  <ScoreCell value={`${comp.progress.toFixed(0)}%`} label="Capaian" />
                </li>
              );
            })}
          </ul>
        )}
      </Panel>
    </>
  );
}
