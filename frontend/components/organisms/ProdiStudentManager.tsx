"use client";

import { useEffect, useState, useTransition } from "react";
import { CheckCircle, Clock, FileText, MagnifyingGlass, ShieldCheck, XCircle } from "@phosphor-icons/react";
import { Badge } from "../atoms/Badge";
import { Button } from "../atoms/Button";
import { Notice } from "../molecules/Notice";
import { Panel } from "../molecules/Panel";
import { Stat } from "../molecules/Stat";
import { StatGrid } from "../molecules/StatGrid";
import { getProdiStudentsAction, verifyClaimByProdiAction } from "@/lib/actions/prodiActions";
import app from "@/styles/app.module.css";
import rows from "@/styles/rows.module.css";
import ui from "@/styles/ui.module.css";

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
  claims?: ClaimItem[];
}

export function ProdiStudentManager() {
  const [students, setStudents] = useState<StudentSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
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

  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(query.toLowerCase()) ||
      getStudentNim(s).includes(query)
  );

  const totalStudents = students.length;
  const verifiedCount = students.filter((s) => getVerifiedClaims(s) > 0).length;
  const pendingReviewCount = students.reduce((acc, s) => acc + getPendingClaims(s), 0);

  return (
    <div className={app.stack} style={{ gap: 24 }}>
      {notice && <Notice tone="success">{notice}</Notice>}
      {error && <Notice tone="error">{error}</Notice>}

      <Panel flush>
        <StatGrid cols={4}>
          <Stat label="Total Mahasiswa Terdaftar" value={`${totalStudents} Mahasiswa`} />
          <Stat label="Mahasiswa Terverifikasi Prodi" value={`${verifiedCount} Mahasiswa`} />
          <Stat label="Klaim Butuh Audit Bukti" value={`${pendingReviewCount} Dokumen`} />
          <Stat label="Departemen / Prodi" value="D4 Teknik Informatika" />
        </StatGrid>
      </Panel>

      <div style={{ display: "grid", gridTemplateColumns: "360px 1fr", gap: 20, alignItems: "start" }}>
        {/* Kolom Kiri: Daftar Mahasiswa & Pencarian */}
        <Panel
          title="Daftar Mahasiswa"
          tag={`${filtered.length} Orang`}
          flush
        >
          <div style={{ padding: "12px 16px", borderBottom: "var(--border)", background: "var(--surface-warm)" }}>
            <div style={{ position: "relative" }}>
              <MagnifyingGlass size={16} style={{ position: "absolute", left: 10, top: 10, color: "var(--muted)" }} />
              <input
                type="text"
                className={ui.input}
                placeholder="Cari nama atau NIM..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{ paddingLeft: 34, height: 36, fontSize: 13, width: "100%" }}
              />
            </div>
          </div>

          <div style={{ maxHeight: "560px", overflowY: "auto" }}>
            {loading ? (
              <div style={{ padding: "24px 16px", fontSize: 13, color: "var(--muted)" }}>
                Memuat data mahasiswa...
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ padding: "24px 16px", fontSize: 13, color: "var(--muted)" }}>
                Tidak ada mahasiswa yang cocok.
              </div>
            ) : (
              <ul className={rows.list}>
                {filtered.map((s) => {
                  const isSelected = selectedStudent?.id === s.id;
                  return (
                    <li
                      key={s.id}
                      className={rows.row}
                      onClick={() => setSelectedStudent(s)}
                      style={{
                        cursor: "pointer",
                        background: isSelected ? "var(--surface-warm)" : undefined,
                        borderLeft: isSelected ? "4px solid var(--cat-yellow)" : "4px solid transparent",
                        padding: "12px 16px",
                      }}
                    >
                      <div className={rows.main} style={{ gap: 4 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <strong style={{ fontSize: 14 }}>{s.name}</strong>
                          {getVerifiedClaims(s) > 0 ? (
                            <Badge tone="green">🛡️ Verified</Badge>
                          ) : getPendingClaims(s) > 0 ? (
                            <Badge tone="yellow">Review ({getPendingClaims(s)})</Badge>
                          ) : (
                            <Badge tone="none">0 Klaim</Badge>
                          )}
                        </div>
                        <div style={{ fontSize: 12, color: "var(--muted)" }}>
                          NIM: {getStudentNim(s) || "-"} · IPK {getStudentGpa(s)} · Smt {s.semester || "Aktif"}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </Panel>

        {/* Kolom Kanan: Detail & Bukti Verifikasi Portofolio */}
        <div className={app.stack} style={{ gap: 20 }}>
          {selectedStudent ? (
            <>
              <Panel
                title={`Klaim Portofolio & Sertifikasi: ${selectedStudent.name}`}
                tag={
                  getVerifiedClaims(selectedStudent) > 0
                    ? `${getVerifiedClaims(selectedStudent)} Terverifikasi Prodi`
                    : "Belum Divalidasi"
                }
              >
                <div style={{ display: "flex", gap: 16, marginBottom: 16, flexWrap: "wrap", fontSize: 13 }}>
                  <div><strong>NIM:</strong> {getStudentNim(selectedStudent) || "Belum diisi"}</div>
                  <div><strong>Kampus:</strong> {selectedStudent.campus || "Politeknik Negeri Jakarta"}</div>
                  <div><strong>Program Studi:</strong> {selectedStudent.institution || "D4 Teknik Informatika"}</div>
                  <div><strong>IPK Kumulatif:</strong> {getStudentGpa(selectedStudent)}</div>
                </div>

                <div style={{ borderTop: "var(--border)", paddingTop: 16 }}>
                  <h4 style={{ margin: "0 0 12px 0", fontSize: 15 }}>
                    Daftar Sertifikat & Bukti Penghargaan dari CV:
                  </h4>

                  {!selectedStudent.claims || selectedStudent.claims.length === 0 ? (
                    <div style={{ padding: "20px", background: "var(--surface-warm)", border: "var(--border)", textAlign: "center" }}>
                      <p style={{ margin: 0, fontSize: 13, color: "var(--muted)" }}>
                        Mahasiswa ini belum mengunggah CV atau belum memiliki sertifikasi/penghargaan terdeteksi.
                      </p>
                    </div>
                  ) : (
                    <div style={{ display: "grid", gap: 14 }}>
                      {selectedStudent.claims.map((claim) => (
                        <div
                          key={claim.id}
                          style={{
                            border: "var(--border)",
                            background: "var(--surface)",
                            padding: "16px 20px",
                            display: "grid",
                            gap: 10,
                          }}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                            <div>
                              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                                <FileText size={18} color="var(--ink)" />
                                <strong style={{ fontSize: 15 }}>{claim.title}</strong>
                              </div>
                              {claim.context && (
                                <p style={{ margin: 0, fontSize: 13, color: "var(--muted)", fontStyle: "italic" }}>
                                  "{claim.context}"
                                </p>
                              )}
                              {claim.file_name && (
                                <div style={{ fontSize: 12, marginTop: 4, color: "var(--cat-blue)" }}>
                                  📎 Berkas Terlampir: <strong>{claim.file_name}</strong>
                                </div>
                              )}
                            </div>

                            <div>
                              {claim.status === "verified" ? (
                                <Badge tone="green">
                                  <ShieldCheck size={14} style={{ marginRight: 4 }} />
                                  Terverifikasi Prodi
                                </Badge>
                              ) : claim.status === "rejected" ? (
                                <Badge tone="orange">
                                  <XCircle size={14} style={{ marginRight: 4 }} />
                                  Ditolak
                                </Badge>
                              ) : (
                                <Badge tone="yellow">
                                  <Clock size={14} style={{ marginRight: 4 }} />
                                  Menunggu Validasi
                                </Badge>
                              )}
                            </div>
                          </div>

                          {claim.verification_notes && (
                            <div style={{ fontSize: 12, background: "var(--surface-warm)", padding: "8px 12px", border: "1px dashed var(--line)" }}>
                              <strong>Catatan Audit:</strong> {claim.verification_notes}
                            </div>
                          )}

                          <div style={{ display: "flex", gap: 10, marginTop: 6, justifyContent: "flex-end" }}>
                            {claim.status !== "verified" && (
                              <Button
                                variant="primary"
                                size="sm"
                                disabled={verifyingId === claim.id || isPending}
                                onClick={() => handleVerify(claim.id, true)}
                                icon={<CheckCircle size={16} aria-hidden />}
                              >
                                {verifyingId === claim.id ? "Memverifikasi..." : "Verifikasi Bukti Ini"}
                              </Button>
                            )}

                            {claim.status === "verified" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                disabled={verifyingId === claim.id || isPending}
                                onClick={() => handleVerify(claim.id, false)}
                              >
                                Cabut Status Verifikasi
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Panel>
            </>
          ) : (
            <Panel title="Detail Mahasiswa">
              <div style={{ padding: "40px 20px", textAlign: "center", color: "var(--muted)" }}>
                Pilih salah satu mahasiswa dari daftar di sebelah kiri untuk melihat dan memverifikasi bukti portofolio.
              </div>
            </Panel>
          )}
        </div>
      </div>
    </div>
  );
}

