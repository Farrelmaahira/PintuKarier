export type InterviewPhase = "check" | "answer" | "processing" | "done";

/** Waktu maksimal menjawab satu pertanyaan. */
export const ANSWER_SECONDS = 120;

export const PRACTICE_STEPS = [
  "Mengunggah rekaman",
  "Transkripsi jawaban (speech-to-text)",
  "Menilai bukti di 5 dimensi",
  "Menyusun evaluasi & feedback AI",
];
// Mode sungguhan: transkripsi jalan di background, penilaian saat HRD menjalankan analisis.
export const REAL_STEPS = ["Mengunggah rekaman", "Masuk antrean transkripsi"];

/** Lowongan dan pertanyaan contoh untuk mode latihan. */
export const PRACTICE_VACANCY = { position: "Frontend Developer Intern", company: "PT Arunika Teknologi" };

export const PRACTICE_QUESTIONS = [
  "Ceritain satu proyek frontend yang paling kamu banggain. Peran kamu di situ apa?",
  "Pernah ketemu bug yang bikin pusing? Gimana cara kamu nemuin dan beresinnya?",
  "Desainer kasih layout yang susah dibikin responsif. Apa yang kamu lakuin?",
];
