import { NextResponse } from "next/server";
import { api } from "@/lib/api";
import { PNJ_PARTNERS } from "@/lib/data/admin/data";

export async function GET() {
  try {
    const data = await api("/admin/mitra");
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(PNJ_PARTNERS);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = await api("/admin/mitra", {
      method: "POST",
      body,
    });
    return NextResponse.json(data, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Gagal menambahkan mitra";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
