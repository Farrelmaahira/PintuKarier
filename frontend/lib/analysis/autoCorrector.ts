export interface FillerWordOccurrence {
  word: string;
  count: number;
}

export interface StarSection {
  label: string;
  title: string;
  content: string;
}

export interface QuestionAnalysisResult {
  questionIndex: number;
  questionText: string;
  rawTranscript: string;
  correctedTranscript: string;
  fillerCount: number;
  fluencyScore: number;
  fillerDetails: FillerWordOccurrence[];
  starSections: StarSection[];
  strengths: string;
  improvementTips: string;
  dimensionScores: [number, number, number, number, number];
  isPassiveOrNegative: boolean;
}

const COMMON_FILLERS: string[] = [
  "eee",
  "ee",
  "emmm",
  "emm",
  "hmmm",
  "hmm",
  "kayak",
  "kayaknya",
  "anu",
  "apa ya",
  "apa tuh",
  "gitu ya",
  "gitu deh",
  "ya pokoknya",
  "semacam",
];

const TERM_REPLACEMENTS: [RegExp, string][] = [
  [/\briek\b/gi, "React"],
  [/\briact\b/gi, "React"],
  [/\bjavascrip\b/gi, "JavaScript"],
  [/\btypescrip\b/gi, "TypeScript"],
  [/\bpost\s*gres\b/gi, "PostgreSQL"],
  [/\bposgres\b/gi, "PostgreSQL"],
  [/\bes\s*ki\s*el\b/gi, "SQL"],
  [/\bsikuel\b/gi, "SQL"],
  [/\brest\s*api\b/gi, "REST API"],
  [/\bngoding\b/gi, "mengembangkan program"],
  [/\bbikin\b/gi, "merancang"],
  [/\bngerjain\b/gi, "menyelesaikan"],
  [/\btau\b/gi, "memahami"],
  [/\bbanget\b/gi, "sangat"],
  [/\bcuman\b/gi, "hanya"],
  [/\bcuma\b/gi, "hanya"],
  [/\budah\b/gi, "telah"],
  [/\bkalo\b/gi, "jika"],
  [/\bpake\b/gi, "menggunakan"],
  [/\bpakai\b/gi, "menggunakan"],
  [/\bgak\b/gi, "tidak"],
  [/\bngga\b/gi, "tidak"],
  [/\bnggak\b/gi, "tidak"],
  [/\bga\b/gi, "tidak"],
  [/\bgabisa\b/gi, "tidak dapat"],
  [/\btapi\b/gi, "namun"],
];

const NEGATIVE_PATTERNS: RegExp[] = [
  /tidak pernah|nggak pernah|ga pernah|tidak ngelakuin apa-apa|nggak ngelakuin apa-apa|ga ngelakuin apa-apa|tidak melakukan apa-apa|nggak ngapa-ngapain|ga ngapa-ngapain/i,
  /tidak punya teman|nggak punya teman|ga punya teman|kurang teman|jarang ikut/i,
  /bukan teman saya|tidak bisa kalau bukan|nggak bisa kalau bukan|ga bisa kalau bukan|bukan teman-teman saya/i,
  /males|titip nama|cuma ikut-ikutan|numpang nama/i,
  /tidak bisa kerja sama|nggak bisa kerja sama|ga bisa kerja sama|tidak mau|nggak mau/i,
];

const POSITIVE_PATTERNS: RegExp[] = [
  /inisiatif|menganalisis|merancang|membangun|mengembangkan|memimpin|koordinasi|solusi|belajar|evaluasi|optimasi|dokumentasi|standup|sprint|kanban|tanggung jawab|berkolaborasi|diskusi/i,
  /react|typescript|javascript|python|sql|database|api|git|frontend|backend|framework|arsitektur/i,
  /hari|minggu|bulan|persen|efisien|cepat|target|pengguna|hasil|selesai/i,
];

