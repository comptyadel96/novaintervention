"use client";

import { useEffect, useRef } from "react";
import { useMap } from "@vis.gl/react-google-maps";
import type { LatLng } from "@/lib/maps/config";

export function ArtisanPositionMarker({ position }: { position: LatLng }) {
  const map = useMap();
  const markerRef = useRef<google.maps.Marker | null>(null);

  useEffect(() => {
    if (!map || typeof google === "undefined") return;

    markerRef.current = new google.maps.Marker({
      map,
      position,
      title: "Votre position",
      zIndex: 2000,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 11,
        fillColor: "#2563EB",
        fillOpacity: 1,
        strokeColor: "#ffffff",
        strokeWeight: 3,
      },
    });

    return () => {
      markerRef.current?.setMap(null);
      markerRef.current = null;
    };
  }, [map, position.lat, position.lng]);

  return null;
}
