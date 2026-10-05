export type LatLng = { lat: number; lng: number };

export const DEFAULT_CENTER: LatLng = { lat: 48.8566, lng: 2.3522 };

export const GOOGLE_MAP_LIBRARIES = [
  "places",
  "geocoding",
  "routes",
  "marker",
] as const;

export function getGoogleMapsApiKey(): string | undefined {
  const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.trim();
  return key || undefined;
}

/** Map ID Cloud Console (recommandé pour Advanced Markers). Optionnel. */
export function getGoogleMapId(): string | undefined {
  const id = process.env.NEXT_PUBLIC_GOOGLE_MAP_ID?.trim();
  return id || undefined;
}

export function isGoogleMapsConfigured(): boolean {
  return Boolean(getGoogleMapsApiKey());
}
