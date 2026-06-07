import { ApiError } from "@/lib/api/errors";
import { notifySessionRefresh } from "@/lib/auth/session-events";

/** Routes publiques : un 401 ne doit pas déclencher de refresh (ex. mauvais mot de passe). */
const BFF_NO_REFRESH_PREFIXES = [
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/forgot-password",
  "/api/auth/reset-password",
  "/api/auth/verify-email",
  "/api/auth/sms/send-code",
  "/api/auth/sms/verify",
  "/api/auth/google",
  "/api/partner-applications",
  "/api/ai/analyze-photo",
  "/api/ai/analyze-text",
  "/api/ai/status",
  "/api/uploads/interventions",
];

function shouldSkipRefreshOn401(path: string): boolean {
  return BFF_NO_REFRESH_PREFIXES.some(
    (prefix) => path === prefix || path.startsWith(`${prefix}/`),
  );
}

/** Renouvelle la session via le BFF (cookies httpOnly). */
export async function tryRefreshSession(): Promise<boolean> {
  try {
    const res = await fetch("/api/auth/refresh", {
      method: "POST",
      credentials: "include",
    });
    if (res.ok) {
      notifySessionRefresh();
      return true;
    }
  } catch {
    // ignore
  }
  return false;
}

/** fetch vers les routes `/api/*` avec retry automatique après refresh. */
export async function bffFetch<T>(
  path: string,
  options: RequestInit = {},
  retried = false,
): Promise<T> {
  const response = await fetch(path, {
    ...options,
    credentials: "include",
    headers: {
      ...(options.body instanceof FormData
        ? {}
        : { "Content-Type": "application/json" }),
      ...options.headers,
    },
  });

  if (
    response.status === 401 &&
    !retried &&
    !shouldSkipRefreshOn401(path)
  ) {
    const refreshed = await tryRefreshSession();
    if (refreshed) {
      return bffFetch<T>(path, options, true);
    }
  }

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new ApiError(
      (payload as { message?: string }).message ??
        "Une erreur est survenue.",
      response.status,
      (payload as { code?: string }).code,
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}
