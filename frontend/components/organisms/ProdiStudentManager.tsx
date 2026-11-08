"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { CalendarBlank, CheckCircle, Clock, FilePdf, FileText, IdentificationCard, Medal, Paperclip, SealCheck, ShieldCheck, XCircle } from "@phosphor-icons/react";
import { Badge } from "../atoms/Badge";
import { Button } from "../atoms/Button";
import { Callout } from "../molecules/Callout";
import { EmptyState } from "../molecules/EmptyState";
import { CategoryFilter } from "../molecules/CategoryFilter";
import { FilterMenu } from "../molecules/FilterMenu";
import { Pagination } from "../molecules/Pagination";
import { SearchField } from "../molecules/SearchField";
import { Notice } from "../molecules/Notice";
import { Panel } from "../molecules/Panel";
import { Stat } from "../molecules/Stat";
import { StatGrid } from "../molecules/StatGrid";
import { getProdiStudentsAction, verifyClaimByProdiAction } from "@/lib/actions/prodiActions";
import { ALL, countBy } from "@/lib/filters";
import app from "@/styles/app.module.css";
import dashboard from "@/styles/dashboard.module.css";
import shell from "@/styles/shell.module.css";
import ui from "@/styles/ui.module.css";
import rows from "@/styles/rows.module.css";

const STATUS_ORDER = [ALL, "Terverifikasi", "Perlu review", "Belum ada klaim"];
const STATUS_TONE = ["var(--ink)", "var(--cat-green)", "var(--cat-yellow)", "var(--cat-lilac)"];
const ITEMS_PER_PAGE = 8;

export interface ClaimItem {
  id: string;
  claim_type?: string;
  claimType?: string;
  title: string;
  issuer?: string;
  year?: string;
  context?: string;
  file_key?: string;
  fileKey?: string;
  file_name?: string;
  fileName?: string;
  status: "pending_upload" | "verifying" | "verified" | "needs_manual_review" | "rejected";
  match_confidence?: number;
  matchConfidence?: number;
  verification_notes?: string;
  verificationNotes?: string;
}

export interface StudentSummary {
  id: string;
  name: string;
  nim?: string;
  studentNumber?: string;
  institution?: string;
  campus?: string;
  semester?: number;
  ipk?: number;
  gpa?: number;
  total_claims?: number;
  totalClaims?: number;
  verified_claims?: number;
  verifiedClaims?: number;
  pending_claims?: number;
  pendingClaims?: number;
  cv_key?: string;
  cvKey?: string;
  cv_url?: string;
  cvUrl?: string;
  claims?: ClaimItem[];
}

