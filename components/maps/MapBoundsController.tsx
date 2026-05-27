"use client";

import { useEffect } from "react";
import { useMap } from "@vis.gl/react-google-maps";
import type { LatLng } from "@/lib/maps/config";
import { boundsFromPoints } from "@/lib/maps/geo";

type Props = {
  points: LatLng[];
  padding?: number;
  maxZoom?: number;
};

export function MapBoundsController({
  points,
  padding = 64,
  maxZoom = 14,
}: Props) {
  const map = useMap();

  useEffect(() => {
    if (!map || points.length === 0) return;

    if (points.length === 1) {
      map.setCenter(points[0]);
      map.setZoom(14);
      return;
    }

    const bounds = boundsFromPoints(points);
    if (!bounds) return;
    map.fitBounds(bounds, padding);
    const listener = google.maps.event.addListenerOnce(map, "idle", () => {
      const z = map.getZoom();
      if (z != null && z > maxZoom) map.setZoom(maxZoom);
    });
    return () => google.maps.event.removeListener(listener);
  }, [map, points, padding, maxZoom]);

  return null;
}
