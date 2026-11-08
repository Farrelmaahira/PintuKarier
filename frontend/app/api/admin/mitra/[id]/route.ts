import { NextResponse } from "next/server";
import { api } from "@/lib/api";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const data = await api(`/admin/mitra/${id}`, {
      method: "PUT",
      body,
    });
    return NextResponse.json(data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Gagal memperbarui mitra";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await api(`/admin/mitra/${id}`, {
      method: "DELETE",
    });
    return NextResponse.json(data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Gagal menghapus mitra";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

