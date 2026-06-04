import { type NextRequest, NextResponse } from "next/server";
import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
} from "@/lib/auth/cookies";

export function middleware(request: NextRequest) {
  const hasAccess = Boolean(request.cookies.get(ACCESS_TOKEN_COOKIE)?.value);
  const hasRefresh = Boolean(request.cookies.get(REFRESH_TOKEN_COOKIE)?.value);
  const hasSession = hasAccess || hasRefresh;
  const isDashboard = request.nextUrl.pathname.startsWith("/dashboard");

  if (isDashboard && !hasSession) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
