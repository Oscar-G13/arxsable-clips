import { NextResponse, type NextRequest } from "next/server";

import { auth } from "@/lib/auth";

const PUBLIC_APP_ASSETS = new Set([
  "/app-store-badge.svg",
  "/arx-clips-logo.png",
  "/blog/supoclip-editor.webp",
  "/blog/supoclip-open-source-clipping.webp",
  "/logo.png",
  "/clips/source.jpg",
  "/clips/podcast-1.jpg",
  "/clips/podcast-2.jpg",
]);

function isAuthApi(pathname: string) {
  return pathname === "/api/auth" || pathname.startsWith("/api/auth/");
}

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (pathname.startsWith("/_next/") || PUBLIC_APP_ASSETS.has(pathname)) {
    return NextResponse.next();
  }

  if (pathname === "/sign-up" || pathname.startsWith("/sign-up/")) {
    return new NextResponse(null, { status: 404 });
  }

  if (
    pathname === "/sign-in" ||
    pathname.startsWith("/sign-in/") ||
    isAuthApi(pathname)
  ) {
    return NextResponse.next();
  }

  const session = await auth.api.getSession({ headers: request.headers });

  if (session?.user) {
    if (pathname === "/") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  if (pathname === "/api" || pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const signInUrl = new URL("/sign-in", request.url);
  if (pathname !== "/") {
    signInUrl.searchParams.set("next", pathname + search);
  }
  return NextResponse.redirect(signInUrl);
}

export const config = {
  matcher: "/:path*",
  runtime: "nodejs",
};
