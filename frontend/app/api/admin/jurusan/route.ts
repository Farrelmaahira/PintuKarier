import { NextResponse } from "next/server";
import { api } from "@/lib/api";
import { PNJ_DEPARTMENTS } from "@/lib/data/admin/data";

export async function GET() {
  try {
    const data = await api("/admin/jurusan");
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(PNJ_DEPARTMENTS);
  }
}
