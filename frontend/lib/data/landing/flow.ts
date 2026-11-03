import type { Tone } from "../../tone";

/** Demo horizontal, satu panel per langkah user flow. */
export const FLOW: {
  who: string;
  tone: string;
  img: string;
  text: string;
  badge: string;
  badgeTone: Tone;
}[] = [
  {
    who: "Raka, Mahasiswa TI",
    tone: "var(--cat-lilac)",
    img: "alur/1-cv",
    text: "Pilih lowongan Frontend Developer Intern, unggah CV PDF. Profilnya keisi otomatis, Raka tinggal cek.",
    badge: "Unggah CV",
    badgeTone: "none",
  },
  {
    who: "Raka",
    tone: "var(--cat-lilac)",
    img: "alur/2-prescreening",
    text: "Jawab 3 pertanyaan pre-screening: kapan bisa mulai, oke hybrid, link GitHub.",
    badge: "Pre-screening",
    badgeTone: "lilac",
  },
  {
    who: "AI Interview",
    tone: "var(--accent)",
    img: "alur/3-interview",
    text: "3 pertanyaan, jawab pakai kamera dan mikrofon. Jawaban ditranskripsi otomatis.",
    badge: "AI Interview",
    badgeTone: "lilac",
  },
  {
    who: "Evidence-Based Scoring",
    tone: "var(--cat-yellow)",
    img: "alur/4-skor",
    text: "Syarat React ketemu buktinya di proyek SiPinjam. Testing nggak ketemu. Skor 5 dimensi: 67.",
    badge: "Perlu Dipertimbangkan",
    badgeTone: "yellow",
  },
  {
    who: "HRD PT Arunika",
    tone: "var(--cat-green)",
    img: "alur/5-hrd",
    text: "Baca alasan dan kutipan bukti, setuju sama AI, tetapkan keputusan sendiri.",
    badge: "Ditinjau HRD",
    badgeTone: "accent",
  },
  {
    who: "Raka",
    tone: "var(--cat-green)",
    img: "alur/6-feedback",
    text: "Belum lolos, tapi dapet feedback: perdalam testing otomatis dan TypeScript. Jelas mau belajar apa.",
    badge: "Feedback terkirim",
    badgeTone: "green",
  },
  {
    who: "Dasbor Prodi TI",
    tone: "var(--cat-yellow)",
    img: "alur/7-prodi",
    text: "64% kandidat gugur di testing otomatis. Dosen nambah workshop di Pengujian Perangkat Lunak.",
    badge: "Masuk Dasbor Prodi",
    badgeTone: "yellow",
  },
];
