"use client";

import { APIProvider } from "@vis.gl/react-google-maps";
import { useState } from "react";
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
  const [authError, setAuthError] = useState(false);

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

  if (authError) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-950">
        <p className="font-bold mb-1">Google refuse la clé Maps</p>
        <p className="leading-relaxed">
          La clé est présente, mais Google Cloud la bloque pour ce domaine
          ({typeof window !== "undefined" ? window.location.origin : ""}).
          Dans Credentials → restriction HTTP, autorisez{" "}
          <code className="text-xs">https://novaintervention.com/*</code> et{" "}
          <code className="text-xs">https://www.novaintervention.com/*</code>.
          Vérifiez aussi que Maps JavaScript + Places sont activés et que la
          facturation Google Cloud l’est aussi.
        </p>
      </div>
    );
  }

  return (
    <APIProvider
      apiKey={apiKey}
      libraries={[...GOOGLE_MAP_LIBRARIES]}
      onError={() => setAuthError(true)}
    >
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
