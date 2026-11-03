import { AdminPartnerSummary } from "@/lib/data/admin/types";
import { Badge } from "../atoms/Badge";
import { Briefcase, Buildings, MagnifyingGlass, Users } from "@phosphor-icons/react";
import dashboard from "@/styles/dashboard.module.css";
import ui from "@/styles/ui.module.css";

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
    <div className={dashboard.viewStack}>
      <header className={dashboard.pageHeader}>
        <div>
          <Badge tone="var(--accent)">Jaringan Industri PNJ</Badge>
          <h1 className={dashboard.pageTitle}>Mitra Perusahaan & Audit SLA Feedback</h1>
          <p className={dashboard.pageDesc}>
            Daftar korporasi mitra rekrutmen resmi Politeknik Negeri Jakarta beserta kepatuhan pengiriman feedback ke kandidat.
          </p>
        </div>
      </header>

      <div className={dashboard.searchToolbar}>
        <div className={dashboard.searchInputWrap}>
          <MagnifyingGlass size={18} className={dashboard.searchIcon} aria-hidden />
          <input
            type="search"
            placeholder="Cari nama perusahaan atau bidang industri..."
            className={dashboard.searchInput}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <div className={dashboard.toolbarSummary}>
          <span>Menampilkan {partners.length} Mitra Terdaftar</span>
        </div>
      </div>

      <div className={dashboard.tableContainer}>
        <table className={dashboard.adminTable}>
          <thead>
            <tr>
              <th>Perusahaan Mitra</th>
              <th>Sektor Industri</th>
              <th>Lowongan</th>
              <th>Pelamar</th>
              <th>Feedback Terkirim</th>
              <th>Kepatuhan SLA</th>
              <th>Status Kemitraan</th>
            </tr>
          </thead>
          <tbody>
            {partners.length === 0 ? (
              <tr>
                <td colSpan={7} className={dashboard.emptyCell}>
                  Tidak ada perusahaan mitra yang sesuai dengan pencarian Anda.
                </td>
              </tr>
            ) : (
              partners.map((partner) => (
                <tr key={partner.id}>
                  <td>
                    <div className={dashboard.partnerCell}>
                      <Buildings size={20} color="var(--accent)" aria-hidden />
                      <div>
                        <strong>{partner.companyName}</strong>
                        <span className={dashboard.cellSub}>ID: {partner.id}</span>
                      </div>
                    </div>
                  </td>
                  <td>{partner.industrySector}</td>
                  <td>
                    <div className={dashboard.numBadge}>
                      <Briefcase size={14} aria-hidden />
                      {partner.vacancyCount}
                    </div>
                  </td>
                  <td>
                    <div className={dashboard.numBadge}>
                      <Users size={14} aria-hidden />
                      {partner.applicantCount}
                    </div>
                  </td>
                  <td>
                    {partner.feedbackSent} dari {partner.applicantCount}
                  </td>
                  <td>
                    <div className={dashboard.slaProgressCell}>
                      <span className={dashboard.slaScore}>
                        {partner.feedbackSla.toFixed(1)}%
                      </span>
                      {partner.feedbackSla >= 100 ? (
                        <Badge tone="var(--cat-green)">Tepat Waktu</Badge>
                      ) : (
                        <Badge tone="var(--cat-yellow)">Sedang Ditinjau</Badge>
                      )}
                    </div>
                  </td>
                  <td>
                    <Badge tone="var(--accent)">{partner.partnershipStatus}</Badge>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
