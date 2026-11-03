/** Dampak yang ditargetkan (concept paper bagian 6). */
export const IMPACT = [
  {
    label: "Screening awal",
    value: 500,
    suffix: " CV",
    img: "rencana/dampak-screening",
    highlight: "var(--hl-lime)",
    note: "Ditargetkan beres kurang dari 30 menit, bukan berhari-hari dibaca manual.",
  },
  {
    label: "Feedback tertulis",
    value: 100,
    suffix: "%",
    img: "rencana/dampak-feedback",
    highlight: "var(--accent)",
    note: "Semua mahasiswa yang dipilih HRD dapet penjelasan, bukan cuma status ditolak.",
  },
  {
    label: "Laporan prodi",
    value: 1,
    suffix: "x / periode",
    img: "rencana/dampak-laporan",
    highlight: "var(--cat-yellow)",
    note: "Laporan kompetensi tiap periode rekrutmen. Revisi RPS nggak nunggu tracer study.",
  },
];

/** Rencana pengembangan (concept paper bagian 8). */
export const ROADMAP = [
  {
    label: "Bulan 1 sampai 3",
    highlight: "var(--cat-lilac)",
    img: "rencana/roadmap-uji-coba",
    rows: [
      ["Uji coba", "1 prodi, 1 mitra"],
      ["Fokus", "Stabil alur inti"],
    ],
  },
  {
    label: "Bulan 4 sampai 6",
    highlight: "var(--cat-green)",
    img: "rencana/roadmap-ukur",
    rows: [
      ["Ukur", "AI vs keputusan HRD"],
      ["Dasbor Prodi", "Diuji bareng dosen"],
    ],
  },
  {
    label: "Bulan 7 sampai 12",
    highlight: "var(--cat-orange)",
    img: "rencana/roadmap-ekspansi",
    rows: [
      ["Tambah", "Prodi dan mitra baru"],
      ["Tawarkan", "Ke politeknik lain"],
    ],
  },
] as const;
