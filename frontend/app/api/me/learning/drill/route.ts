import { NextResponse } from "next/server";
import { api } from "@/lib/api";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = await api("/me/learning/drill", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return NextResponse.json(data);
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Gagal memproses drill" },
      { status: 500 }
    );
  }
}
