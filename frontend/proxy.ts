import { NextResponse, type NextRequest } from "next/server";

const HOME_BY_ROLE: Record<string, string> = {
  mahasiswa: "/mahasiswa",
  hrd: "/hrd",
  prodi: "/prodi",
  admin: "/admin",
};

/**
 * Penjaga dashboard: tanpa sesi diarahkan ke /login, peran lain diarahkan ke dashboard miliknya,
 * dan yang sudah login tidak perlu lihat /login atau /register lagi.
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  let role: string | null = null;
  try {
    const rawCookie = request.cookies.get("pintukarier_session")?.value ?? "null";
    role = JSON.parse(rawCookie)?.role ?? null;
  } catch {
    role = null;
  }
  const home = role ? HOME_BY_ROLE[role] : undefined;

  if (pathname === "/login" || pathname === "/register") {
    return home ? NextResponse.redirect(new URL(home, request.url)) : NextResponse.next();
  }
  if (!home) {
    const url = new URL("/login", request.url);
    url.searchParams.set("next", pathname + search);
    return NextResponse.redirect(url);
  }
  if (pathname !== home && !pathname.startsWith(`${home}/`)) {
    return NextResponse.redirect(new URL(home, request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/mahasiswa/:path*", "/hrd/:path*", "/prodi/:path*", "/admin/:path*", "/login", "/register"],
};
