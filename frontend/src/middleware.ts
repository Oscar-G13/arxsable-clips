import { NextResponse, type NextRequest } from "next/server";

import { auth } from "@/lib/auth";

function isAuthApi(pathname: string) {
  return pathname === "/api/auth" || pathname.startsWith("/api/auth/");
}

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (pathname.startsWith("/_next/")) {
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
