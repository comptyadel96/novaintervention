/** URL de base incluant `/api/v1` (sans slash final). */
export function getApiBaseUrl(): string {
  const raw = (
    process.env.API_URL ??
    process.env.NEXT_PUBLIC_API_URL ??
    "http://localhost:4000/api/v1"
  ).replace(/\/$/, "");

  if (raw.endsWith("/api/v1")) {
    return raw;
  }
  return `${raw}/api/v1`;
}

/** @deprecated Préfixe vide — la base inclut déjà /api/v1 */
export const API_PREFIX = "";

export function getWsUrl(): string {
  return (
    process.env.NEXT_PUBLIC_WS_URL ??
    process.env.WS_URL ??
    "ws://localhost:4000/ws"
  ).replace(/\/$/, "");
}

/**
 * URL API utilisable dans le navigateur (upload direct, hors Vercel).
 * En prod on force le domaine API pour ne jamais dépendre d'une env Vercel incomplète.
 */
export function getBrowserApiBaseUrl(): string {
  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    if (
      host === "novaintervention.com" ||
      host === "www.novaintervention.com"
    ) {
      return "https://api.novaintervention.com/api/v1";
    }
  }

  const raw = (
    process.env.NEXT_PUBLIC_API_URL ??
    "http://localhost:4000/api/v1"
  ).replace(/\/$/, "");
  return raw.endsWith("/api/v1") ? raw : `${raw}/api/v1`;
}

/** URL publique du site (emails, liens de vérification). */
export function getSiteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.NEXT_PUBLIC_APP_URL ??
    "http://localhost:3000"
  ).replace(/\/$/, "");
}
