import { cookies } from "next/headers";
import { apiRequestWithAuth } from "@/lib/auth/refresh";
import { mapSessionFromApi } from "@/lib/api/mappers";
import { ACCESS_TOKEN_COOKIE } from "@/lib/auth/cookies";
import type { Session } from "@/types/domain";

export async function getAccessToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(ACCESS_TOKEN_COOKIE)?.value ?? null;
}

export async function getSession(): Promise<Session | null> {
  const token = await getAccessToken();
  if (!token) return null;

  try {
    const data = await apiRequestWithAuth<Record<string, unknown>>("/auth/me");
    return mapSessionFromApi(data);
  } catch {
    return null;
  }
}

export async function requireSession(): Promise<Session> {
  const session = await getSession();
  if (!session) {
    throw new Error("UNAUTHORIZED");
  }
  return session;
}
