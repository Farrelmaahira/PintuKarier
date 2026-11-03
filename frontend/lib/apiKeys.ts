/**
 * Kamus key JSON Golang API (Indonesia) ke nama field frontend (Inggris).
 * Hanya key; nilai seperti "Lolos" atau "Memenuhi Kriteria" tetap apa adanya.
 * shortcut: semua key diterjemahkan, jadi data yang dipakai sebagai key (ranking per periode dan posisi)
 * tidak boleh sama dengan nama field di sini; pindahkan ke terjemahan per endpoint kalau itu terjadi.
 */
const WIRE_TO_APP: Record<string, string> = {
  aksi: "action", alasan: "reason", alasanKoreksi: "correctionReason", angkatan: "cohortYear", bidang: "jobField",
  bukti: "evidence", catatan: "note", dari: "sender", deskripsi: "description", detik: "seconds", dilamar: "appliedOn",
  dimensi: "dimensions", ditutup: "closed", durasi: "duration", feedbackTerkirim: "feedbackSent", fitur: "feature",
  instansi: "institution", interviewTanya: "interviewQuestions", ipk: "gpa", isi: "content", jawab: "answer",
  jawaban: "answers", kampus: "campus", kategori: "category", kategoriAi: "aiCategory", kekuatan: "strengths",
  kenapa: "why", keputusan: "decision", kompetensi: "competency", kutipan: "quote", lokasi: "location",
  lowongan: "vacancy", lowonganId: "vacancyId", matkul: "course", n: "count", nama: "name", nim: "studentNumber",
  oleh: "author", organisasi: "organizations", pelamar: "applicants", pengalaman: "experience", penutup: "closing",
  peran: "role", peringatan: "warning", perusahaan: "company", plus: "niceToHave", poin: "points", posisi: "position",
  prescreen: "prescreenAnswers", prescreenTanya: "prescreenQuestions", prodi: "studyProgram", prodiId: "studyProgramId",
  proyek: "projects", ringkasan: "summary", saran: "advice", sertifikasi: "certifications", skill: "skills",
  sumber: "source", syarat: "requirement", tahap: "stage", tahapKode: "stageCode", tanggal: "date", tempat: "place",
  tipe: "type", transkrip: "transcript", ukuran: "size", update: "lastUpdate", wajib: "mustHave", waktu: "period",
};
const APP_TO_WIRE = Object.fromEntries(Object.entries(WIRE_TO_APP).map(([wire, app]) => [app, wire]));

function renameKeys(value: unknown, keys: Record<string, string>): unknown {
  if (Array.isArray(value)) return value.map((item) => renameKeys(item, keys));
  if (value === null || typeof value !== "object") return value;
  return Object.fromEntries(
    Object.entries(value).map(([key, item]) => [Object.hasOwn(keys, key) ? keys[key] : key, renameKeys(item, keys)]),
  );
}

/** Response backend ke bentuk yang dipakai frontend. */
export const toAppKeys = (value: unknown) => renameKeys(value, WIRE_TO_APP);
/** Body request frontend ke bentuk yang diterima backend. */
export const toWireKeys = (value: unknown) => renameKeys(value, APP_TO_WIRE);
