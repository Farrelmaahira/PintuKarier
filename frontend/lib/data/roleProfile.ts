import type { Session, UserRole } from "./auth";

export interface ProfilePanelData {
  title: string;
  items: [string, string][];
  action?: {
    href: string;
    label: string;
  };
}

export interface RoleProfileData {
  title: string;
  lead: string;
  href: string;
  primaryPanel: ProfilePanelData;
  secondaryPanel: ProfilePanelData;
}

export function getRoleProfileData(session: Session | null, role: UserRole): RoleProfileData {
  if (role === "hrd") {
    const name = session?.name ?? "Rani Wulandari";
    const email = session?.email ?? "rani@demo.lulusin.id";
    const company = session?.institution ?? "PT Arunika Teknologi";

    return {
      title: "Profil Saya",
      lead: "Identitas akun HRD mitra dan profil perusahaan yang terhubung dengan pusat karier kampus.",
      href: "/hrd",
      primaryPanel: {
        title: "Identitas Akun HRD",
        items: [
          ["Nama Lengkap", name],
          ["Email", email],
          ["Peran", "Talent Acquisition / HRD Mitra"],
          ["Perusahaan", company],
          ["Status Akun", "Terverifikasi Aktif"],
        ],
      },
      secondaryPanel: {
        title: "Informasi Perusahaan",
        items: [
          ["Nama Entitas", company],
          ["Bidang Usaha", "Teknologi Informasi & Rekayasa Perangkat Lunak"],
          ["Lokasi", "Jakarta Selatan, Indonesia"],
          ["Program Mitra", "Rekrutmen Kampus & Magang Industri 2026/2027"],
        ],
        action: {
          href: "/hrd/lowongan",
          label: "Kelola Lowongan",
        },
      },
    };
  }

  const name = session?.name ?? "Dr. Anita Hidayati";
  const email = session?.email ?? "anita@demo.lulusin.id";
  const prodi = session?.institution ?? "D4 Teknik Informatika";

  return {
    title: "Profil Pengelola Prodi",
    lead: "Identitas pengelola program studi, institusi pendidikan, dan kurikulum yang terhubung dengan Lulusin.",
    href: "/prodi",
    primaryPanel: {
      title: "Identitas Pengelola",
      items: [
        ["Nama Lengkap", name],
        ["Email Resmi", email],
        ["Jabatan", "Ketua Program Studi / Dosen Pembina"],
        ["Program Studi", prodi],
        ["Perguruan Tinggi", "Politeknik Negeri Jakarta"],
      ],
    },
    secondaryPanel: {
      title: "Program Studi & Integrasi",
      items: [
        ["Program Studi", prodi],
        ["Jenjang", "Diploma IV (Sarjana Terapan)"],
        ["Fokus Kurikulum", "Rekayasa Perangkat Lunak & Industri IT"],
        ["Status Integrasi", "Sinkron Evaluasi Kompetensi Seleksi"],
      ],
      action: {
        href: "/prodi/kompetensi",
        label: "Analisis Kompetensi Lulusan",
      },
    },
  };
}
