import { NextResponse } from "next/server";
import {
  analyzeQuestionAnswer,
  type QuestionAnalysisResult,
  type StarSection,
} from "@/lib/analysis/autoCorrector";

interface EvaluateItemInput {
  questionIndex: number;
  questionText: string;
  transcript: string;
}

interface EvaluateRequestBody {
  items: EvaluateItemInput[];
}

interface GroqStarOutput {
  situation: string;
  task: string;
  action: string;
  result: string;
}

interface GroqAnalysisItem {
  questionIndex: number;
  fluencyScore: number;
  isPassiveOrNegative: boolean;
  dimensionScores: [number, number, number, number, number];
  star: GroqStarOutput;
  strengths: string;
  improvementTips: string;
}

interface GroqResponsePayload {
  analyses: GroqAnalysisItem[];
}

async function callGroq(
  items: EvaluateItemInput[],
  apiKey: string,
  modelName: string,
): Promise<QuestionAnalysisResult[] | null> {
  const prompt = `Kamu adalah HRD Recruiter dan AI Interview Assessor profesional bersertifikat.
Tugasmu: Lakukan evaluasi objektif dan mendalam terhadap jawaban interview kandidat untuk setiap pertanyaan di bawah ini.

Daftar Pertanyaan & Jawaban Kandidat:
${items
  .map(
    (item, idx) =>
      `[Soal #${idx + 1} - Index: ${item.questionIndex}]
Pertanyaan: "${item.questionText}"
Transkrip Jawaban Kandidat: "${item.transcript || "(Kandidat hening / tidak menjawab)"}"`,
  )
  .join("\n\n")}

Aturan Penilaian:
1. fluencyScore (0 - 100):
   - Jika jawaban pasif, menolak kerja sama, atau menyatakan "tidak melakukan apa-apa", "titip nama", "males", skor WAJIB sangat rendah (10 - 40). Flag isPassiveOrNegative = true.
   - Jika hening / tidak menjawab: skor 45 - 50.
   - Jika jawaban aktif, terstruktur, relevan dengan bidang teknologi/akademik: skor 75 - 95.
2. dimensionScores: Array 5 angka (0 - 100) berurutan:
   - [0] Skill Match (bobot 35%)
   - [1] Experience Match (bobot 25%)
   - [2] Responsibility & Scope (bobot 20%)
   - [3] Education & Certification (bobot 10%)
   - [4] Added Value (bobot 10%)
3. star: Buatkan rekomendasi jawaban terstruktur dengan metode STAR dalam Bahasa Indonesia profesional yang konkret dan solutif:
   - situation: Konteks permasalahan nyata sesuai pertanyaan.
   - task: Tanggung jawab utama dan tantangan peran.
   - action: Langkah konkret aksi profesional yang ideal (jika jawaban asli kandidat pasif/buruk, berikan rekomendasi aksi solutif).
   - result: Hasil nyata terukur dan dampak positif bagi tim/proyek.
4. strengths: 1-2 kalimat kelebihan nyata dari jawaban kandidat (atau catatan jika jawaban buruk).
5. improvementTips: 1-2 kalimat masukan perbaikan yang sangat kritis dan konstruktif.

Kembalikan respon HANYA dalam format JSON valid sesuai skema berikut:
{
  "analyses": [
    {
      "questionIndex": 0,
      "fluencyScore": 85,
      "isPassiveOrNegative": false,
      "dimensionScores": [85, 80, 88, 75, 82],
      "star": {
        "situation": "...",
        "task": "...",
        "action": "...",
        "result": "..."
      },
      "strengths": "...",
      "improvementTips": "..."
    }
  ]
}`;

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: modelName,
      response_format: { type: "json_object" },
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content:
            "Kamu adalah AI Evaluator HRD yang selalu mengembalikan JSON valid sesuai skema.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    }),
  });

  if (!res.ok) {
    const errorText = await res.text().catch(() => "");
    console.error("Groq API error:", res.status, errorText);
    return null;
  }

  const json = await res.json();
  const content = json.choices?.[0]?.message?.content;
  if (!content) return null;

  const parsed: GroqResponsePayload = JSON.parse(content);
  if (!parsed.analyses || !Array.isArray(parsed.analyses)) return null;

  return items.map((item, idx) => {
    const local = analyzeQuestionAnswer(
      item.questionIndex,
      item.questionText,
      item.transcript,
    );
    const aiItem = parsed.analyses.find((a) => a.questionIndex === item.questionIndex) || parsed.analyses[idx];

    if (!aiItem) return local;

    const starSections: StarSection[] = [
      {
        label: "S",
        title: "Situation (Konteks Masalah)",
        content: aiItem.star?.situation || local.starSections[0]?.content || "",
      },
      {
        label: "T",
        title: "Task (Tantangan & Peran)",
        content: aiItem.star?.task || local.starSections[1]?.content || "",
      },
      {
        label: "A",
        title: "Action (Langkah Konkret Solutif)",
        content: aiItem.star?.action || local.starSections[2]?.content || "",
      },
      {
        label: "R",
        title: "Result (Dampak Nyata)",
        content: aiItem.star?.result || local.starSections[3]?.content || "",
      },
    ];

    const safeDimensionScores: [number, number, number, number, number] =
      Array.isArray(aiItem.dimensionScores) && aiItem.dimensionScores.length === 5
        ? (aiItem.dimensionScores.map((s) => Math.max(0, Math.min(100, Math.round(s)))) as [
            number,
            number,
            number,
            number,
            number,
          ])
        : local.dimensionScores;

    return {
      ...local,
      fluencyScore: Math.max(0, Math.min(100, Math.round(aiItem.fluencyScore ?? local.fluencyScore))),
      isPassiveOrNegative: Boolean(aiItem.isPassiveOrNegative ?? local.isPassiveOrNegative),
      dimensionScores: safeDimensionScores,
      starSections,
      strengths: aiItem.strengths || local.strengths,
      improvementTips: aiItem.improvementTips || local.improvementTips,
    };
  });
}

