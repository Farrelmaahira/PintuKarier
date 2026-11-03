/** Peran, sesi, dan menu dashboard per peran. */
export type UserRole = "mahasiswa" | "hrd" | "prodi" | "admin";

/** token: token Golang API, hanya dibaca server (cookie httpOnly). */
export interface Session {
  role: UserRole;
  name: string;
  email: string;
  token: string;
  institution?: string;
}

export const SESSION_COOKIE = "pintukarier_session";

export const USER_ROLES: UserRole[] = ["mahasiswa", "hrd", "prodi", "admin"];

export interface DemoAccount {
  role: UserRole;
  name: string;
  email: string;
  password: string;
  institution: string;
}

export const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    role: "mahasiswa",
    name: "Raka Pratama",
    email: "raka@demo.pintukarier.id",
    password: "demo12345",
    institution: "Politeknik Negeri Jakarta",
  },
  {
    role: "hrd",
    name: "Rani Wulandari",
    email: "rani@demo.pintukarier.id",
    password: "demo12345",
    institution: "PT Arunika Teknologi",
  },
  {
    role: "prodi",
    name: "Dr. Anita Hidayati",
    email: "anita@demo.pintukarier.id",
    password: "demo12345",
    institution: "Politeknik Negeri Jakarta",
  },
  {
    role: "admin",
    name: "Admin Pusat Karier",
    email: "admin@demo.pintukarier.id",
    password: "demo12345",
    institution: "Pusat Karier PNJ",
  },
];

export const ROLE_INFO: Record<UserRole, { label: string; home: string; tone: string; img: string; title: string; description: string }> = {
  mahasiswa: {
    label: "Mahasiswa",
    home: "/mahasiswa",
    tone: "var(--cat-lilac)",
    img: "mahasiswa",
    title: "Lamar, interview, dapet feedback.",
    description: "Pantau semua lamaran dari satu tempat. Lolos atau belum, kamu tetap tau alasannya.",
  },
  hrd: {
    label: "HRD Mitra",
    home: "/hrd",
    tone: "var(--accent)",
    img: "hrd",
    title: "Ratusan CV, dibaca dalam menit.",
    description: "Kandidat udah diurutkan lengkap sama skor, alasan, dan kutipan buktinya. Keputusan tetap di kamu.",
  },
  prodi: {
    label: "Program Studi",
    home: "/prodi",
    tone: "var(--cat-yellow)",
    img: "prodi",
    title: "Kurikulum yang belajar dari seleksi.",
    description: "Lihat kompetensi yang paling sering bikin lulusan gugur, tiap periode rekrutmen.",
  },
  admin: {
    label: "Pusat Karier",
    home: "/admin",
    tone: "var(--accent)",
    img: "prodi",
    title: "Satu kampus, seluruh jurusan.",
    description: "Pantau serapan kerja makro, kemitraan industri, dan SLA feedback mahasiswa lintas 7 jurusan.",
  },
};

export const DASHBOARD_MENU: Record<UserRole, { href: string; label: string; icon: string }[]> = {
  mahasiswa: [
    { href: "/mahasiswa", label: "Beranda", icon: "house" },
    { href: "/mahasiswa/lamar", label: "Lamar lowongan", icon: "upload" },
    { href: "/mahasiswa/interview", label: "Latihan Interview", icon: "video" },
    { href: "/mahasiswa/feedback", label: "Feedback", icon: "chat" },
    { href: "/mahasiswa/profil", label: "Profil saya", icon: "user" },
  ],
  hrd: [
    { href: "/hrd", label: "Kandidat", icon: "users" },
    { href: "/hrd/lowongan", label: "Lowongan", icon: "briefcase" },
    { href: "/hrd/profil", label: "Profil saya", icon: "user" },
  ],
  prodi: [
    { href: "/prodi", label: "Dasbor Utama", icon: "house" },
    { href: "/prodi/kompetensi", label: "Analisis Kompetensi", icon: "chart" },
    { href: "/prodi/kurikulum", label: "Rekomendasi RPS & PBL", icon: "book" },
    { href: "/prodi/industri", label: "Kebutuhan Industri & IKU", icon: "building" },
    { href: "/prodi/profil", label: "Profil saya", icon: "user" },
  ],
  admin: [
    { href: "/admin", label: "Dasbor Kampus", icon: "house" },
    { href: "/admin/jurusan", label: "Statistik 7 Jurusan", icon: "chart" },
    { href: "/admin/mitra", label: "Mitra & Lowongan", icon: "building" },
  ],
};
