"use client";

import { useEffect, useRef } from "react";
import { useMap } from "@vis.gl/react-google-maps";
import { MarkerClusterer, SuperClusterAlgorithm } from "@googlemaps/markerclusterer";
import type { Mission } from "@/types/domain";
import { missionsWithCoords } from "@/lib/maps/geo";

type Props = {
  missions: Mission[];
  selectedId?: string | null;
  onSelect: (mission: Mission) => void;
};

/** Marqueurs clients regroupés (cluster) pour éviter 100 icônes sur une même zone. */
export function MissionClusterLayer({
  missions,
  selectedId,
  onSelect,
}: Props) {
  const map = useMap();
  const clustererRef = useRef<MarkerClusterer | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;

  useEffect(() => {
    if (!map || typeof google === "undefined") return;

    clustererRef.current?.clearMarkers();
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];

    const withCoords = missionsWithCoords(missions);

    const markers = withCoords.map((mission) => {
      const isSelected = mission.id === selectedId;
      const marker = new google.maps.Marker({
        position: { lat: mission.lat, lng: mission.lng },
        map: null,
        title: mission.title,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: isSelected ? 14 : 10,
          fillColor: isSelected ? "#0A2540" : "#F97316",
          fillOpacity: 1,
          strokeColor: "#ffffff",
          strokeWeight: 2,
        },
        zIndex: isSelected ? 1000 : mission.status === "pending" ? 500 : 300,
      });

      marker.addListener("click", () => onSelectRef.current(mission));
      return marker;
    });

    markersRef.current = markers;

    clustererRef.current = new MarkerClusterer({
      map,
      markers,
      algorithm: new SuperClusterAlgorithm({ radius: 80, maxZoom: 16 }),
      onClusterClick: (_event, cluster) => {
        if (cluster.bounds) map.fitBounds(cluster.bounds);
      },
    });

    return () => {
      clustererRef.current?.clearMarkers();
      clustererRef.current = null;
      markersRef.current.forEach((m) => m.setMap(null));
      markersRef.current = [];
    };
  }, [map, missions, selectedId]);

  return null;
}
