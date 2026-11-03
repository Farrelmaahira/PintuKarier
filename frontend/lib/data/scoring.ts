/** Tabel 1 concept paper: dimensi dan bobot Evidence-Based Scoring. */
export const DIMENSIONS = [
  {
    name: "Skill Match",
    weight: 35,
    example: "Skill yang beneran dipakai di proyek atau kerjaan, bukan cuma ditulis di CV.",
    highlight: "var(--hl-lime)",
    img: "doodles/dim-skill",
  },
  {
    name: "Experience Match",
    weight: 25,
    example: "Relevansi dan durasi magang atau pengalaman kerja.",
    highlight: "var(--accent)",
    img: "doodles/dim-pengalaman",
  },
  {
    name: "Responsibility & Scope",
    weight: 20,
    example: "Peran dan tanggung jawab yang pernah kamu pegang.",
    highlight: "var(--cat-yellow)",
    img: "doodles/dim-tanggung-jawab",
  },
  {
    name: "Education & Certification",
    weight: 10,
    example: "Jurusan, mata kuliah, dan sertifikasi yang nyambung.",
    highlight: "var(--cat-lilac)",
    img: "doodles/dim-pendidikan",
  },
  {
    name: "Added Value",
    weight: 10,
    example: "Prestasi, organisasi, atau nilai plus lainnya.",
    highlight: "var(--hl-peach)",
    img: "doodles/dim-nilai-plus",
  },
] as const;

export const CATEGORIES = [
  {
    name: "Memenuhi Kriteria",
    range: "Skor 80 ke atas",
    highlight: "var(--cat-green)",
    img: "doodles/kat-memenuhi",
    meaning: "Semua syarat wajib ada buktinya. Prioritas buat dihubungi.",
  },
  {
    name: "Perlu Dipertimbangkan",
    range: "Skor 65 sampai 79",
    highlight: "var(--cat-yellow)",
    img: "doodles/kat-pengembangan",
    meaning: "Syarat wajib aman, ada beberapa nilai plus yang belum kelihatan.",
  },
  {
    name: "Perlu Pengembangan",
    range: "Skor 50 sampai 64",
    highlight: "var(--accent)",
    img: "doodles/kat-dipertimbangkan",
    meaning: "Potensinya ada, tapi beberapa kompetensi inti masih tipis.",
  },
  {
    name: "Tidak Memenuhi Syarat",
    range: "Syarat wajib tidak ditemukan",
    highlight: "var(--cat-orange)",
    img: "doodles/kat-tidak-memenuhi",
    meaning: "Ada syarat wajib yang nggak ketemu buktinya, berapa pun skornya.",
  },
] as const;
