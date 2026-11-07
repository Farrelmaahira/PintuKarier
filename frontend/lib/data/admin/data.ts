import { toAppKeys } from "@/lib/apiKeys";
import { AdminDepartmentSummary, AdminOverviewStats, AdminPartnerSummary } from "./types";

export const PNJ_DEPARTMENTS: AdminDepartmentSummary[] = [
  {
    departmentCode: "TIK",
    departmentName: "Teknik Informatika dan Komputer",
    totalStudents: 1250,
    totalApplicants: 340,
    readinessLevel: 81.5,
    competencyGaps: ["System Architecture", "Integration Testing", "Cloud Deployment"],
    partnerCount: 12,
  },
  {
    departmentCode: "SIPIL",
    departmentName: "Teknik Sipil",
    totalStudents: 1120,
    totalApplicants: 215,
    readinessLevel: 76.2,
    competencyGaps: ["BIM Modeling", "Estimasi Biaya Proyek", "AutoCAD Civil 3D"],
    partnerCount: 8,
  },
  {
    departmentCode: "MESIN",
    departmentName: "Teknik Mesin",
    totalStudents: 1080,
    totalApplicants: 190,
    readinessLevel: 79.0,
    competencyGaps: ["PLC Programming", "Quality Inspection ISO", "SolidWorks Advanced"],
    partnerCount: 9,
  },
  {
    departmentCode: "ELEKTRO",
    departmentName: "Teknik Elektro",
    totalStudents: 1150,
    totalApplicants: 230,
    readinessLevel: 78.4,
    competencyGaps: ["SCADA Maintenance", "Power Circuit Design", "Mikrokontroler STM32"],
    partnerCount: 10,
  },
  {
    departmentCode: "TGP",
    departmentName: "Teknik Grafika dan Penerbitan",
    totalStudents: 890,
    totalApplicants: 165,
    readinessLevel: 82.1,
    competencyGaps: ["Editorial Publishing", "Pre-press Color Separation", "Packaging Layout"],
    partnerCount: 7,
  },
  {
    departmentCode: "AKUNTANSI",
    departmentName: "Akuntansi",
    totalStudents: 1340,
    totalApplicants: 280,
    readinessLevel: 84.0,
    competencyGaps: ["Tax Planning e-Faktur", "Audit Trail Analysis", "SAP FICO Basics"],
    partnerCount: 11,
  },
  {
    departmentCode: "AN",
    departmentName: "Administrasi Niaga",
    totalStudents: 1210,
    totalApplicants: 245,
    readinessLevel: 80.6,
    competencyGaps: ["Export-Import Procedures", "CRM Data Management", "Business English Pitch"],
    partnerCount: 8,
  },
];

export const PNJ_PARTNERS: AdminPartnerSummary[] = [
  {
    id: "mitra-1",
    companyName: "PT Astra International Tbk",
    industrySector: "Otomotif & Manufaktur",
    vacancyCount: 3,
    applicantCount: 85,
    feedbackSent: 85,
    feedbackSla: 100.0,
    partnershipStatus: "Terverifikasi Aktif",
  },
  {
    id: "mitra-2",
    companyName: "PT Telkom Indonesia (Persero) Tbk",
    industrySector: "Telekomunikasi & Digital",
    vacancyCount: 4,
    applicantCount: 120,
    feedbackSent: 120,
    feedbackSla: 100.0,
    partnershipStatus: "Terverifikasi Aktif",
  },
  {
    id: "mitra-3",
    companyName: "PT Bank Mandiri (Persero) Tbk",
    industrySector: "Perbankan & Keuangan",
    vacancyCount: 2,
    applicantCount: 94,
    feedbackSent: 90,
    feedbackSla: 95.7,
    partnershipStatus: "Terverifikasi Aktif",
  },
  {
    id: "mitra-4",
    companyName: "PT Wijaya Karya (Persero) Tbk",
    industrySector: "Konstruksi & Infrastruktur",
    vacancyCount: 2,
    applicantCount: 62,
    feedbackSent: 62,
    feedbackSla: 100.0,
    partnershipStatus: "Terverifikasi Aktif",
  },
  {
    id: "mitra-5",
    companyName: "PT Kompas Gramedia",
    industrySector: "Media, Grafika & Komunikasi",
    vacancyCount: 2,
    applicantCount: 48,
    feedbackSent: 48,
    feedbackSla: 100.0,
    partnershipStatus: "Terverifikasi Aktif",
  },
  {
    id: "mitra-6",
    companyName: "PT Schneider Electric Indonesia",
    industrySector: "Elektro & Otomasi Energi",
    vacancyCount: 1,
    applicantCount: 38,
    feedbackSent: 38,
    feedbackSla: 100.0,
    partnershipStatus: "Terverifikasi Aktif",
  },
];

