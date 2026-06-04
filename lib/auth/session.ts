import { cookies } from "next/headers";
import { apiRequestWithAuth, refreshAccessToken } from "@/lib/auth/refresh";
import { mapSessionFromApi } from "@/lib/api/mappers";
import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
} from "@/lib/auth/cookies";
import type { Session } from "@/types/domain";

export async function getAccessToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const access = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;
  if (access) return access;

  const refresh = cookieStore.get(REFRESH_TOKEN_COOKIE)?.value;
  if (!refresh) return null;

  return refreshAccessToken();
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
