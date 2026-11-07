import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  const { key } = await params;
  const search = req.nextUrl.search;
  const apiUrl = process.env.API_URL ?? "http://localhost:8080";
  const backendUrl = `${apiUrl}/files/${encodeURIComponent(key)}${search}`;

  try {
    const res = await fetch(backendUrl);
    if (!res.ok) {
      return new NextResponse("File tidak ditemukan atau terjadi kesalahan server", { status: res.status });
    }

    const contentType = res.headers.get("content-type") || "application/octet-stream";
    const contentDisposition = res.headers.get("content-disposition");
    const cacheControl = res.headers.get("cache-control") || "public, max-age=86400";

    const headers = new Headers();
    headers.set("Content-Type", contentType);
    headers.set("Cache-Control", cacheControl);
    if (contentDisposition) {
      headers.set("Content-Disposition", contentDisposition);
    }

    const data = await res.arrayBuffer();
    return new NextResponse(data, {
      status: 200,
      headers,
    });
  } catch (err: any) {
    return new NextResponse(err?.message || "Internal server error proxying file", { status: 500 });
  }
}
