"use client";

import { useState } from "react";
import { AdminPartnerSummary } from "@/lib/data/admin/types";
import { Badge } from "../atoms/Badge";
import { Button } from "../atoms/Button";
import { Panel } from "../molecules/Panel";
import {
  MagnifyingGlass,
  Buildings,
  Briefcase,
  Users,
  Plus,
  PencilSimple,
  Trash,
  X,
} from "@phosphor-icons/react";
import shell from "@/styles/shell.module.css";
import ui from "@/styles/ui.module.css";
import dashboard from "@/styles/dashboard.module.css";

export interface AdminPartnersViewProps {
  partners: AdminPartnerSummary[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onAddPartner?: (partner: Partial<AdminPartnerSummary>) => Promise<void>;
  onEditPartner?: (id: string, partner: Partial<AdminPartnerSummary>) => Promise<void>;
  onDeletePartner?: (id: string) => Promise<void>;
}

export function AdminPartnersView({
  partners,
  searchQuery,
  onSearchChange,
  onAddPartner,
  onEditPartner,
  onDeletePartner,
}: AdminPartnersViewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<AdminPartnerSummary | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    companyName: "",
    industrySector: "",
    vacancyCount: 0,
    applicantCount: 0,
    feedbackSent: 0,
    partnershipStatus: "Terverifikasi Aktif",
  });

  const handleOpenAdd = () => {
    setEditingPartner(null);
    setFormData({
      companyName: "",
      industrySector: "",
      vacancyCount: 0,
      applicantCount: 0,
      feedbackSent: 0,
      partnershipStatus: "Terverifikasi Aktif",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (partner: AdminPartnerSummary) => {
    setEditingPartner(partner);
    setFormData({
      companyName: partner.companyName,
      industrySector: partner.industrySector,
      vacancyCount: partner.vacancyCount,
      applicantCount: partner.applicantCount,
      feedbackSent: partner.feedbackSent,
      partnershipStatus: partner.partnershipStatus || "Terverifikasi Aktif",
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.companyName.trim() || !formData.industrySector.trim()) return;

    setIsSubmitting(true);
    try {
      if (editingPartner && onEditPartner) {
        await onEditPartner(editingPartner.id, formData);
      } else if (onAddPartner) {
        await onAddPartner(formData);
      }
      setIsModalOpen(false);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Terjadi kesalahan saat menyimpan data.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (partner: AdminPartnerSummary) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus mitra "${partner.companyName}"?`)) return;
    if (onDeletePartner) {
      try {
        await onDeletePartner(partner.id);
      } catch (err: unknown) {
        alert(err instanceof Error ? err.message : "Gagal menghapus mitra.");
      }
    }
  };

  return (
    <div className={shell.stack} style={{ gap: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: "1 1 320px", maxWidth: "480px" }}>
          <MagnifyingGlass
            size={18}
            style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }}
          />
          <input
            type="search"
            placeholder="Cari nama perusahaan atau sektor industri..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className={ui.input}
            style={{ paddingLeft: "42px" }}
          />
        </div>

        {onAddPartner && (
          <Button onClick={handleOpenAdd} icon={<Plus size={18} weight="bold" />}>
            Tambah Mitra Industri
          </Button>
        )}
      </div>

      <Panel title="Daftar Perusahaan Mitra & Kepatuhan SLA" tag={`${partners.length} Mitra`} flush>
        <div style={{ overflowX: "auto" }}>
          <table className={dashboard.adminTable} style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "var(--surface-warm)", borderBottom: "var(--border)", textAlign: "left" }}>
                <th style={{ padding: "12px 16px" }}>Perusahaan Mitra</th>
                <th style={{ padding: "12px 16px" }}>Sektor Industri</th>
                <th style={{ padding: "12px 16px" }}>Lowongan</th>
                <th style={{ padding: "12px 16px" }}>Pelamar</th>
                <th style={{ padding: "12px 16px" }}>Feedback Terkirim</th>
                <th style={{ padding: "12px 16px", minWidth: "190px" }}>Kepatuhan SLA</th>
                <th style={{ padding: "12px 16px" }}>Status Kemitraan</th>
                {(onEditPartner || onDeletePartner) && (
                  <th style={{ padding: "12px 16px", textAlign: "right" }}>Aksi</th>
                )}
              </tr>
            </thead>
            <tbody>
              {partners.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: "32px", textAlign: "center", color: "var(--text-muted)" }}>
                    Tidak ada perusahaan mitra yang sesuai dengan pencarian Anda.
                  </td>
                </tr>
              ) : (
                partners.map((partner) => (
                  <tr key={partner.id} style={{ borderBottom: "1px solid var(--border-light, #e0e0e0)" }}>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <Buildings size={20} color="var(--ink)" />
                        <div>
                          <strong style={{ fontSize: "14px" }}>{partner.companyName}</strong>
                          <span style={{ display: "block", fontSize: "11px", fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}>
                            ID: {partner.id}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: "14px" }}>{partner.industrySector}</td>
                    <td style={{ padding: "14px 16px", fontSize: "14px" }}>
                      <div style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                        <Briefcase size={14} color="var(--text-muted)" />
                        {partner.vacancyCount}
                      </div>
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: "14px" }}>
                      <div style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                        <Users size={14} color="var(--text-muted)" />
                        {partner.applicantCount}
                      </div>
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: "14px" }}>
                      {partner.feedbackSent} / {partner.applicantCount}
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "52px 90px",
                          alignItems: "center",
                          columnGap: "12px",
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontWeight: 700,
                            fontSize: "14px",
                            textAlign: "right",
                            display: "block",
                          }}
                        >
                          {partner.feedbackSla.toFixed(1)}%
                        </span>
                        <div style={{ display: "flex", justifyContent: "center" }}>
                          {partner.feedbackSla >= 100 ? (
                            <span
                              className={`${ui.badge} ${ui["tone-green"]}`}
                              style={{ width: "88px", justifyContent: "center", textAlign: "center" }}
                            >
                              100% SLA
                            </span>
                          ) : (
                            <span
                              className={`${ui.badge} ${ui["tone-yellow"]}`}
                              style={{ width: "88px", justifyContent: "center", textAlign: "center" }}
                            >
                              Ditinjau
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <Badge tone="green">{partner.partnershipStatus || "Terverifikasi Aktif"}</Badge>
                    </td>
                    {(onEditPartner || onDeletePartner) && (
                      <td style={{ padding: "14px 16px", textAlign: "right" }}>
                        <div style={{ display: "inline-flex", gap: "6px" }}>
                          {onEditPartner && (
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(partner)}
                              title="Edit Mitra"
                              style={{
                                background: "var(--surface)",
                                border: "1px solid var(--border)",
                                borderRadius: "4px",
                                padding: "6px",
                                cursor: "pointer",
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <PencilSimple size={16} />
                            </button>
                          )}
                          {onDeletePartner && (
                            <button
                              type="button"
                              onClick={() => handleDelete(partner)}
                              title="Hapus Mitra"
                              style={{
                                background: "var(--surface)",
                                border: "1px solid var(--border)",
                                borderRadius: "4px",
                                padding: "6px",
                                cursor: "pointer",
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "var(--accent-red, #dc2626)",
                              }}
                            >
                              <Trash size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Panel>

      {/* Modal Dialog Form CRUD Mitra */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.45)",
            backdropFilter: "blur(2px)",
            display: "grid",
            placeItems: "center",
            padding: "20px",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "var(--surface)",
              border: "var(--border)",
              boxShadow: "var(--shadow-brutal)",
              width: "100%",
              maxWidth: "520px",
              display: "grid",
              gap: "20px",
              padding: "24px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "var(--border)", paddingBottom: "12px" }}>
              <h2 style={{ fontSize: "18px", fontWeight: 700, margin: 0 }}>
                {editingPartner ? "Edit Mitra Industri" : "Tambah Mitra Industri Baru"}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  display: "inline-flex",
                  padding: "4px",
                }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: "grid", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 700, marginBottom: "6px" }}>
                  Nama Perusahaan *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: PT Astra International Tbk"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className={ui.input}
                  style={{ width: "100%" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 700, marginBottom: "6px" }}>
                  Sektor Industri *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Otomotif & Manufaktur"
                  value={formData.industrySector}
                  onChange={(e) => setFormData({ ...formData, industrySector: e.target.value })}
                  className={ui.input}
                  style={{ width: "100%" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 700, marginBottom: "6px" }}>
                    Jumlah Lowongan
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.vacancyCount}
                    onChange={(e) => setFormData({ ...formData, vacancyCount: parseInt(e.target.value) || 0 })}
                    className={ui.input}
                    style={{ width: "100%" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 700, marginBottom: "6px" }}>
                    Status Kemitraan
                  </label>
                  <select
                    value={formData.partnershipStatus}
                    onChange={(e) => setFormData({ ...formData, partnershipStatus: e.target.value })}
                    className={ui.input}
                    style={{ width: "100%" }}
                  >
                    <option value="Terverifikasi Aktif">Terverifikasi Aktif</option>
                    <option value="Ditinjau">Ditinjau</option>
                    <option value="Nonaktif">Nonaktif</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 700, marginBottom: "6px" }}>
                    Total Pelamar
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.applicantCount}
                    onChange={(e) => setFormData({ ...formData, applicantCount: parseInt(e.target.value) || 0 })}
                    className={ui.input}
                    style={{ width: "100%" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 700, marginBottom: "6px" }}>
                    Feedback Terkirim
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.feedbackSent}
                    onChange={(e) => setFormData({ ...formData, feedbackSent: parseInt(e.target.value) || 0 })}
                    className={ui.input}
                    style={{ width: "100%" }}
                  />
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "12px", borderTop: "var(--border)", paddingTop: "16px" }}>
                <Button variant="ghost" onClick={() => setIsModalOpen(false)} type="button">
                  Batal
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Menyimpan..." : editingPartner ? "Perbarui Mitra" : "Simpan Mitra"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
