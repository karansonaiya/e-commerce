import NextAuth from "next-auth";
import { NextResponse, type NextRequest } from "next/server";
import { authConfig } from "@/lib/auth.config";
import { isAdminEmail } from "@/lib/admin";

const { auth } = NextAuth(authConfig);

// req.nextUrl.origin can end up reflecting AUTH_URL/NEXTAUTH_URL rather than
// the actual incoming request when wrapped by NextAuth's auth() helper —
// read the real Host header directly instead, so redirects always point at
// whatever host/port the request actually came in on (any local port, or a
// Vercel preview deployment's own URL).
function getOrigin(req: NextRequest) {
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  const proto = req.headers.get("x-forwarded-proto") ?? "http";
  return host ? `${proto}://${host}` : req.nextUrl.origin;
}

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;
  const email = req.auth?.user?.email;
  const origin = getOrigin(req);

  if (pathname.startsWith("/admin")) {
    if (!isLoggedIn || !isAdminEmail(email)) {
      return NextResponse.redirect(new URL("/", origin));
    }
  }

  if (pathname.startsWith("/account")) {
    if (!isLoggedIn) {
      const url = new URL("/login", origin);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/account/:path*"],
};
