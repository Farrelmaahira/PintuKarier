"use client";

import { AdminPartnerSummary } from "@/lib/data/admin/types";
import { Badge } from "../atoms/Badge";
import { Panel } from "../molecules/Panel";
import { MagnifyingGlass, Buildings, Briefcase, Users } from "@phosphor-icons/react";
import shell from "@/styles/shell.module.css";
import ui from "@/styles/ui.module.css";
import dashboard from "@/styles/dashboard.module.css";

export interface AdminPartnersViewProps {
  partners: AdminPartnerSummary[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export function AdminPartnersView({
  partners,
  searchQuery,
  onSearchChange,
}: AdminPartnersViewProps) {
  return (
    <div className={shell.stack} style={{ gap: "20px" }}>
      <div style={{ position: "relative", maxWidth: "480px" }}>
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
                <th style={{ padding: "12px 16px" }}>Kepatuhan SLA</th>
                <th style={{ padding: "12px 16px" }}>Status Kemitraan</th>
              </tr>
            </thead>
            <tbody>
              {partners.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: "32px", textAlign: "center", color: "var(--text-muted)" }}>
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
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: "14px" }}>
                          {partner.feedbackSla.toFixed(1)}%
                        </span>
                        {partner.feedbackSla >= 100 ? (
                          <Badge tone="green">100% SLA</Badge>
                        ) : (
                          <Badge tone="yellow">Ditinjau</Badge>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <Badge tone="accent">{partner.partnershipStatus}</Badge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
