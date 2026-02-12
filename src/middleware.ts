import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = [
  "/media-kit",
  "/contact",
  "/api/contact",
  "/login",
  "/api/auth",
  "/_next",
  "/images",
  "/favicon.ico",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths
  const isPublic = PUBLIC_PATHS.some((path) => pathname.startsWith(path));
  if (isPublic) {
    return NextResponse.next();
  }

  // Check auth cookie
  const authCookie = request.cookies.get("alsokal-auth");
  const secret = process.env.DASHBOARD_SECRET;

  if (!authCookie || !secret || authCookie.value !== secret) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon)
     * - public folder files
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
