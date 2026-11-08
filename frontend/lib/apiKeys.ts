/**
 * Kamus key JSON Golang API (Indonesia/Snake) ke nama field frontend (Inggris CamelCase).
 * Hanya key; nilai seperti "Lolos" atau "Memenuhi Kriteria" tetap apa adanya.
 */
const WIRE_TO_APP: Record<string, string> = {
  action_recommendations: "actionRecommendations", actionRecommendations: "actionRecommendations",
  action_url: "actionUrl", actionUrl: "actionUrl",
  active_drills: "activeDrills", activeDrills: "activeDrills",
  aksi: "action", alasan: "reason", alasanKoreksi: "correctionReason", angkatan: "cohortYear", bidang: "jobField",
  bidangIndustri: "industrySector", bidang_industri: "industrySector", bukti: "evidence", catatan: "note",
  competencies: "competencies", competencies_covered: "competenciesCovered", competenciesCovered: "competenciesCovered",
  completed_modules: "completedModules", completedModules: "completedModules",
  correct_index: "correctIndex", correctIndex: "correctIndex",
  cvKey: "cvKey", cvUrl: "cvUrl", cv_key: "cvKey", cv_url: "cvUrl",
  dari: "sender", deskripsi: "description", detik: "seconds", dilamar: "appliedOn", dimensi: "dimensions",
  dimensions: "dimensions", ditutup: "closed", drill_id: "drillId", drillId: "drillId",
  durasi: "duration", duration_minutes: "durationMinutes", durationMinutes: "durationMinutes",
  estimated_gain: "estimatedGain", estimatedGain: "estimatedGain",
  event_name: "eventName", eventName: "eventName",
  evidence_src: "evidenceSrc", evidenceSrc: "evidenceSrc",
  external_resource_url: "externalResourceUrl", externalResourceUrl: "externalResourceUrl",
  feedbackSla: "feedbackSla", feedbackTerkirim: "feedbackSent", feedback_terkirim: "feedbackSent", fitur: "feature",
  in_progress_modules: "inProgressModules", inProgressModules: "inProgressModules",
  instansi: "institution", interviewTanya: "interviewQuestions", ipk: "gpa",
  is_correct: "isCorrect", isCorrect: "isCorrect", isi: "content", jawab: "answer", jawaban: "answers",
  jumlahLowongan: "vacancyCount", jumlah_lowongan: "vacancyCount",
  jumlahPelamar: "applicantCount", jumlah_pelamar: "applicantCount",
  jurusan: "department", kampus: "campus",
  kategori: "category", kategoriAi: "aiCategory", kekuatan: "strengths", kenapa: "why", keputusan: "decision",
  kesenjanganSkill: "competencyGaps", kesenjangan_skill: "competencyGaps",
  kode: "departmentCode", kodeJurusan: "departmentCode", kompetensi: "competency", kutipan: "quote",
  lokasi: "location", lowongan: "vacancy", lowonganId: "vacancyId", matkul: "course",
  mitraPerekrut: "partnerCount", mitra_perekrut: "partnerCount",
  module_id: "moduleId", moduleId: "moduleId", n: "count", nama: "name",
  namaJurusan: "departmentName", namaPerusahaan: "companyName", nama_perusahaan: "companyName",
  new_overall_score: "newOverallScore", newOverallScore: "newOverallScore",
  nim: "studentNumber", oleh: "author", option_index: "optionIndex", optionIndex: "optionIndex",
  organisasi: "organizations", overall_category: "overallCategory", overallCategory: "overallCategory",
  overall_score: "overallScore", overallScore: "overallScore", pelamar: "applicants", pengalaman: "experience",
  penutup: "closing", peran: "role", peringatan: "warning",
  persentaseFeedback: "feedbackRate", persentase_feedback: "feedbackRate", perusahaan: "company",
  plus: "niceToHave", poin: "points", points_earned: "pointsEarned", pointsEarned: "pointsEarned",
  posisi: "position", potential_up: "potentialUp", potentialUp: "potentialUp",
  prescreen: "prescreenAnswers", prescreenTanya: "prescreenQuestions",
  problem_statement: "problemStatement", problemStatement: "problemStatement",
  prodi: "studyProgram", prodiId: "studyProgramId", progress_history: "progressHistory", progressHistory: "progressHistory",
  proyek: "projects", rataKesiapan: "avgReadiness", rata_kesiapan: "avgReadiness",
  readiness_boost: "readinessBoost", readinessBoost: "readinessBoost",
  recommended_category: "recommendedCategory", recommendedCategory: "recommendedCategory",
  ringkasan: "summary", ringkasanJurusan: "departmentSummaries", ringkasan_jurusan: "departmentSummaries", saran: "advice",
  sertifikasi: "certifications", skill: "skills", slaFeedback: "feedbackSla", sla_feedback: "feedbackSla",
  statusKemitraan: "partnershipStatus", status_kemitraan: "partnershipStatus",
  student_id: "studentId", studentId: "studentId", sumber: "source", syarat: "requirement", tahap: "stage",
  tahapKode: "stageCode", tanggal: "date", target_competency: "targetCompetency", targetCompetency: "targetCompetency",
  target_position: "targetPosition", targetPosition: "targetPosition", tempat: "place", tipe: "type",
  tingkatKesiapan: "readinessLevel", tingkat_kesiapan: "readinessLevel",
  total_modules: "totalModules", totalModules: "totalModules",
  total_score_boost: "totalScoreBoost", totalScoreBoost: "totalScoreBoost",
  totalLamaran: "totalApplications", total_lamaran: "totalApplications",
  totalLowongan: "totalVacancies", total_lowongan: "totalVacancies",
  totalMahasiswa: "totalStudents", total_mahasiswa: "totalStudents",
  totalMitra: "totalPartners", total_mitra: "totalPartners",
  totalPelamar: "totalApplicants", total_pelamar: "totalApplicants",
  transkrip: "transcript", ukuran: "size",
  update: "lastUpdate", wajib: "mustHave", waktu: "period",
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
