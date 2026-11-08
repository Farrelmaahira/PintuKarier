"use client";

import { useMemo, useState } from "react";
import { Plus, PencilSimple, Trash, ArrowSquareOut, Clock, Lightning, Target } from "@phosphor-icons/react";
import { ALL, countBy } from "@/lib/filters";
import { useAdminLearningManager } from "@/lib/hooks/useAdminLearningManager";
import { Button } from "../atoms/Button";
import { Tag } from "../atoms/Tag";
import { Callout } from "../molecules/Callout";
import { ChipList } from "../molecules/ChipList";
import { ConfirmDialog } from "../molecules/ConfirmDialog";
import { EmptyState } from "../molecules/EmptyState";
import { CategoryFilter } from "../molecules/CategoryFilter";
import { FilterMenu } from "../molecules/FilterMenu";
import { SearchField } from "../molecules/SearchField";
import { Panel } from "../molecules/Panel";
import { Stat } from "../molecules/Stat";
import { StatGrid } from "../molecules/StatGrid";
import shell from "@/styles/shell.module.css";
import ui from "@/styles/ui.module.css";
import app from "@/styles/app.module.css";
import dashboard from "@/styles/dashboard.module.css";

const TONES = ["var(--cat-green)", "var(--cat-lilac)", "var(--cat-yellow)", "var(--cat-cyan)", "var(--cat-orange)"];
const DIFFICULTIES = ["Dasar", "Menengah", "Lanjutan"];

export function AdminLearningManager() {
  const {
    modules,
    drills,
    categories,
    selectedCategory,
    searchQuery,
    setSelectedCategory,
    setSearchQuery,
    deleteModule,
    filteredModules,
  } = useAdminLearningManager();
  const [deleting, setDeleting] = useState<(typeof modules)[number] | null>(null);
  const [difficulty, setDifficulty] = useState(ALL);

  const categoryCounts = useMemo(() => countBy(modules, (m) => m.category, categories[0]), [modules, categories]);
  const visibleModules = filteredModules.filter((m) => difficulty === ALL || m.difficulty === difficulty);
  const avgBoost = drills.length ? (drills.reduce((sum, d) => sum + d.readinessBoost, 0) / drills.length).toFixed(1) : "0";

  const categoryOptions = categories.map((label, i) => ({ label, count: categoryCounts[label] ?? 0, tone: i === 0 ? "var(--ink)" : TONES[(i - 1) % TONES.length]! }));

  return (
    <div className={shell.stack}>
      <div className={ui.toolbar}>
        <SearchField value={searchQuery} onChange={setSearchQuery} placeholder="Cari judul, ringkasan, atau kompetensi..." />
        <Button href="/admin/learning-hub/baru" icon={<Plus size={18} weight="bold" />}>
          Tambah Modul
        </Button>
      </div>
      <CategoryFilter
        value={selectedCategory}
        options={categoryOptions}
        onChange={setSelectedCategory}
        action={<FilterMenu fields={[{ key: "difficulty", title: "Tingkat kesulitan", options: [ALL, ...DIFFICULTIES] }]} values={{ difficulty }} onApply={(v) => setDifficulty(v.difficulty)} />}
      />

      {/* Panel Informasi / Stat Grid */}
      <Panel flush>
        <StatGrid cols={4}>
          <Stat label="Total modul" value={`${modules.length} Modul`} />
          <Stat label="Studi kasus" value={`${drills.length} Kasus`} />
          <Stat label="Kategori" value={`${Math.max(1, categories.length - 1)} Bidang`} />
          <Stat label="Rata-rata boost" value={`+${avgBoost} Poin`} />
        </StatGrid>
      </Panel>

      {visibleModules.length === 0 && (
        <EmptyState title="Tidak ada modul yang cocok">Coba kategori atau filter lain.</EmptyState>
      )}

      <div className={app.jobGrid}>
        {visibleModules.map((mod) => {
          const drill = drills.find((d) => d.moduleId === mod.id);

          return (
            <div key={mod.id} className={app.jobCard}>
              <div className={app.jobCardTop}>
                <div className={ui.btnRow}>
                  <Tag>{mod.category}</Tag>
                  <span className={dashboard.difficultyBadge} data-difficulty={mod.difficulty}>
                    {mod.difficulty}
                  </span>
                </div>
                <span className={`${app.meta} ${dashboard.cellIcon}`}>
                  <Clock size={14} aria-hidden /> {mod.durationMinutes} mnt
                </span>
              </div>

              <div className={app.jobCardBody}>
                <div className={app.jobCardTitle}>
                  <strong className={app.name} style={{ display: "block", fontSize: 20 }}>
                    {mod.title}
                  </strong>
                  <p className={app.meta} style={{ marginTop: 8, fontSize: 14 }}>
                    {mod.summary}
                  </p>
                </div>

                <ChipList items={mod.competenciesCovered} />

                {drill && (
                  <Callout tone="plain" title={`Drill: ${drill.targetCompetency} (+${drill.readinessBoost} Poin)`} icon={<Target size={14} />}>
                    <span className={app.meta}>{drill.problemStatement}</span>
                  </Callout>
                )}

                <div className={app.jobCardCount} style={{ marginTop: "auto" }}>
                  <span className={dashboard.cellIcon}>
                    <Lightning size={14} aria-hidden /> Poin kesiapan
                  </span>
                  <span className="num">+{mod.estimatedGain} poin</span>
                </div>
              </div>

              <div className={app.jobCardFooter}>
                <a href={mod.externalResourceUrl} target="_blank" rel="noreferrer" className={app.backInline}>
                  Bahan Ajar <ArrowSquareOut size={14} />
                </a>
                <div className={ui.btnRow}>
                  <Button size="sm" variant="ghost" href={`/admin/learning-hub/${mod.id}/edit`} icon={<PencilSimple size={16} />}>
                    Edit
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => setDeleting(mod)} icon={<Trash size={16} />}>
                    Hapus
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {deleting && (
        <ConfirmDialog
          title="Hapus Modul"
          confirmLabel="Hapus Modul"
          onClose={() => setDeleting(null)}
          onConfirm={() => {
            deleteModule(deleting.id);
            setDeleting(null);
          }}
        >
          <Callout title={deleting.title}>
            {deleting.category} · {deleting.durationMinutes} menit
          </Callout>
          <p>Apakah Anda yakin ingin menghapus modul ini beserta drill-nya? Tindakan ini tidak dapat dibatalkan.</p>
        </ConfirmDialog>
      )}
    </div>
  );
}
