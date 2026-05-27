export type LatLng = { lat: number; lng: number };

export const DEFAULT_CENTER: LatLng = { lat: 48.8566, lng: 2.3522 };

export const GOOGLE_MAP_LIBRARIES = [
  "places",
  "geocoding",
  "routes",
  "marker",
] as const;

export function getGoogleMapsApiKey(): string | undefined {
  return process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
}

/** Map ID Cloud Console (recommandé pour Advanced Markers). Optionnel. */
export function getGoogleMapId(): string | undefined {
  return process.env.NEXT_PUBLIC_GOOGLE_MAP_ID;
}

export function isGoogleMapsConfigured(): boolean {
  return Boolean(getGoogleMapsApiKey());
}
