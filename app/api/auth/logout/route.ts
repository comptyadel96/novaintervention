import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { apiRequest } from "@/lib/api/client";
import { getAccessToken } from "@/lib/auth/session";
import { clearAuthCookies } from "@/lib/auth/server-actions";
import { REFRESH_TOKEN_COOKIE } from "@/lib/auth/cookies";

export async function POST() {
  const token = await getAccessToken();
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE)?.value;

  if (token) {
    try {
      await apiRequest<void>("/auth/logout", {
        method: "POST",
        token,
        body: refreshToken ? { refreshToken } : undefined,
      });
    } catch {
      // cookies cleared anyway
    }
  }

  await clearAuthCookies();

  return NextResponse.json({ ok: true });
}
