export type LandingRole = {
  href: string;
  /** Dipakai buat tautan daftar dari kartu peran di landing. */
  userRole: "mahasiswa" | "hrd" | "prodi";
  label: string;
  /** Siapa yang pakai layar ini (concept paper bagian 6). */
  who: string;
  tone: string;
  /** Nama doodle di public/illustrations/doodles; sengaja beda dari ilustrasi halaman login. */
  img: string;
  summary: string;
};

export const LANDING_ROLES: LandingRole[] = [
  {
    href: "/mahasiswa",
    userRole: "mahasiswa",
    label: "Mahasiswa",
    who: "Mahasiswa & alumni baru",
    tone: "var(--cat-lilac)",
    img: "peran-mahasiswa",
    summary:
      "Lamar lewat pusat karier, unggah CV, jawab 3 pertanyaan, lalu AI Interview. Lolos atau belum, kamu tetap dapet feedback tertulis. No more ghosting.",
  },
  {
    href: "/hrd",
    userRole: "hrd",
    label: "HRD",
    who: "HRD mitra industri",
    tone: "var(--accent)",
    img: "peran-hrd",
    summary:
      "Kandidat udah diurutkan lengkap sama skor, alasan, kutipan bukti, dan transkrip. Kamu yang mutusin, AI cuma bantu baca ratusan CV lebih cepat.",
  },
  {
    href: "/prodi",
    userRole: "prodi",
    label: "Dasbor Prodi",
    who: "Kaprodi & dosen",
    tone: "var(--cat-yellow)",
    img: "peran-prodi",
    summary:
      "Kompetensi yang paling sering bikin lulusan gugur, dirangkum anonim tiap periode rekrutmen. Revisi RPS nggak perlu nunggu tracer study.",
  },
];
