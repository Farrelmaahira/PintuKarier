import { NextResponse } from "next/server";
import { api } from "@/lib/api";
import { INITIAL_READINESS_PROFILE } from "@/lib/data/readiness/data";

export async function GET() {
  try {
    const data = await api("/me/readiness");
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(INITIAL_READINESS_PROFILE);
  }
}
