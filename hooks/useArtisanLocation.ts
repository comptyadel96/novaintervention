"use client";

import { useCallback, useEffect, useState } from "react";
import type { LatLng } from "@/lib/maps/config";
import { clientProfilesApi } from "@/services/api/client";

const SYNC_INTERVAL_MS = 5 * 60 * 1000;

export function useArtisanLocation(syncToProfile = true) {
  const [position, setPosition] = useState<LatLng | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const syncProfile = useCallback(async (pos: LatLng) => {
    if (!syncToProfile) return;
    try {
      await clientProfilesApi.updateMe({
        latitude: pos.lat,
        longitude: pos.lng,
      });
    } catch {
      // non bloquant
    }
  }, [syncToProfile]);

  const refresh = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Géolocalisation non supportée.");
      setLoading(false);
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const next = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        setPosition(next);
        setError(null);
        setLoading(false);
        void syncProfile(next);
      },
      () => {
        setError("Impossible d'obtenir votre position.");
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 },
    );
  }, [syncProfile]);

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, SYNC_INTERVAL_MS);
    return () => clearInterval(id);
  }, [refresh]);

  return { position, error, loading, refresh };
}