export const PNJ_OVERVIEW_INITIAL: AdminOverviewStats = {
  totalStudents: 8040,
  totalVacancies: 14,
  totalPartners: 6,
  totalApplications: 1465,
  feedbackRate: 98.6,
  avgReadiness: 80.3,
  departmentSummaries: PNJ_DEPARTMENTS,
};

// Pengambilan data admin dari endpoint Go dengan fallback data baseline.
export async function fetchAdminOverview(): Promise<AdminOverviewStats> {
  try {
    const res = await fetch("/api/admin/overview", { method: "GET" });
    if (!res.ok) return PNJ_OVERVIEW_INITIAL;
    const data = await res.json();
    return toAppKeys(data) as AdminOverviewStats;
  } catch {
    return PNJ_OVERVIEW_INITIAL;
  }
}

export async function fetchAdminDepartments(): Promise<AdminDepartmentSummary[]> {
  try {
    const res = await fetch("/api/admin/jurusan", { method: "GET" });
    if (!res.ok) return PNJ_DEPARTMENTS;
    const data = await res.json();
    return toAppKeys(data) as AdminDepartmentSummary[];
  } catch {
    return PNJ_DEPARTMENTS;
  }
}

export async function fetchAdminPartners(): Promise<AdminPartnerSummary[]> {
  try {
    const res = await fetch("/api/admin/mitra", { method: "GET" });
    if (!res.ok) return PNJ_PARTNERS;
    const data = await res.json();
    return toAppKeys(data) as AdminPartnerSummary[];
  } catch {
    return PNJ_PARTNERS;
  }
}

export async function createAdminPartner(partner: Partial<AdminPartnerSummary>): Promise<AdminPartnerSummary> {
  const res = await fetch("/api/admin/mitra", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      nama_perusahaan: partner.companyName,
      bidang_industri: partner.industrySector,
      jumlah_lowongan: partner.vacancyCount || 0,
      jumlah_pelamar: partner.applicantCount || 0,
      feedback_terkirim: partner.feedbackSent || 0,
      status_kemitraan: partner.partnershipStatus || "Terverifikasi Aktif",
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Gagal menambahkan mitra");
  }
  const data = await res.json();
  return toAppKeys(data) as AdminPartnerSummary;
}

export async function updateAdminPartner(id: string, partner: Partial<AdminPartnerSummary>): Promise<AdminPartnerSummary> {
  const res = await fetch(`/api/admin/mitra/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      nama_perusahaan: partner.companyName,
      bidang_industri: partner.industrySector,
      jumlah_lowongan: partner.vacancyCount || 0,
      jumlah_pelamar: partner.applicantCount || 0,
      feedback_terkirim: partner.feedbackSent || 0,
      status_kemitraan: partner.partnershipStatus || "Terverifikasi Aktif",
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Gagal memperbarui mitra");
  }
  const data = await res.json();
  return toAppKeys(data) as AdminPartnerSummary;
}

export async function deleteAdminPartner(id: string): Promise<void> {
  const res = await fetch(`/api/admin/mitra/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Gagal menghapus mitra");
  }
}
