"use client";

import { useMapsLibrary } from "@vis.gl/react-google-maps";
import { useCallback } from "react";
import type { LatLng } from "@/lib/maps/config";
import { parsePlaceCity } from "@/lib/maps/geo";

export function useGeocodeAddress() {
  const geocoding = useMapsLibrary("geocoding");

  const geocode = useCallback(
    async (
      address: string,
    ): Promise<{ coords: LatLng; city?: string } | null> => {
      if (!geocoding || !address.trim()) return null;

      return new Promise((resolve) => {
        const geocoder = new geocoding.Geocoder();
        geocoder.geocode(
          { address: address.trim(), region: "fr" },
          (results, status) => {
            if (
              status !== google.maps.GeocoderStatus.OK ||
              !results?.[0]?.geometry?.location
            ) {
              resolve(null);
              return;
            }
            const loc = results[0].geometry.location;
            resolve({
              coords: { lat: loc.lat(), lng: loc.lng() },
              city: parsePlaceCity(results[0].address_components),
            });
          },
        );
      });
    },
    [geocoding],
  );

  return { geocode, ready: Boolean(geocoding) };
}