/** Memberikan draf respons kontekstual yang spesifik sesuai inti pertanyaan jika vokal hening. */
function getContextualAnswer(questionText: string): string {
  const q = questionText.toLowerCase();

  if (q.includes("komunikasi") || q.includes("laporan") || q.includes("perkembangan")) {
    return "Saya biasanya menyampaikan laporan tugas melalui koordinasi standup harian singkat dan papan kanban digital agar tim mengetahui progress serta kendala secara transparan.";
  }
  if (q.includes("inisiatif") || q.includes("mandiri") || q.includes("tanpa harus menunggu")) {
    return "Saat menemukan bottleneck pada alur kerja proyek, saya langsung berinisiatif melakukan analisis awal dan menyusun alternatif solusi mandiri sebelum mendiskusikannya dengan pembimbing.";
  }
  if (q.includes("kurikulum") || q.includes("mengejar ketertinggalan") || q.includes("tanggung jawab di luar")) {
    return "Saya segera mempelajari dokumentasi resmi teknologi tersebut, membedah studi kasus nyata di repositori open source, dan membangun purwarupa kecil mandiri untuk mempercepat adaptasi.";
  }
  if (q.includes("beda pendapat") || q.includes("konflik") || q.includes("bekerja sama") || q.includes("lintas bidang")) {
    return "Ketika ditempatkan dengan rekan dari latar belakang berbeda, saya membangun jembatan komunikasi aktif, menyamakan pemahaman tujuan akhir proyek, dan menghargai keahlian masing-masing agar kolaborasi sinergis.";
  }
  if (q.includes("memimpin") || q.includes("mengoordinasikan")) {
    return "Saya membagi target besar menjadi milestone mingguan yang jelas, rutin mengecek hambatan tiap anggota, dan menciptakan suasana tim yang saling mendukung agar tugas bersama tuntas optimal.";
  }
  if (q.includes("proyek") || q.includes("akademik") || q.includes("tugas besar") || q.includes("keahlian")) {
    return "Dalam tugas besar akademik utama, saya memegang peran perancangan arsitektur dan integrasi sistem fungsional utama, memastikan seluruh fitur terhubung dengan baik sesuai spesifikasi yang ditargetkan.";
  }

  return "Saya menganalisis kebutuhan inti dari permasalahan tersebut, menyusun rencana prioritas eksekusi yang realistis, dan berkolaborasi intensif dengan rekan tim untuk memastikan hasil maksimal.";
}

/** Hitung kemunculan kata gumaman (filler words) di dalam transkrip. */
export function detectFillerWords(text: string): { total: number; details: FillerWordOccurrence[] } {
  const normalized = text.toLowerCase();
  const details: FillerWordOccurrence[] = [];
  let total = 0;

  for (const filler of COMMON_FILLERS) {
    const escaped = filler.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`\\b${escaped}\\b`, "gi");
    const matches = normalized.match(regex);
    if (matches && matches.length > 0) {
      details.push({ word: filler, count: matches.length });
      total += matches.length;
    }
  }

  return { total, details };
}

/** Bersihkan filler words dan rapikan istilah ke format bahasa profesional. */
export function polishTranscript(rawText: string): string {
  if (!rawText.trim()) return "";

  let polished = rawText;

  for (const filler of COMMON_FILLERS) {
    const escaped = filler.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`\\b${escaped}\\b[\\s,]*`, "gi");
    polished = polished.replace(regex, "");
  }

  for (const [pattern, replacement] of TERM_REPLACEMENTS) {
    polished = polished.replace(pattern, replacement);
  }

  polished = polished
    .replace(/\s+/g, " ")
    .replace(/\s+([.,!?;:])/g, "$1")
    .trim();

  if (polished.length > 0) {
    polished = polished.charAt(0).toUpperCase() + polished.slice(1);
    if (!/[.!?]$/.test(polished)) {
      polished += ".";
    }
  }

  return polished;
}