async function callGemini(
  items: EvaluateItemInput[],
  geminiKey: string,
): Promise<QuestionAnalysisResult[] | null> {
  const prompt = `Sebagai HRD Interview Assessor profesional, evaluasi jawaban wawancara berikut:
${items
  .map(
    (item, idx) =>
      `[Soal #${idx + 1} - Index: ${item.questionIndex}]
Pertanyaan: "${item.questionText}"
Jawaban: "${item.transcript}"`,
  )
  .join("\n\n")}

Berikan evaluasi dalam format JSON:
{
  "analyses": [
    {
      "questionIndex": 0,
      "fluencyScore": 85,
      "isPassiveOrNegative": false,
      "dimensionScores": [85, 80, 88, 75, 82],
      "star": {
        "situation": "...",
        "task": "...",
        "action": "...",
        "result": "..."
      },
      "strengths": "...",
      "improvementTips": "..."
    }
  ]
}`;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" },
      }),
    },
  );

  if (!res.ok) return null;
  const json = await res.json();
  const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) return null;

  const parsed: GroqResponsePayload = JSON.parse(text);
  if (!parsed.analyses || !Array.isArray(parsed.analyses)) return null;

  return items.map((item, idx) => {
    const local = analyzeQuestionAnswer(
      item.questionIndex,
      item.questionText,
      item.transcript,
    );
    const aiItem = parsed.analyses.find((a) => a.questionIndex === item.questionIndex) || parsed.analyses[idx];
    if (!aiItem) return local;

    return {
      ...local,
      fluencyScore: Math.round(aiItem.fluencyScore ?? local.fluencyScore),
      isPassiveOrNegative: Boolean(aiItem.isPassiveOrNegative ?? local.isPassiveOrNegative),
      dimensionScores: (aiItem.dimensionScores ?? local.dimensionScores) as [
        number,
        number,
        number,
        number,
        number,
      ],
      starSections: [
        {
          label: "S",
          title: "Situation (Konteks Masalah)",
          content: aiItem.star?.situation || local.starSections[0]?.content || "",
        },
        {
          label: "T",
          title: "Task (Tantangan & Peran)",
          content: aiItem.star?.task || local.starSections[1]?.content || "",
        },
        {
          label: "A",
          title: "Action (Langkah Konkret Solutif)",
          content: aiItem.star?.action || local.starSections[2]?.content || "",
        },
        {
          label: "R",
          title: "Result (Dampak Nyata)",
          content: aiItem.star?.result || local.starSections[3]?.content || "",
        },
      ],
      strengths: aiItem.strengths || local.strengths,
      improvementTips: aiItem.improvementTips || local.improvementTips,
    };
  });
}

export async function POST(req: Request) {
  try {
    const body: EvaluateRequestBody = await req.json();
    if (!body || !Array.isArray(body.items)) {
      return NextResponse.json({ error: "Format request tidak valid" }, { status: 400 });
    }

    const groqKey = process.env.GROQ_API_KEY;
    const groqModel = process.env.GROQ_MODEL || "openai/gpt-oss-120b";
    const geminiKey = process.env.GEMINI_API_KEY;

    // 1. Coba Groq API terlebih dahulu (ultra-fast ~500ms)
    if (groqKey) {
      try {
        const groqResults = await callGroq(body.items, groqKey, groqModel);
        if (groqResults && groqResults.length === body.items.length) {
          return NextResponse.json({
            provider: "groq",
            model: groqModel,
            analyses: groqResults,
          });
        }
      } catch (err) {
        console.warn("Groq evaluate failed, attempting fallback:", err);
      }
    }

    // 2. Fallback ke Gemini API jika kunci Gemini tersedia
    if (geminiKey) {
      try {
        const geminiResults = await callGemini(body.items, geminiKey);
        if (geminiResults && geminiResults.length === body.items.length) {
          return NextResponse.json({
            provider: "gemini",
            model: "gemini-1.5-flash",
            analyses: geminiResults,
          });
        }
      } catch (err) {
        console.warn("Gemini evaluate fallback failed:", err);
      }
    }

    // 3. Fallback cerdas ke kalkulasi lokal bila seluruh API eksternal offline
    const localResults = body.items.map((item) =>
      analyzeQuestionAnswer(item.questionIndex, item.questionText, item.transcript),
    );

    return NextResponse.json({
      provider: "local",
      model: "heuristic-autocorrector",
      analyses: localResults,
    });
  } catch (error) {
    console.error("Evaluation handler error:", error);
    return NextResponse.json(
      { error: "Gagal mengevaluasi respons latihan" },
      { status: 500 },
    );
  }
}
