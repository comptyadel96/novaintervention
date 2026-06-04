import { cookies } from "next/headers";
import { apiRequest } from "@/lib/api/client";
import { ApiError } from "@/lib/api/errors";
import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  AUTH_COOKIE_OPTIONS,
} from "@/lib/auth/cookies";
import {
  getAccessTokenMaxAgeSeconds,
  getRefreshTokenMaxAgeSeconds,
} from "@/lib/auth/token-max-age";

type RefreshResponse = {
  accessToken: string;
  refreshToken?: string;
};

export async function refreshAccessToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE)?.value;
  if (!refreshToken) return null;

  try {
    const data = await apiRequest<RefreshResponse>("/auth/refresh", {
      method: "POST",
      body: { refreshToken },
    });

    cookieStore.set(ACCESS_TOKEN_COOKIE, data.accessToken, {
      ...AUTH_COOKIE_OPTIONS,
      maxAge: getAccessTokenMaxAgeSeconds(),
    });

    if (data.refreshToken) {
      cookieStore.set(REFRESH_TOKEN_COOKIE, data.refreshToken, {
        ...AUTH_COOKIE_OPTIONS,
        maxAge: getRefreshTokenMaxAgeSeconds(),
      });
    }

    return data.accessToken;
  } catch {
    cookieStore.delete(ACCESS_TOKEN_COOKIE);
    cookieStore.delete(REFRESH_TOKEN_COOKIE);
    return null;
  }
}

export async function apiRequestWithAuth<T>(
  path: string,
  options: Parameters<typeof apiRequest>[1] = {},
): Promise<T> {
  const cookieStore = await cookies();
  let token = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value ?? null;

  try {
    return await apiRequest<T>(path, { ...options, token });
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      token = await refreshAccessToken();
      if (!token) throw error;
      return await apiRequest<T>(path, { ...options, token });
    }
    throw error;
  }
}
