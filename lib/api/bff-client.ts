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

function filenameFromDisposition(
  header: string | null,
  fallback: string,
): string {
  if (!header) return fallback;
  const utf = /filename\*=UTF-8''([^;]+)/i.exec(header);
  if (utf?.[1]) {
    try {
      return decodeURIComponent(utf[1]);
    } catch {
      return utf[1];
    }
  }
  const quoted = /filename="([^"]+)"/i.exec(header);
  if (quoted?.[1]) return quoted[1];
  const plain = /filename=([^;]+)/i.exec(header);
  if (plain?.[1]) return plain[1].trim();
  return fallback;
}

/** Télécharge un fichier binaire via le BFF (export PDF / JSON). */
export async function bffDownload(
  path: string,
  fallbackFilename: string,
  retried = false,
): Promise<void> {
  const response = await fetch(path, { credentials: "include" });

  if (response.status === 401 && !retried && !shouldSkipRefreshOn401(path)) {
    const refreshed = await tryRefreshSession();
    if (refreshed) {
      return bffDownload(path, fallbackFilename, true);
    }
  }

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new ApiError(
      (payload as { message?: string }).message ??
        "Téléchargement impossible.",
      response.status,
      (payload as { code?: string }).code,
    );
  }

  const blob = await response.blob();
  const filename = filenameFromDisposition(
    response.headers.get("content-disposition"),
    fallbackFilename,
  );
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = objectUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(objectUrl);
}
