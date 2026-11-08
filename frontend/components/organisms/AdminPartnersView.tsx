"use client";

import { useMemo, useState } from "react";
import { AdminPartnerSummary } from "@/lib/data/admin/types";
import { ALL, countBy } from "@/lib/filters";
import { Badge } from "../atoms/Badge";
import { Button } from "../atoms/Button";
import { IconButton } from "../atoms/IconButton";
import { Callout } from "../molecules/Callout";
import { ConfirmDialog } from "../molecules/ConfirmDialog";
import { Field } from "../molecules/Field";
import { CategoryFilter } from "../molecules/CategoryFilter";
import { FilterMenu } from "../molecules/FilterMenu";
import { SearchField } from "../molecules/SearchField";
import { Modal } from "../molecules/Modal";
import { Panel } from "../molecules/Panel";
import { SelectField } from "../molecules/SelectField";
import { Buildings, Briefcase, Users, Plus, PencilSimple, Trash } from "@phosphor-icons/react";
import shell from "@/styles/shell.module.css";
import ui from "@/styles/ui.module.css";
import dashboard from "@/styles/dashboard.module.css";

const TONES = ["var(--cat-green)", "var(--cat-lilac)", "var(--cat-yellow)", "var(--cat-cyan)", "var(--cat-orange)"];
const STATUSES = ["Terverifikasi Aktif", "Ditinjau", "Nonaktif"];
const STATUS_OPTIONS = STATUSES.map((v) => ({ value: v, label: v }));
const statusOf = (p: AdminPartnerSummary) => p.partnershipStatus || STATUSES[0];
const EMPTY_FORM = {
  companyName: "",
  industrySector: "",
  vacancyCount: 0,
  applicantCount: 0,
  feedbackSent: 0,
  partnershipStatus: "Terverifikasi Aktif",
};
const toCount = (v: string) => parseInt(v) || 0;

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
  const [formError, setFormError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<AdminPartnerSummary | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [sector, setSector] = useState(ALL);
  const [status, setStatus] = useState(ALL);

  const openForm = (partner: AdminPartnerSummary | null) => {
    setEditingPartner(partner);
    setFormData(partner ? { ...EMPTY_FORM, ...partner, partnershipStatus: partner.partnershipStatus || EMPTY_FORM.partnershipStatus } : EMPTY_FORM);
    setFormError(null);
    setIsModalOpen(true);
  };
  const closeForm = () => setIsModalOpen(false);
  const closeDelete = () => {
    setDeleting(null);
    setDeleteError(null);
  };
  const setField = <K extends keyof typeof EMPTY_FORM>(key: K, value: (typeof EMPTY_FORM)[K]) => setFormData((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.companyName.trim() || !formData.industrySector.trim()) return;

    setIsSubmitting(true);
    setFormError(null);
    try {
      if (editingPartner && onEditPartner) {
        await onEditPartner(editingPartner.id, formData);
      } else if (onAddPartner) {
        await onAddPartner(formData);
      }
      setIsModalOpen(false);
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : "Terjadi kesalahan saat menyimpan data.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleting || !onDeletePartner) return;
    setIsSubmitting(true);
    setDeleteError(null);
    try {
      await onDeletePartner(deleting.id);
      closeDelete();
    } catch (err: unknown) {
      setDeleteError(err instanceof Error ? err.message : "Gagal menghapus mitra.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter yang opsinya hilang (mis. setelah pencarian) dianggap "Semua" agar daftar tidak kosong tanpa tombol aktif.
  const sectorCounts = useMemo(() => countBy(partners, (p) => p.industrySector), [partners]);
  const statusCounts = useMemo(() => countBy(partners, statusOf), [partners]);
  const activeSector = sector in sectorCounts ? sector : ALL;
  const activeStatus = status in statusCounts ? status : ALL;
  const visible = partners.filter((p) => (activeSector === ALL || p.industrySector === activeSector) && (activeStatus === ALL || statusOf(p) === activeStatus));

  const statusOptions = Object.keys(statusCounts).map((label, i) => ({ label, count: statusCounts[label]!, tone: i === 0 ? "var(--ink)" : TONES[i - 1]! }));

  const hasActions = Boolean(onEditPartner || onDeletePartner);

  return (
    <div className={shell.stack}>
      <div className={ui.toolbar}>
        <SearchField value={searchQuery} onChange={onSearchChange} placeholder="Cari nama perusahaan atau sektor..." />
        {onAddPartner && (
          <Button onClick={() => openForm(null)} icon={<Plus size={18} weight="bold" />}>
            Tambah Mitra
          </Button>
        )}
      </div>
      <CategoryFilter
        value={activeStatus}
        options={statusOptions}
        onChange={setStatus}
        action={<FilterMenu fields={[{ key: "sector", title: "Sektor industri", options: Object.keys(sectorCounts) }]} values={{ sector: activeSector }} onApply={(v) => setSector(v.sector)} />}
      />

      <Panel title="Daftar Mitra" tag={`${visible.length} Mitra`} flush>
        <div className={dashboard.tableFlush}>
          <table className={dashboard.adminTable}>
            <thead>
              <tr>
                <th>Perusahaan Mitra</th>
                <th>Sektor Industri</th>
                <th>Lowongan</th>
                <th>Pelamar</th>
                <th>Feedback Terkirim</th>
                <th className={dashboard.minCol}>Kepatuhan SLA</th>
                <th>Status Kemitraan</th>
                {hasActions && <th className={dashboard.alignRight}>Aksi</th>}
              </tr>
            </thead>
            <tbody>
              {visible.length === 0 ? (
                <tr>
                  <td colSpan={hasActions ? 8 : 7} className={dashboard.tableEmpty}>
                    Tidak ada perusahaan mitra yang sesuai dengan filter Anda.
                  </td>
                </tr>
              ) : (
                visible.map((partner) => (
                  <tr key={partner.id}>
                    <td>
                      <div className={dashboard.cellName}>
                        <Buildings size={20} />
                        <div>
                          <strong className={dashboard.cellStrong}>{partner.companyName}</strong>
                          <span className={dashboard.cellSub}>ID: {partner.id}</span>
                        </div>
                      </div>
                    </td>
                    <td>{partner.industrySector}</td>
                    <td>
                      <span className={dashboard.cellIcon}>
                        <Briefcase size={14} /> {partner.vacancyCount}
                      </span>
                    </td>
                    <td>
                      <span className={dashboard.cellIcon}>
                        <Users size={14} /> {partner.applicantCount}
                      </span>
                    </td>
                    <td>
                      {partner.feedbackSent} / {partner.applicantCount}
                    </td>
                    <td>
                      <div className={dashboard.slaCell}>
                        <span className={dashboard.slaValue}>{partner.feedbackSla.toFixed(1)}%</span>
                        <Badge tone={partner.feedbackSla >= 100 ? "green" : "yellow"}>{partner.feedbackSla >= 100 ? "100% SLA" : "Ditinjau"}</Badge>
                      </div>
                    </td>
                    <td>
                      <Badge tone="green">{partner.partnershipStatus || "Terverifikasi Aktif"}</Badge>
                    </td>
                    {hasActions && (
                      <td className={dashboard.alignRight}>
                        <div className={dashboard.rowActions}>
                          {onEditPartner && <IconButton label="Edit Mitra" icon={<PencilSimple size={16} />} onClick={() => openForm(partner)} />}
                          {onDeletePartner && <IconButton danger label="Hapus Mitra" icon={<Trash size={16} />} onClick={() => setDeleting(partner)} />}
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

      {isModalOpen && (
        <Modal
          title={editingPartner ? "Edit Mitra Industri" : "Tambah Mitra Industri Baru"}
          onClose={closeForm}
          locked={isSubmitting}
          footer={
            <>
              <Button variant="plain" onClick={closeForm} disabled={isSubmitting}>
                Batal
              </Button>
              <Button type="submit" form="form-mitra" loading={isSubmitting}>
                {editingPartner ? "Perbarui Mitra" : "Simpan Mitra"}
              </Button>
            </>
          }
        >
          <form id="form-mitra" onSubmit={handleSubmit} className={ui.formStack}>
            <Field label="Nama Perusahaan *" required placeholder="Contoh: PT Astra International Tbk" value={formData.companyName} onChange={(v) => setField("companyName", v)} />
            <Field label="Sektor Industri *" required placeholder="Contoh: Otomotif & Manufaktur" value={formData.industrySector} onChange={(v) => setField("industrySector", v)} />
            <div className={ui.formGrid}>
              <Field label="Jumlah Lowongan" type="number" min={0} value={String(formData.vacancyCount)} onChange={(v) => setField("vacancyCount", toCount(v))} />
              <SelectField label="Status Kemitraan" value={formData.partnershipStatus} onChange={(v) => setField("partnershipStatus", v)} options={STATUS_OPTIONS} />
            </div>
            <div className={ui.formGrid}>
              <Field label="Total Pelamar" type="number" min={0} value={String(formData.applicantCount)} onChange={(v) => setField("applicantCount", toCount(v))} />
              <Field label="Feedback Terkirim" type="number" min={0} value={String(formData.feedbackSent)} onChange={(v) => setField("feedbackSent", toCount(v))} />
            </div>
            {formError && <Callout tone="error">{formError}</Callout>}
          </form>
        </Modal>
      )}

      {deleting && (
        <ConfirmDialog title="Hapus Mitra" confirmLabel="Hapus Mitra" isBusy={isSubmitting} error={deleteError} onConfirm={handleDelete} onClose={closeDelete}>
          <Callout title={deleting.companyName} icon={<Buildings size={14} />}>
            {deleting.industrySector} · {deleting.vacancyCount} lowongan · {deleting.applicantCount} pelamar
          </Callout>
          <p>Apakah Anda yakin ingin menghapus mitra ini? Tindakan ini permanen dan tidak dapat dibatalkan.</p>
        </ConfirmDialog>
      )}
    </div>
  );
}
