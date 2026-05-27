"use client";

import { APIProvider } from "@vis.gl/react-google-maps";
import {
  getGoogleMapsApiKey,
  GOOGLE_MAP_LIBRARIES,
  isGoogleMapsConfigured,
} from "@/lib/maps/config";

export function GoogleMapsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const apiKey = getGoogleMapsApiKey();

  if (!apiKey) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-950">
        <p className="font-bold mb-1">Google Maps non configuré</p>
        <p>
          Ajoutez <code className="text-xs">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code>{" "}
          dans <code className="text-xs">.env.local</code> (Maps JavaScript, Places,
          Geocoding, Directions activés dans la console Google Cloud).
        </p>
      </div>
    );
  }

  return (
    <APIProvider apiKey={apiKey} libraries={[...GOOGLE_MAP_LIBRARIES]}>
      {children}
    </APIProvider>
  );
}

export function GoogleMapsConfiguredGuard({
  children,
  fallback,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  if (!isGoogleMapsConfigured()) {
    return (
      fallback ?? (
        <p className="text-sm text-text-muted p-4">
          Carte indisponible — clé API manquante.
        </p>
      )
    );
  }
  return <>{children}</>;
}
