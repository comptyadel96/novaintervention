"use client";

import { useMapsLibrary } from "@vis.gl/react-google-maps";
import { useCallback } from "react";
import type { LatLng } from "@/lib/maps/config";
import { parsePlaceCity } from "@/lib/maps/geo";

export type ReverseGeocodeResult = {
  formattedAddress: string;
  city?: string;
};

export function useReverseGeocode() {
  const geocoding = useMapsLibrary("geocoding");

  const reverseGeocode = useCallback(
    async (coords: LatLng): Promise<ReverseGeocodeResult | null> => {
      if (!geocoding) return null;

      return new Promise((resolve) => {
        const geocoder = new geocoding.Geocoder();
        geocoder.geocode(
          { location: coords },
          (results, status) => {
            if (
              status !== google.maps.GeocoderStatus.OK ||
              !results?.[0]
            ) {
              resolve(null);
              return;
            }
            const formatted = results[0].formatted_address;
            if (!formatted) {
              resolve(null);
              return;
            }
            resolve({
              formattedAddress: formatted,
              city: parsePlaceCity(results[0].address_components),
            });
          },
        );
      });
    },
    [geocoding],
  );

  return { reverseGeocode, ready: Boolean(geocoding) };
}
