import type { Session, UserRole } from "./auth";

export interface ProfilePanelData {
  title: string;
  items: [string, string][];
  footer?: {
    hint: string;
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
    const email = session?.email ?? "rani@demo.pintukarier.id";
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
          ["Status Kemitraan", "Terverifikasi Aktif"],
        ],
      },
      secondaryPanel: {
        title: "Profil Perusahaan",
        items: [
          ["Nama Perusahaan", company],
          ["Bidang Industri", "Teknologi Informasi & Software"],
          ["Lokasi Kantor", "Jakarta Selatan, DKI Jakarta"],
          ["Kemitraan Kampus", "Politeknik Negeri Jakarta"],
        ],
        footer: {
          hint: "Ingin mengubah data perusahaan atau menambah lowongan baru?",
          href: "/hrd/lowongan",
          label: "Kelola Lowongan",
        },
      },
    };
  }

  if (role === "admin") {
    const name = session?.name ?? "Admin Pusat Karier";
    const email = session?.email ?? "admin@demo.pintukarier.id";

    return {
      title: "Profil Pusat Karier",
      lead: "Identitas akun pengelola pusat karier kampus untuk pemantauan seluruh 7 jurusan PNJ.",
      href: "/admin",
      primaryPanel: {
        title: "Identitas Pengelola Kampus",
        items: [
          ["Nama Pengelola", name],
          ["Email Resmi", email],
          ["Unit Kerja", "Pusat Karier & Hubungan Alumni"],
          ["Institusi", "Politeknik Negeri Jakarta"],
        ],
      },
      secondaryPanel: {
        title: "Cakupan Ekosistem",
        items: [
          ["Jumlah Jurusan", "7 Jurusan Vokasi"],
          ["Jumlah Program Studi", "36 Program Studi"],
          ["Cakupan Wilayah", "Kampus UI Depok"],
          ["Status Sistem", "Pintu Karier Active Node"],
        ],
      },
    };
  }

  const name = session?.name ?? "Dr. Anita Hidayati";
  const email = session?.email ?? "anita@demo.pintukarier.id";
  const prodi = session?.institution ?? "D4 Teknik Informatika";

  return {
    title: "Profil Pengelola Prodi",
    lead: "Identitas pengelola program studi, institusi pendidikan, dan kurikulum yang terhubung dengan Pintu Karier.",
    href: "/prodi",
    primaryPanel: {
      title: "Identitas Pengelola",
      items: [
        ["Nama Lengkap", name],
        ["Email Resmi", email],
        ["Jabatan", "Ketua Program Studi / Dosen Pembina"],
        ["Program Studi", prodi],
      ],
    },
    secondaryPanel: {
      title: "Informasi Institusi & Kurikulum",
      items: [
        ["Perguruan Tinggi", "Politeknik Negeri Jakarta"],
        ["Jenjang", "Sarjana Terapan (D4)"],
        ["Basis Kurikulum", "Outcome-Based Education (OBE)"],
        ["Siklus Evaluasi", "Tiap Periode Rekrutmen"],
      ],
      footer: {
        hint: "Ingin meninjau kesenjangan kompetensi atau merancang tindak lanjut RPS?",
        href: "/prodi/kurikulum",
        label: "Buka Rekomendasi RPS",
      },
    },
  };
}
