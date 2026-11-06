"use client";

import {
  Plus,
  PencilSimple,
  Trash,
  X,
  MagnifyingGlass,
  ArrowSquareOut,
  Target,
} from "@phosphor-icons/react";
import { useAdminLearningManager } from "@/lib/hooks/useAdminLearningManager";
import { Badge } from "../atoms/Badge";
import { Button } from "../atoms/Button";
import { Field } from "../molecules/Field";
import { Panel } from "../molecules/Panel";
import { Stat } from "../molecules/Stat";
import { StatGrid } from "../molecules/StatGrid";
import { Segmented } from "../molecules/Segmented";
import { Tag } from "../atoms/Tag";
import shell from "@/styles/shell.module.css";
import ui from "@/styles/ui.module.css";
import app from "@/styles/app.module.css";
import dashboard from "@/styles/dashboard.module.css";

export function AdminLearningManager() {
  const {
    modules,
    drills,
    categories,
    selectedCategory,
    searchQuery,
    isModalOpen,
    editingModule,
    form,
    setSelectedCategory,
    setSearchQuery,
    openCreateModal,
    openEditModal,
    closeModal,
    updateFormField,
    saveModule,
    deleteModule,
    filteredModules,
  } = useAdminLearningManager();

  return (
    <div className={shell.stack} style={{ gap: "20px" }}>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button onClick={openCreateModal} icon={<Plus size={18} weight="bold" />}>
          Tambah Modul & Drill
        </Button>
      </div>

      <Panel flush>
        <StatGrid cols={4}>
          <Stat label="Total Modul Industri" value={`${modules.length} Modul`} />
          <Stat label="Studi Kasus Drill" value={`${drills.length} Kasus`} />
          <Stat label="Kategori Bidang" value={`${Math.max(1, categories.length - 1)} Bidang`} />
          <Stat label="Rata-rata Boost Skor" value="+7.6 Poin" />
        </StatGrid>
      </Panel>

      <div style={{ display: "grid", gap: "12px" }}>
        <div style={{ position: "relative", width: "100%" }}>
          <MagnifyingGlass
            size={18}
            style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }}
          />
          <input
            type="text"
            placeholder="Cari judul modul, ringkasan, atau kompetensi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={ui.input}
            style={{ paddingLeft: "42px" }}
          />
        </div>

        <Segmented
          label="Kategori Modul"
          options={categories}
          value={selectedCategory}
          onChange={setSelectedCategory}
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: "20px" }}>
        {filteredModules.map((mod) => {
          const drill = drills.find((d) => d.moduleId === mod.id);

          return (
            <Panel
              key={mod.id}
              title={mod.title}
              tag={mod.category}
              flush
            >
              <div style={{ padding: "18px 20px", display: "grid", gap: "12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span className={dashboard.difficultyBadge} data-difficulty={mod.difficulty}>
                    {mod.difficulty}
                  </span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--text-muted)" }}>
                    {mod.durationMinutes} Menit Latihan
                  </span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--ink)", marginLeft: "auto", fontWeight: 700 }}>
                    +{mod.estimatedGain} Poin Kesiapan
                  </span>
                </div>

                <p className={app.meta} style={{ fontSize: "14px", lineHeight: "1.5", margin: 0 }}>
                  {mod.summary}
                </p>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {mod.competenciesCovered.map((comp) => (
                    <Tag key={comp}>{comp}</Tag>
                  ))}
                </div>

                {drill && (
                  <div
                    style={{
                      background: "var(--surface)",
                      borderLeft: "4px solid var(--accent)",
                      borderTop: "1px solid var(--border-light, #e0e0e0)",
                      borderRight: "1px solid var(--border-light, #e0e0e0)",
                      borderBottom: "1px solid var(--border-light, #e0e0e0)",
                      padding: "12px",
                      marginTop: "4px",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: 700, fontSize: "12px", marginBottom: "4px" }}>
                      <Target size={14} color="var(--ink)" />
                      Drill: {drill.targetCompetency} (+{drill.readinessBoost} Poin)
                    </div>
                    <div style={{ fontSize: "12px", color: "var(--text-muted)", lineHeight: 1.4 }}>
                      {drill.problemStatement}
                    </div>
                  </div>
                )}
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 20px",
                  borderTop: "var(--border)",
                  background: "var(--surface-raised)",
                }}
              >
                <a
                  href={mod.externalResourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={app.back}
                  style={{ marginBottom: 0, fontSize: "13px" }}
                >
                  Bahan Ajar <ArrowSquareOut size={14} />
                </a>

                <div style={{ display: "flex", gap: "8px" }}>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => openEditModal(mod)}
                    icon={<PencilSimple size={16} />}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => {
                      if (confirm(`Hapus modul "${mod.title}"?`)) {
                        deleteModule(mod.id);
                      }
                    }}
                    icon={<Trash size={16} />}
                  >
                    Hapus
                  </Button>
                </div>
              </div>
            </Panel>
          );
        })}
      </div>

      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 15, 29, 0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "20px",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "680px",
              maxHeight: "90vh",
              overflowY: "auto",
              backgroundColor: "var(--surface-raised)",
              border: "var(--border)",
              boxShadow: "6px 6px 0 var(--ink)",
              padding: "24px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", borderBottom: "var(--border)", paddingBottom: "12px" }}>
              <h2 style={{ fontSize: "18px", fontWeight: 700, margin: 0, letterSpacing: "-0.02em" }}>
                {editingModule ? "Edit Modul Pembelajaran" : "Tambah Modul & Drill Baru"}
              </h2>
              <button
                type="button"
                onClick={closeModal}
                style={{ background: "none", border: "none", cursor: "pointer" }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <Field
                label="Judul Modul"
                value={form.title}
                onChange={(v) => updateFormField("title", v)}
                placeholder="misal: Optimasi Kueri PostgreSQL & Indexing B-Tree"
              />

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <Field
                  label="Kategori Bidang"
                  value={form.category}
                  onChange={(v) => updateFormField("category", v)}
                  placeholder="misal: Database, Arsitektur Sistem, DevOps"
                />
                <div className={ui.field}>
                  <label className={ui.label}>Tingkat Kesulitan</label>
                  <select
                    className={ui.input}
                    value={form.difficulty}
                    onChange={(e) =>
                      updateFormField("difficulty", e.target.value as "Dasar" | "Menengah" | "Lanjutan")
                    }
                  >
                    <option value="Dasar">Dasar</option>
                    <option value="Menengah">Menengah</option>
                    <option value="Lanjutan">Lanjutan</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <Field
                  label="Estimasi Durasi (Menit)"
                  type="number"
                  value={String(form.durationMinutes)}
                  onChange={(v) => updateFormField("durationMinutes", Number(v) || 30)}
                />
                <Field
                  label="Estimasi Peningkatan Skor Kesiapan"
                  type="number"
                  value={String(form.estimatedGain)}
                  onChange={(v) => updateFormField("estimatedGain", Number(v) || 5)}
                />
              </div>

              <Field
                label="Ringkasan Materi"
                multiline
                value={form.summary}
                onChange={(v) => updateFormField("summary", v)}
                placeholder="Jelaskan kompetensi yang dicakup dan pentingnya materi ini dalam seleksi kerja industri."
              />

              <Field
                label="Kompetensi Terkait (pisahkan dengan koma)"
                value={form.competencies}
                onChange={(v) => updateFormField("competencies", v)}
                placeholder="misal: PostgreSQL, Query Optimization, Indexing"
              />

              <Field
                label="URL Sumber Belajar Eksternal / RPS"
                value={form.externalResourceUrl}
                onChange={(v) => updateFormField("externalResourceUrl", v)}
                placeholder="https://..."
              />

              <div style={{ borderTop: "var(--border)", paddingTop: "14px", marginTop: "8px" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 600, cursor: "pointer", fontSize: "14px" }}>
                  <input
                    type="checkbox"
                    checked={form.includeDrill}
                    onChange={(e) => updateFormField("includeDrill", e.target.checked)}
                  />
                  Sertakan Studi Kasus Drill Interaktif untuk Modul Ini
                </label>
              </div>

              {form.includeDrill && (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", background: "var(--surface-warm)", padding: "14px", border: "var(--border)" }}>
                  <Field
                    label="Skenario Masalah Nyata"
                    multiline
                    value={form.scenario}
                    onChange={(v) => updateFormField("scenario", v)}
                    placeholder="Contoh: Tabel lamaran memiliki 500.000 baris, kueri filter lambat..."
                  />

                  <Field
                    label="Pertanyaan Masalah (Problem Statement)"
                    value={form.problemStatement}
                    onChange={(v) => updateFormField("problemStatement", v)}
                    placeholder="Contoh: Indeks manakah yang paling efektif dan hemat I/O?"
                  />

                  <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "8px" }}>
                    <Field
                      label="Opsi 1 (Index 0)"
                      value={form.option0}
                      onChange={(v) => updateFormField("option0", v)}
                    />
                    <Field
                      label="Opsi 2 (Index 1)"
                      value={form.option1}
                      onChange={(v) => updateFormField("option1", v)}
                    />
                    <Field
                      label="Opsi 3 (Index 2)"
                      value={form.option2}
                      onChange={(v) => updateFormField("option2", v)}
                    />
                    <Field
                      label="Opsi 4 (Index 3)"
                      value={form.option3}
                      onChange={(v) => updateFormField("option3", v)}
                    />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <div className={ui.field}>
                      <label className={ui.label}>Kunci Jawaban Benar</label>
                      <select
                        className={ui.input}
                        value={form.correctIndex}
                        onChange={(e) => updateFormField("correctIndex", Number(e.target.value))}
                      >
                        <option value={0}>Opsi 1</option>
                        <option value={1}>Opsi 2</option>
                        <option value={2}>Opsi 3</option>
                        <option value={3}>Opsi 4</option>
                      </select>
                    </div>

                    <Field
                      label="Poin Kesiapan Drill (+Boost)"
                      type="number"
                      value={String(form.readinessBoost)}
                      onChange={(v) => updateFormField("readinessBoost", Number(v) || 8)}
                    />
                  </div>

                  <Field
                    label="Penjelasan Jawaban Objektif"
                    multiline
                    value={form.explanation}
                    onChange={(v) => updateFormField("explanation", v)}
                    placeholder="Jelaskan mengapa opsi tersebut tepat berdasarkan standar arsitektur dan rekayasa perangkat lunak."
                  />
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "12px" }}>
                <button
                  type="button"
                  onClick={closeModal}
                  style={{
                    padding: "8px 16px",
                    border: "var(--border)",
                    background: "var(--surface-raised)",
                    cursor: "pointer",
                    fontWeight: 500,
                  }}
                >
                  Batal
                </button>
                <Button onClick={saveModule}>
                  {editingModule ? "Simpan Perubahan" : "Terbitkan Modul"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
