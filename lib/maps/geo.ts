import type { LatLng } from "./config";
import type { Mission } from "@/types/domain";

const EARTH_RADIUS_KM = 6371;

export function haversineKm(a: LatLng, b: LatLng): number {
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(x));
}

export function formatDistanceKm(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(1)} km`;
}

export function missionsWithCoords(missions: Mission[]): (Mission & {
  lat: number;
  lng: number;
})[] {
  return missions.filter(
    (m): m is Mission & { lat: number; lng: number } =>
      m.lat != null && m.lng != null && Number.isFinite(m.lat) && Number.isFinite(m.lng),
  );
}

export function boundsFromPoints(points: LatLng[]): google.maps.LatLngBounds | null {
  if (points.length === 0 || typeof google === "undefined") return null;
  const bounds = new google.maps.LatLngBounds();
  points.forEach((p) => bounds.extend(p));
  return bounds;
}

export function parsePlaceCity(
  components?: google.maps.GeocoderAddressComponent[],
): string | undefined {
  if (!components) return undefined;
  const city =
    components.find((c) => c.types.includes("locality")) ??
    components.find((c) => c.types.includes("postal_town"));
  return city?.long_name;
}
