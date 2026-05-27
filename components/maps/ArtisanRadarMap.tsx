"use client";

import { useCallback, useMemo, useState } from "react";
import { Map, InfoWindow } from "@vis.gl/react-google-maps";
import { Crosshair, Layers, RefreshCw } from "lucide-react";
import { GoogleMapsProvider } from "@/components/maps/GoogleMapsProvider";
import { MissionClusterLayer } from "@/components/maps/MissionClusterLayer";
import { ArtisanPositionMarker } from "@/components/maps/ArtisanPositionMarker";
import { DirectionsRouteLayer } from "@/components/maps/DirectionsRouteLayer";
import { MapBoundsController } from "@/components/maps/MapBoundsController";
import { MissionMapDetailPanel } from "@/components/maps/MissionMapDetailPanel";
import { clientMissionsApi } from "@/services/api/client";
import { useNovaWebSocket } from "@/hooks/useNovaWebSocket";
import { useArtisanLocation } from "@/hooks/useArtisanLocation";
import type { Mission } from "@/types/domain";
import { DEFAULT_CENTER, getGoogleMapId, type LatLng } from "@/lib/maps/config";
import { haversineKm, missionsWithCoords } from "@/lib/maps/geo";
import { getErrorMessage } from "@/lib/api/errors";
import { ApiError } from "@/lib/api/errors";

type MapMode = "offers" | "active" | "all";

type Props = {
  initialOffers?: Mission[];
  initialActive?: Mission[];
  defaultMode?: MapMode;
  className?: string;
  minHeight?: number;
};

