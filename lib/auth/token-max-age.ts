/** Parse "15m", "3h", "7d" (même format que JWT_ACCESS_EXPIRES côté backend). */
function parseDuration(value: string): number | null {
  const match = value.trim().match(/^(\d+)\s*([smhd])$/i);
  if (!match) return null;
  const amount = Number.parseInt(match[1], 10);
  const unit = match[2].toLowerCase();
  const multipliers: Record<string, number> = {
    s: 1,
    m: 60,
    h: 60 * 60,
    d: 60 * 60 * 24,
  };
  return amount * (multipliers[unit] ?? 0);
}

/** Durée de vie du cookie access (secondes), alignée sur le backend. */
export function getAccessTokenMaxAgeSeconds(): number {
  const rawSeconds = process.env.JWT_ACCESS_MAX_AGE_SECONDS?.trim();
  if (rawSeconds) {
    const n = Number.parseInt(rawSeconds, 10);
    if (Number.isFinite(n) && n > 0) return n;
  }

  const expires = process.env.JWT_ACCESS_EXPIRES?.trim();
  if (expires) {
    const parsed = parseDuration(expires);
    if (parsed) return parsed;
  }

  return 60 * 15;
}

/** Durée de vie du cookie refresh (secondes). */
export function getRefreshTokenMaxAgeSeconds(): number {
  const rawSeconds = process.env.JWT_REFRESH_MAX_AGE_SECONDS?.trim();
  if (rawSeconds) {
    const n = Number.parseInt(rawSeconds, 10);
    if (Number.isFinite(n) && n > 0) return n;
  }

  const expires = process.env.JWT_REFRESH_EXPIRES?.trim();
  if (expires) {
    const parsed = parseDuration(expires);
    if (parsed) return parsed;
  }

  return 60 * 60 * 24 * 7;
}

/** Intervalle de refresh silencieux (~80 % de la durée access). */
export function getSessionRefreshIntervalMs(): number {
  const accessSec = getAccessTokenMaxAgeSeconds();
  const intervalSec = Math.floor(accessSec * 0.8);
  const clamped = Math.max(5 * 60, Math.min(intervalSec, 2 * 60 * 60));
  return clamped * 1000;
}