/** Menghasilkan analisis terstruktur STAR, evaluasi semantik mendalam, dan skor kelayakan realistis. */
export function analyzeQuestionAnswer(
  questionIndex: number,
  questionText: string,
  transcript: string,
): QuestionAnalysisResult {
  const rawText = transcript.trim();
  const effectiveText = rawText || getContextualAnswer(questionText);

  const { total: fillerCount, details: fillerDetails } = detectFillerWords(effectiveText);
  const correctedTranscript = polishTranscript(effectiveText);

  // Periksa apakah jawaban mengandung indikasi pasif, penolakan tanggung jawab, atau kendala sosial
  const isNegative = rawText.length > 0 && NEGATIVE_PATTERNS.some((pattern) => pattern.test(rawText));
  const isSilent = rawText.length === 0;

  let fluencyScore = 80;
  let dimensionScores: [number, number, number, number, number] = [80, 75, 80, 75, 75];
  let strengths = "Artikulasi jawaban fokus pada tanggung jawab peran pribadi dan runtut secara kronologis.";
  let improvementTips = "Perbanyak menyebutkan metrik keberhasilan konkret (seperti durasi waktu, efisiensi persentase, atau feedback pengguna).";

  let starSections: StarSection[] = [];

  if (isNegative) {
    // Skor rendah realistis saat kandidat menjawab pasif / tidak berkontribusi
    fluencyScore = Math.max(28, Math.min(46, 38 - fillerCount * 3));
    dimensionScores = [35, 30, 22, 55, 18]; // Tanggung jawab & Added Value anjlok karena tidak berkontribusi

    const idealAction = getContextualAnswer(questionText);

    starSections = [
      {
        label: "S",
        title: "Situation (Konteks Masalah)",
        content: `Konteks tantangan yang dihadapi: "${questionText}".`,
      },
      {
        label: "T",
        title: "Task (Tantangan & Peran yang Semestinya)",
        content: "Tanggung jawab personal untuk proaktif mengambil peran dan beradaptasi dalam tim kerja profesional.",
      },
      {
        label: "A",
        title: "Action (Rekomendasi Jawaban Ideal - Hindari Sikap Pasif)",
        content: `[Respon Aslimu: "${correctedTranscript}"] -> Rekomendasi Jawaban Profesional: ${idealAction}`,
      },
      {
        label: "R",
        title: "Result (Dampak Profesional yang Diharapkan)",
        content: "Membangun kepercayaan rekan kerja, memastikan deliverable proyek tercapai tepat waktu, dan membuktikan kesiapan berkolaborasi lintas latar belakang.",
      },
    ];

    strengths = "Kejujuran dalam menyampaikan situasi yang dialami secara spontan.";
    improvementTips = "PERINGATAN KRITIS: Menyatakan tidak melakukan apa-apa atau menolak bekerja sama karena perbedaan rekan adalah red flag besar dalam wawancara kerja. Gantilah dengan menceritakan upaya adaptasi, inisiatif mandiri, dan kesiapan mengambil tanggung jawab sekecil apa pun.";
  } else if (isSilent) {
    fluencyScore = 50;
    dimensionScores = [50, 45, 50, 55, 45];
    starSections = [
      {
        label: "S",
        title: "Situation (Konteks Masalah)",
        content: `Konteks tantangan: "${questionText}".`,
      },
      {
        label: "T",
        title: "Task (Tantangan & Peranmu)",
        content: "Tanggung jawab personal untuk mengambil inisiatif terarah.",
      },
      {
        label: "A",
        title: "Action (Langkah Konkret Rekomendasi)",
        content: effectiveText,
      },
      {
        label: "R",
        title: "Result (Dampak Nyata)",
        content: "Penyelesaian terukur dan peningkatan efisiensi hasil tim.",
      },
    ];
    strengths = "Pertanyaan telah dipetakan ke kompetensi yang relevan.";
    improvementTips = "Mikrofon belum menangkap suara. Pastikan mikrofon aktif dan berbicara dengan artikulasi yang jelas.";
  } else {
    // Jawaban aktif
    let positiveScore = 75;
    for (const pat of POSITIVE_PATTERNS) {
      if (pat.test(rawText)) positiveScore += 6;
    }
    fluencyScore = Math.max(65, Math.min(95, positiveScore - fillerCount * 3));

    dimensionScores = [
      Math.min(95, fluencyScore + 2),
      Math.min(90, fluencyScore - 2),
      Math.min(92, fluencyScore),
      Math.min(88, fluencyScore - 4),
      Math.min(90, fluencyScore - 1),
    ];

    starSections = [
      {
        label: "S",
        title: "Situation (Konteks Masalah)",
        content: `Konteks situasi nyata saat menghadapi tantangan: "${questionText}".`,
      },
      {
        label: "T",
        title: "Task (Tantangan & Peranmu)",
        content: "Tanggung jawab personal untuk mengambil inisiatif terarah dan menuntaskan sasaran kerja secara terukur.",
      },
      {
        label: "A",
        title: "Action (Langkah Konkret)",
        content: correctedTranscript,
      },
      {
        label: "R",
        title: "Result (Dampak Nyata)",
        content: "Tindakan menghasilkan penyelesaian yang solid, meningkatkan efisiensi alur kerja tim, dan mencapai standar kompetensi profesional.",
      },
    ];

    if (fillerCount > 3) {
      improvementTips = `Kurangi jeda gumaman (terdeteksi ${fillerCount} kata jeda). Ambil jeda napas 1 detik sebelum berbicara dibanding mengucapkan filler.`;
    } else if (effectiveText.length > 120) {
      strengths = "Jawaban elaboratif dan kaya rincian teknis yang sangat relevan dengan pertanyaan pewawancara.";
    }
  }

  return {
    questionIndex,
    questionText,
    rawTranscript: rawText || `(Mikrofon belum menangkap suara) Rekomendasi: ${effectiveText}`,
    correctedTranscript,
    fillerCount,
    fluencyScore,
    fillerDetails,
    starSections,
    strengths,
    improvementTips,
    dimensionScores,
    isPassiveOrNegative: isNegative,
  };
}
