import { cookies } from "next/headers";
import {
  ACCESS_TOKEN_COOKIE,
  AUTH_COOKIE_OPTIONS,
  REFRESH_TOKEN_COOKIE,
} from "@/lib/auth/cookies";
import {
  getAccessTokenMaxAgeSeconds,
  getRefreshTokenMaxAgeSeconds,
} from "@/lib/auth/token-max-age";

export async function setAuthCookies(
  accessToken: string,
  refreshToken?: string,
) {
  const cookieStore = await cookies();
  cookieStore.set(ACCESS_TOKEN_COOKIE, accessToken, {
    ...AUTH_COOKIE_OPTIONS,
    maxAge: getAccessTokenMaxAgeSeconds(),
  });
  if (refreshToken) {
    cookieStore.set(REFRESH_TOKEN_COOKIE, refreshToken, {
      ...AUTH_COOKIE_OPTIONS,
      maxAge: getRefreshTokenMaxAgeSeconds(),
    });
  }
}

export async function clearAuthCookies() {
  const cookieStore = await cookies();
  cookieStore.delete(ACCESS_TOKEN_COOKIE);
  cookieStore.delete(REFRESH_TOKEN_COOKIE);
}