export function ProdiStudentManager() {
  const [students, setStudents] = useState<StudentSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState(ALL);
  const [semester, setSemester] = useState(ALL);
  const [page, setPage] = useState(1);
  const [selectedStudent, setSelectedStudent] = useState<StudentSummary | null>(null);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getProdiStudentsAction("d4-teknik-informatika");
      if (!res.ok) throw new Error(res.error);
      const list = res.data;
      setStudents(list);
      if (list.length > 0 && !selectedStudent) {
        setSelectedStudent(list[0]);
      } else if (selectedStudent) {
        const updated = list.find((s) => s.id === selectedStudent.id);
        if (updated) setSelectedStudent(updated);
      }
    } catch (err: any) {
      setError(err?.message || "Gagal memuat data mahasiswa prodi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleVerify = async (claimId: string, verified: boolean) => {
    try {
      setVerifyingId(claimId);
      const notes = verified ? "Telah divalidasi keasliannya oleh Koordinator Prodi PNJ." : "Berkas bukti belum sesuai kriteria.";
      const res = await verifyClaimByProdiAction("d4-teknik-informatika", claimId, verified, notes);
      if (!res.ok) throw new Error(res.error);
      setNotice(verified ? "Klaim berhasil diverifikasi oleh Prodi." : "Klaim ditandai belum sesuai.");
      startTransition(() => {
        loadData();
      });
    } catch (err: any) {
      setError(err?.message || "Gagal memverifikasi bukti klaim");
    } finally {
      setVerifyingId(null);
    }
  };

  const getStudentNim = (s: StudentSummary) => s.nim || s.studentNumber || "";
  const getStudentGpa = (s: StudentSummary) => {
    const val = s.ipk ?? s.gpa;
    return typeof val === "number" ? val.toFixed(2) : "0.00";
  };
  const getVerifiedClaims = (s: StudentSummary) => s.verified_claims ?? s.verifiedClaims ?? 0;
  const getPendingClaims = (s: StudentSummary) => s.pending_claims ?? s.pendingClaims ?? 0;

  const statusOf = (s: StudentSummary) => (getVerifiedClaims(s) > 0 ? STATUS_ORDER[1] : getPendingClaims(s) > 0 ? STATUS_ORDER[2] : STATUS_ORDER[3]);
  const q = query.trim().toLowerCase();
  const matchesQuery = (s: StudentSummary) => !q || s.name.toLowerCase().includes(q) || getStudentNim(s).includes(query.trim());
  const searched = students.filter(matchesQuery);
  const statusCounts = useMemo(() => {
    const counts = countBy(searched, statusOf);
    return Object.fromEntries(STATUS_ORDER.map((k) => [k, counts[k] ?? 0]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [students, query]);
  const semesters = [ALL, ...Array.from(new Set(students.map((s) => String(s.semester ?? "Aktif")))).sort()];
  const filtered = searched.filter((s) => (statusFilter === ALL || statusOf(s) === statusFilter) && (semester === ALL || String(s.semester ?? "Aktif") === semester));
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const statusOptions = STATUS_ORDER.map((label, i) => ({ label, count: label === ALL ? searched.length : (statusCounts[label] ?? 0), tone: STATUS_TONE[i]! }));

  const totalStudents = students.length;
  const verifiedCount = students.filter((s) => getVerifiedClaims(s) > 0).length;
  const pendingReviewCount = students.reduce((acc, s) => acc + getPendingClaims(s), 0);

  return (
    <div className={shell.stack}>
      {notice && <Notice tone="success">{notice}</Notice>}
      {error && <Notice tone="error">{error}</Notice>}

      <Panel flush>
        <StatGrid cols={4}>
          <Stat label="Total mahasiswa" value={`${totalStudents} Orang`} />
          <Stat label="Terverifikasi prodi" value={`${verifiedCount} Orang`} />
          <Stat label="Klaim perlu audit" value={`${pendingReviewCount} Dokumen`} />
          <Stat label="Program studi" value={<span className={ui.statText}>D4 Teknik Informatika</span>} />
        </StatGrid>
      </Panel>

      <div className={app.listHead}>
        <div className={app.listHeadText}>
          <h2 className={app.listTitle}>Daftar Mahasiswa</h2>
          <p className={app.meta} style={{ marginTop: 4 }}>
            Pilih mahasiswa untuk memeriksa bukti portofolionya.
          </p>
        </div>
        <CategoryFilter
          value={statusFilter}
          options={statusOptions}
          onChange={(value) => {
            setStatusFilter(value);
            setPage(1);
          }}
          action={
            <FilterMenu
              fields={[{ key: "semester", title: "Semester", options: semesters }]}
              values={{ semester }}
              onApply={(v) => {
                setSemester(v.semester);
                setPage(1);
              }}
            />
          }
        />
      </div>

      <div className={dashboard.prodiLayout}>
        <Panel title="Mahasiswa" tag={`${filtered.length} Orang`} flush>
          <div className={ui.panelToolbar}>
            <SearchField
              value={query}
              onChange={(value) => {
                setQuery(value);
                setPage(1);
              }}
              placeholder="Cari nama atau NIM..."
            />
          </div>
          <div className={dashboard.prodiList}>
            {loading ? (
              <p className={`${app.meta} ${dashboard.prodiNote}`}>Memuat data mahasiswa...</p>
            ) : filtered.length === 0 ? (
              <p className={`${app.meta} ${dashboard.prodiNote}`}>Tidak ada mahasiswa yang cocok.</p>
            ) : (
              <ul className={rows.list}>
                {pageItems.map((s) => {
                  const isSelected = selectedStudent?.id === s.id;
                  return (
                    <li
                      key={s.id}
                      className={`${rows.row} ${dashboard.prodiItem} ${isSelected ? dashboard.prodiItemActive : ""}`}
                      role="button"
                      tabIndex={0}
                      aria-pressed={isSelected}
                      onClick={() => setSelectedStudent(s)}
                      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setSelectedStudent(s)}
                    >
                      <div className={app.candMain}>
                        <div className={dashboard.prodiNameRow}>
                          <span className={dashboard.cellIcon}>
                            <strong className={dashboard.cellStrong}>{s.name}</strong>
                            {getVerifiedClaims(s) > 0 && (
                              <span className={dashboard.sealIcon} title="Terverifikasi Prodi PNJ: Sertifikasi & portofolio tervalidasi">
                                <SealCheck size={18} weight="fill" />
                              </span>
                            )}
                          </span>
                          {getVerifiedClaims(s) > 0 ? (
                            <Badge tone="green">{getVerifiedClaims(s)} Terverifikasi</Badge>
                          ) : getPendingClaims(s) > 0 ? (
                            <Badge tone="yellow">Review ({getPendingClaims(s)})</Badge>
                          ) : (
                            <Badge tone="none">0 Klaim</Badge>
                          )}
                        </div>
                        <span className={app.candFacts}>
                          <span title="NIM">
                            <IdentificationCard size={15} aria-hidden /> {getStudentNim(s) || "-"}
                          </span>
                          <span title="IPK">
                            <Medal size={15} aria-hidden /> IPK {getStudentGpa(s)}
                          </span>
                          <span title="Semester">
                            <CalendarBlank size={15} aria-hidden /> Semester {s.semester || "Aktif"}
                          </span>
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
          {totalPages > 1 && <Pagination flush label="mahasiswa" currentPage={currentPage} totalPages={totalPages} totalItems={filtered.length} itemsPerPage={ITEMS_PER_PAGE} onPageChange={setPage} />}
        </Panel>

        <div className={app.stack}>
          {selectedStudent ? (
            <Panel
              title={selectedStudent.name}
              tag={getVerifiedClaims(selectedStudent) > 0 ? `${getVerifiedClaims(selectedStudent)} Terverifikasi Prodi` : "Belum Divalidasi"}
            >
              <div className={dashboard.prodiFacts}>
                <span>
                  <strong>NIM</strong> {getStudentNim(selectedStudent) || "Belum diisi"}
                </span>
                <span>
                  <strong>Kampus</strong> {selectedStudent.campus || "Politeknik Negeri Jakarta"}
                </span>
                <span>
                  <strong>Prodi</strong> {selectedStudent.institution || "D4 Teknik Informatika"}
                </span>
                <span>
                  <strong>IPK</strong> {getStudentGpa(selectedStudent)}
                </span>
                {(() => {
                  const rawUrl = selectedStudent.cvUrl || selectedStudent.cv_url;
                  if (!rawUrl) return null;
                  const sanitize = (v: string) => v.replace(/[^a-zA-Z0-9_-]/g, "_").replace(/_+/g, "_");
                  const downloadFilename = `cv-${sanitize(selectedStudent.name || "Mahasiswa")}.pdf`;
                  const downloadUrl = `${rawUrl}${rawUrl.includes("?") ? "&" : "?"}filename=${encodeURIComponent(downloadFilename)}`;
                  return (
                    <a className={dashboard.prodiFactsEnd} href={downloadUrl} download={downloadFilename} target="_blank" rel="noopener noreferrer">
                      <Button variant="ghost" size="sm" icon={<FilePdf size={16} />}>
                        Dokumen CV Asli
                      </Button>
                    </a>
                  );
                })()}
              </div>

              <div className={dashboard.prodiClaims}>
                <h3 className={dashboard.prodiClaimsTitle}>Sertifikat & penghargaan dari CV</h3>

                {!selectedStudent.claims || selectedStudent.claims.length === 0 ? (
                  <EmptyState title="Belum ada klaim">Belum ada sertifikat atau penghargaan terdeteksi dari CV mahasiswa ini.</EmptyState>
                ) : (
                  selectedStudent.claims.map((claim) => {
                    const fileKey = claim.file_key || claim.fileKey;
                    const busy = verifyingId === claim.id || isPending;
                    return (
                      <div key={claim.id} className={dashboard.prodiClaim}>
                        <div className={dashboard.prodiNameRow}>
                          <div>
                            <span className={dashboard.cellIcon}>
                              <FileText size={18} />
                              <strong>{claim.title}</strong>
                            </span>
                            {claim.context && <p className={`${app.meta} ${dashboard.prodiQuote}`}>&ldquo;{claim.context}&rdquo;</p>}
                            {claim.file_name && (
                              <span className={`${app.meta} ${dashboard.cellIcon}`}>
                                <Paperclip size={14} /> Berkas Terlampir: <strong>{claim.file_name}</strong>
                              </span>
                            )}
                          </div>

                          {claim.status === "verified" ? (
                            <Badge tone="green">
                              <ShieldCheck size={14} /> Terverifikasi Prodi
                            </Badge>
                          ) : claim.status === "rejected" ? (
                            <Badge tone="orange">
                              <XCircle size={14} /> Ditolak
                            </Badge>
                          ) : (
                            <Badge tone="yellow">
                              <Clock size={14} /> Menunggu Validasi
                            </Badge>
                          )}
                        </div>

                        {claim.verification_notes && <Callout title="Catatan Audit">{claim.verification_notes}</Callout>}

                        <div className={dashboard.prodiClaimActions}>
                          {fileKey && (
                            <a className={dashboard.prodiFileLink} href={`/files/${fileKey}`} target="_blank" rel="noopener noreferrer">
                              <Button variant="ghost" size="sm" icon={<FilePdf size={16} />}>
                                Lihat Berkas Bukti
                              </Button>
                            </a>
                          )}
                          {claim.status !== "verified" ? (
                            <Button size="sm" disabled={busy} onClick={() => handleVerify(claim.id, true)} icon={<CheckCircle size={16} aria-hidden />}>
                              {verifyingId === claim.id ? "Memverifikasi..." : "Verifikasi Bukti Ini"}
                            </Button>
                          ) : (
                            <Button variant="ghost" size="sm" disabled={busy} onClick={() => handleVerify(claim.id, false)}>
                              Cabut Status Verifikasi
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </Panel>
          ) : (
            <Panel title="Detail Mahasiswa">
              <EmptyState title="Pilih mahasiswa">Pilih mahasiswa dari daftar untuk melihat bukti portofolionya.</EmptyState>
            </Panel>
          )}
        </div>
      </div>
    </div>
  );
}
