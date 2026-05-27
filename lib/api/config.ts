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

/** URL publique du site (emails, liens de vérification). */
export function getSiteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.NEXT_PUBLIC_APP_URL ??
    "http://localhost:3000"
  ).replace(/\/$/, "");
}
