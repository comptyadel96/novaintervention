"use client";

import { useEffect, useRef } from "react";
import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import type { LatLng } from "@/lib/maps/config";

type Props = {
  origin: LatLng;
  destination: LatLng;
  enabled?: boolean;
};

/** Itinéraire artisan → client (Directions API). */
export function DirectionsRouteLayer({
  origin,
  destination,
  enabled = true,
}: Props) {
  const map = useMap();
  const routesLib = useMapsLibrary("routes");
  const rendererRef = useRef<google.maps.DirectionsRenderer | null>(null);

  useEffect(() => {
    if (!map || !routesLib || !enabled) return;

    const service = new routesLib.DirectionsService();
    const renderer = new routesLib.DirectionsRenderer({
      map,
      suppressMarkers: true,
      polylineOptions: {
        strokeColor: "#0A2540",
        strokeWeight: 5,
        strokeOpacity: 0.85,
      },
    });
    rendererRef.current = renderer;

    service.route(
      {
        origin,
        destination,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && result) {
          renderer.setDirections(result);
        }
      },
    );

    return () => {
      renderer.setMap(null);
      rendererRef.current = null;
    };
  }, [
    map,
    routesLib,
    enabled,
    origin.lat,
    origin.lng,
    destination.lat,
    destination.lng,
  ]);

  return null;
}
