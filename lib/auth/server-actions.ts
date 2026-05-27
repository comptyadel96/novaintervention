import { cookies } from "next/headers";
import {
  ACCESS_TOKEN_COOKIE,
  AUTH_COOKIE_OPTIONS,
  REFRESH_TOKEN_COOKIE,
} from "@/lib/auth/cookies";

const ACCESS_MAX_AGE = 60 * 15; // aligné backend (15 min)
const REFRESH_MAX_AGE = 60 * 60 * 24 * 7; // 7 j

export async function setAuthCookies(
  accessToken: string,
  refreshToken?: string,
) {
  const cookieStore = await cookies();
  cookieStore.set(ACCESS_TOKEN_COOKIE, accessToken, {
    ...AUTH_COOKIE_OPTIONS,
    maxAge: ACCESS_MAX_AGE,
  });
  if (refreshToken) {
    cookieStore.set(REFRESH_TOKEN_COOKIE, refreshToken, {
      ...AUTH_COOKIE_OPTIONS,
      maxAge: REFRESH_MAX_AGE,
    });
  }
}

export async function clearAuthCookies() {
  const cookieStore = await cookies();
  cookieStore.delete(ACCESS_TOKEN_COOKIE);
  cookieStore.delete(REFRESH_TOKEN_COOKIE);
}
