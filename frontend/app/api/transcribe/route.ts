import { spawn } from "child_process";
import fs from "fs";
import os from "os";
import path from "path";
import { NextResponse } from "next/server";

export interface TranscribeResponse {
  text: string;
  error?: string;
}

/** Route handler untuk mentranskripsi file rekaman suara vokal kandidat ke teks Bahasa Indonesia. */
export async function POST(request: Request): Promise<Response> {
  try {
    const formData = await request.formData();
    const audioFile = formData.get("audio");

    if (!audioFile || !(audioFile instanceof Blob)) {
      return NextResponse.json<TranscribeResponse>(
        { text: "", error: "File audio tidak ditemukan dalam request" },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(await audioFile.arrayBuffer());
    if (buffer.length === 0) {
      return NextResponse.json<TranscribeResponse>({ text: "" });
    }

    const tempDir = os.tmpdir();
    const tempAudioPath = path.join(tempDir, `interview_${Date.now()}_${Math.random().toString(36).slice(2)}.webm`);
    await fs.promises.writeFile(tempAudioPath, buffer);

    const scriptPath = path.join(process.cwd(), "scripts", "transcribe_audio.py");

    const transcribedText = await new Promise<string>((resolve) => {
      const pythonProc = spawn("python", [scriptPath, tempAudioPath, "id-ID"], {
        stdio: ["ignore", "pipe", "pipe"],
      });

      let stdout = "";
      let stderr = "";

      pythonProc.stdout.on("data", (chunk: Buffer) => {
        stdout += chunk.toString();
      });

      pythonProc.stderr.on("data", (err: Buffer) => {
        stderr += err.toString();
      });

      const timer = setTimeout(() => {
        pythonProc.kill();
        resolve("");
      }, 15000);

      pythonProc.on("close", (code) => {
        clearTimeout(timer);
        if (code === 0 && stdout) {
          try {
            const parsed = JSON.parse(stdout.trim()) as { text?: string };
            resolve(parsed.text || "");
          } catch {
            resolve("");
          }
        } else {
          console.warn("Transcribe process code", code, stderr);
          resolve("");
        }
      });

      pythonProc.on("error", (err) => {
        clearTimeout(timer);
        console.warn("Failed to spawn transcribe:", err);
        resolve("");
      });
    });

    // Hapus file temp
    try {
      await fs.promises.unlink(tempAudioPath);
    } catch {
      // Abaikan jika sudah terhapus
    }

    return NextResponse.json<TranscribeResponse>({ text: transcribedText });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Gagal mentranskripsi rekaman audio";
    return NextResponse.json<TranscribeResponse>({ text: "", error: msg }, { status: 500 });
  }
}
