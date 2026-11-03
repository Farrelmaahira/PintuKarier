import { NextResponse } from "next/server";
import { api } from "@/lib/api";
import { BASELINE_LEARNING_OVERVIEW } from "@/lib/data/learning/data";

export async function GET() {
  try {
    const data = await api("/me/learning");
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(BASELINE_LEARNING_OVERVIEW);
  }
}
