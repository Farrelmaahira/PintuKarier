import { spawn } from "child_process";
import path from "path";
import { NextResponse } from "next/server";

export interface TtsErrorResponse {
  error: string;
}

const MAX_TEXT_LENGTH = 500;
const audioCache = new Map<string, Buffer>();

/** Menghasilkan audio TTS Bahasa Indonesia autentik (Pria: ArdiNeural, Wanita: GadisNeural). */
function synthesizeEdgeTts(text: string, voice: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(process.cwd(), "scripts", "edge_tts_synthesize.py");
    const pythonProc = spawn("python", [scriptPath, text, voice], {
      stdio: ["ignore", "pipe", "pipe"],
    });

    const chunks: Buffer[] = [];
    let stderr = "";

    pythonProc.stdout.on("data", (chunk: Buffer) => {
      chunks.push(chunk);
    });

    pythonProc.stderr.on("data", (err: Buffer) => {
      stderr += err.toString();
    });

    const timer = setTimeout(() => {
      pythonProc.kill();
      reject(new Error("Timeout saat memproses audio TTS"));
    }, 12000);

    pythonProc.on("close", (code) => {
      clearTimeout(timer);
      if (code === 0 && chunks.length > 0) {
        resolve(Buffer.concat(chunks));
      } else {
        reject(new Error(`Edge TTS gagal (code ${code}): ${stderr}`));
      }
    });

    pythonProc.on("error", (err) => {
      clearTimeout(timer);
      reject(err);
    });
  });
}

/** Route handler untuk mengalirkan audio TTS Bahasa Indonesia asli (Pria & Wanita) yang kompatibel di semua browser. */
export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const text = searchParams.get("text")?.trim();
  const gender = searchParams.get("gender")?.trim().toLowerCase() === "pria" ? "pria" : "wanita";

  if (!text) {
    return NextResponse.json<TtsErrorResponse>({ error: "Parameter teks wajib diisi" }, { status: 400 });
  }

  if (text.length > MAX_TEXT_LENGTH) {
    return NextResponse.json<TtsErrorResponse>(
      { error: `Teks melebihi batas maksimal ${MAX_TEXT_LENGTH} karakter` },
      { status: 400 },
    );
  }

  const cacheKey = `${gender}:${text}`;
  const cached = audioCache.get(cacheKey);
  if (cached) {
    return new Response(new Uint8Array(cached), {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=86400, s-maxage=86400",
        "X-Cache": "HIT",
      },
    });
  }

  const voice = gender === "pria" ? "id-ID-ArdiNeural" : "id-ID-GadisNeural";

  // Jalur utama: Microsoft Edge Neural TTS autentik (Ardi / Gadis)
  try {
    const audioBuffer = await synthesizeEdgeTts(text, voice);
    audioCache.set(cacheKey, audioBuffer);
    if (audioCache.size > 200) {
      const firstKey = audioCache.keys().next().value;
      if (firstKey) audioCache.delete(firstKey);
    }

    return new Response(new Uint8Array(audioBuffer), {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=86400, s-maxage=86400",
        "X-Cache": "MISS",
      },
    });
  } catch (err) {
    console.error("synthesizeEdgeTts error:", err);
    // Jalur cadangan fallback jika subproses gagal
    try {
      const fallbackUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=id&client=tw-ob&q=${encodeURIComponent(text)}`;
      const fallbackRes = await fetch(fallbackUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
      });

      if (fallbackRes.ok && fallbackRes.body) {
        return new Response(fallbackRes.body, {
          status: 200,
          headers: {
            "Content-Type": "audio/mpeg",
            "Cache-Control": "public, max-age=86400, s-maxage=86400",
          },
        });
      }
    } catch {
      // Abaikan fallback error
    }

    return NextResponse.json<TtsErrorResponse>(
      { error: "Gagal mengambil audio suara dari server TTS" },
      { status: 502 },
    );
  }
}
