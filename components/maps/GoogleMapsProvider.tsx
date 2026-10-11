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

  const warning =
    !apiKey ? (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 mb-4 text-sm text-amber-950">
        <p className="font-bold mb-1">Suggestions d&apos;adresse indisponibles</p>
        <p>Saisissez l&apos;adresse à la main ou utilisez le GPS.</p>
      </div>
    ) : authError ? (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 mb-4 text-sm text-amber-950">
        <p className="font-bold mb-1">Suggestions Google indisponibles</p>
        <p>Saisissez l&apos;adresse à la main ou utilisez le GPS.</p>
      </div>
    ) : null;

  if (!apiKey) {
    return (
      <>
        {warning}
        {children}
      </>
    );
  }

  return (
    <APIProvider
      apiKey={apiKey}
      libraries={[...GOOGLE_MAP_LIBRARIES]}
      onError={() => setAuthError(true)}
    >
      {warning}
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