function ArtisanRadarMapInner({
  initialOffers = [],
  initialActive = [],
  defaultMode = "offers",
  className = "",
  minHeight = 480,
}: Props) {
  const [offers, setOffers] = useState<Mission[]>(initialOffers);
  const [active, setActive] = useState<Mission[]>(initialActive);
  const [mode, setMode] = useState<MapMode>(defaultMode);
  const [selected, setSelected] = useState<Mission | null>(null);
  const [acceptingId, setAcceptingId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const { position: artisanPos, error: geoError, loading: geoLoading, refresh: refreshGeo } =
    useArtisanLocation(true);

  const reload = useCallback(async () => {
    try {
      const [pending, mine] = await Promise.all([
        clientMissionsApi.list({ status: "pending", unassigned: true }),
        clientMissionsApi.list({ role: "artisan", limit: 50 }),
      ]);
      setOffers(pending);
      setActive(
        mine.filter((m) =>
          ["confirmed", "in_progress", "waiting_confirmation"].includes(
            m.status,
          ),
        ),
      );
    } catch (err) {
      console.error("Radar reload:", err);
    }
  }, []);

  useNovaWebSocket({
    onMissionOffer: (mission) => {
      setOffers((prev) => {
        if (prev.some((m) => m.id === mission.id)) return prev;
        return [mission, ...prev];
      });
    },
    onMissionAccepted: () => reload(),
    onMissionStatusChanged: () => reload(),
  });

  const displayed = useMemo(() => {
    if (mode === "offers") return offers;
    if (mode === "active") return active;
    return [...offers, ...active];
  }, [mode, offers, active]);

  const displayedWithCoords = useMemo(
    () => missionsWithCoords(displayed),
    [displayed],
  );

  const boundsPoints = useMemo((): LatLng[] => {
    const pts = displayedWithCoords.map((m) => ({ lat: m.lat, lng: m.lng }));
    if (artisanPos) pts.push(artisanPos);
    return pts.length > 0 ? pts : [DEFAULT_CENTER];
  }, [displayedWithCoords, artisanPos]);

  const selectedDistance =
    selected && artisanPos && selected.lat != null && selected.lng != null
      ? haversineKm(artisanPos, { lat: selected.lat, lng: selected.lng })
      : null;

  const showRoute =
    selected &&
    artisanPos &&
    selected.lat != null &&
    selected.lng != null &&
    selected.status !== "pending";

  const handleAccept = async (missionId: string) => {
    setAcceptingId(missionId);
    setToast(null);
    try {
      await clientMissionsApi.accept(missionId);
      setOffers((prev) => prev.filter((m) => m.id !== missionId));
      setSelected(null);
      setToast("Mission acceptée ! Consultez « Mes interventions ».");
      await reload();
    } catch (err) {
      const msg = getErrorMessage(
        err,
        err instanceof ApiError && err.status === 409
          ? "Mission déjà prise par un autre artisan."
          : "Acceptation impossible.",
      );
      setToast(msg);
    } finally {
      setAcceptingId(null);
    }
  };

  const mapId = getGoogleMapId();
  const defaultCenter = artisanPos ?? DEFAULT_CENTER;

  return (
    <div
      className={`relative w-full rounded-[2.5rem] overflow-hidden border-4 border-white shadow-2xl ${className}`}
      style={{ minHeight }}
    >
      <div className="absolute top-4 left-4 right-4 z-10 flex flex-col sm:flex-row gap-2 sm:items-start sm:justify-between pointer-events-none">
        <div className="pointer-events-auto bg-white/95 backdrop-blur-xl px-5 py-3 rounded-2xl border border-white/40 shadow-lg">
          <h3 className="font-black text-primary-dk text-xs uppercase tracking-tighter">
            Radar Nova — Google Maps
          </h3>
          <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest mt-0.5">
            {displayedWithCoords.length} point(s) ·{" "}
            {offers.length} offre(s) · {active.length} active(s)
          </p>
        </div>

        <div className="pointer-events-auto flex flex-wrap gap-2">
          {(
            [
              ["offers", "Offres"],
              ["active", "En cours"],
              ["all", "Tout"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => {
                setMode(key);
                setSelected(null);
              }}
              className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-colors ${
                mode === key
                  ? "bg-primary text-white border-primary"
                  : "bg-white/95 text-primary-dk border-border"
              }`}
            >
              {label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => reload()}
            className="p-2 rounded-full bg-white/95 border border-border shadow-sm"
            title="Actualiser"
          >
            <RefreshCw size={16} className="text-primary-dk" />
          </button>
          <button
            type="button"
            onClick={refreshGeo}
            disabled={geoLoading}
            className="p-2 rounded-full bg-white/95 border border-border shadow-sm disabled:opacity-50"
            title="Recentrer sur ma position"
          >
            <Crosshair size={16} className="text-primary" />
          </button>
        </div>
      </div>

      {toast && (
        <div className="absolute bottom-4 left-4 right-4 z-20 mx-auto max-w-md pointer-events-auto">
          <p className="text-sm font-medium bg-primary-dk text-white px-4 py-3 rounded-xl shadow-lg text-center">
            {toast}
          </p>
        </div>
      )}

      {geoError && (
        <p className="absolute bottom-16 left-4 z-10 text-xs bg-amber-50 border border-amber-200 text-amber-950 px-3 py-2 rounded-lg max-w-xs">
          {geoError} Activez la localisation pour l&apos;itinéraire et le radar.
        </p>
      )}

      <Map
        defaultCenter={defaultCenter}
        defaultZoom={12}
        gestureHandling="greedy"
        disableDefaultUI={false}
        mapId={mapId}
        className="w-full h-full absolute inset-0"
        style={{ minHeight }}
        fullscreenControl
        mapTypeControl
        streetViewControl={false}
      >
        <MapBoundsController points={boundsPoints} />

        {artisanPos && <ArtisanPositionMarker position={artisanPos} />}

        <MissionClusterLayer
          missions={displayed}
          selectedId={selected?.id}
          onSelect={setSelected}
        />

        {showRoute && artisanPos && selected.lat != null && selected.lng != null && (
          <DirectionsRouteLayer
            origin={artisanPos}
            destination={{ lat: selected.lat, lng: selected.lng }}
          />
        )}

        {selected && selected.lat != null && selected.lng != null && (
          <InfoWindow
            position={{ lat: selected.lat, lng: selected.lng }}
            onCloseClick={() => setSelected(null)}
            maxWidth={340}
          >
            <MissionMapDetailPanel
              mission={selected}
              distanceKm={selectedDistance}
              accepting={acceptingId === selected.id}
              onAccept={handleAccept}
              onClose={() => setSelected(null)}
            />
          </InfoWindow>
        )}
      </Map>

      {displayedWithCoords.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[5]">
          <div className="bg-white/90 backdrop-blur px-6 py-4 rounded-2xl border border-border shadow-lg text-center max-w-sm mx-4">
            <Layers className="mx-auto mb-2 text-text-muted" size={28} />
            <p className="font-bold text-primary-dk text-sm">
              Aucune mission sur la carte
            </p>
            <p className="text-xs text-text-muted mt-1">
              Les nouvelles offres apparaîtront ici en temps réel (WebSocket) si
              le client a fourni une position GPS.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ArtisanRadarMap(props: Props) {
  return (
    <GoogleMapsProvider>
      <ArtisanRadarMapInner {...props} />
    </GoogleMapsProvider>
  );
}
