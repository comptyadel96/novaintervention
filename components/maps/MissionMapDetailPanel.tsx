"use client";

import {
  MapPin,
  Navigation,
  Phone,
  Clock,
  Image as ImageIcon,
} from "lucide-react";
import type { Mission } from "@/types/domain";
import { MISSION_STATUS_LABELS } from "@/lib/missions/labels";
import {
  canAcceptOnMap,
  missionPhotoUrl,
  missionPriceLabel,
  missionUrgencyLabel,
} from "@/lib/maps/mission-display";
import { formatDistanceKm } from "@/lib/maps/geo";

type Props = {
  mission: Mission;
  distanceKm?: number | null;
  accepting?: boolean;
  onAccept?: (id: string) => void;
  onClose?: () => void;
};

export function MissionMapDetailPanel({
  mission,
  distanceKm,
  accepting,
  onAccept,
  onClose,
}: Props) {
  const photo = missionPhotoUrl(mission);
  const urgency = missionUrgencyLabel(mission);
  const mapsUrl =
    mission.lat != null && mission.lng != null
      ? `https://www.google.com/maps/dir/?api=1&destination=${mission.lat},${mission.lng}`
      : null;

  return (
    <div className="min-w-[260px] max-w-[320px] p-1 text-primary-dk">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex flex-wrap gap-1">
          <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-[9px] font-black uppercase tracking-widest">
            {MISSION_STATUS_LABELS[mission.status]}
          </span>
          {urgency && (
            <span
              className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                urgency === "Urgent"
                  ? "bg-red-50 text-red-600"
                  : "bg-bg-alt text-text-muted"
              }`}
            >
              {urgency}
            </span>
          )}
        </div>
        <span className="font-black text-primary-dk text-sm shrink-0">
          {missionPriceLabel(mission)}
        </span>
      </div>

      <h3 className="font-extrabold text-sm mb-1 leading-tight">{mission.title}</h3>

      {mission.description && (
        <p className="text-xs text-text-muted line-clamp-3 mb-2">
          {mission.description}
        </p>
      )}

      <div className="space-y-1.5 text-xs text-text-muted mb-3">
        {mission.location && (
          <p className="flex items-start gap-1.5">
            <MapPin size={12} className="text-orange-500 shrink-0 mt-0.5" />
            <span>{mission.location}</span>
          </p>
        )}
        {distanceKm != null && (
          <p className="flex items-center gap-1.5 font-semibold text-primary">
            <Navigation size={12} />
            {formatDistanceKm(distanceKm)} de votre position
          </p>
        )}
        {mission.customer_name && (
          <p className="font-medium text-primary-dk">{mission.customer_name}</p>
        )}
        {mission.customer_phone && canAcceptOnMap(mission) === false && (
          <a
            href={`tel:${mission.customer_phone}`}
            className="flex items-center gap-1 text-primary font-bold"
          >
            <Phone size={12} />
            {mission.customer_phone}
          </a>
        )}
        {mission.created_at && (
          <p className="flex items-center gap-1">
            <Clock size={12} />
            {new Date(mission.created_at).toLocaleString("fr-FR", {
              dateStyle: "short",
              timeStyle: "short",
            })}
          </p>
        )}
      </div>

      {photo && (
        <a
          href={photo}
          target="_blank"
          rel="noopener noreferrer"
          className="block mb-3 rounded-xl overflow-hidden border border-border"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photo}
            alt="Photo intervention"
            className="w-full h-24 object-cover"
          />
          <span className="flex items-center gap-1 text-[10px] font-bold text-primary px-2 py-1 bg-bg-alt">
            <ImageIcon size={10} />
            Voir la photo
          </span>
        </a>
      )}

      <div className="flex flex-col gap-2">
        {canAcceptOnMap(mission) && onAccept && (
          <button
            type="button"
            disabled={accepting}
            onClick={() => onAccept(mission.id)}
            className="w-full py-2.5 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-dk disabled:opacity-50"
          >
            {accepting ? "Acceptation…" : "Accepter l'intervention"}
          </button>
        )}
        {mapsUrl && (
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2 border border-border rounded-xl text-[10px] font-black uppercase tracking-widest text-center text-primary-dk hover:bg-bg-alt"
          >
            Ouvrir dans Google Maps
          </a>
        )}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="text-[10px] font-bold text-text-muted uppercase tracking-widest"
          >
            Fermer
          </button>
        )}
      </div>
    </div>
  );
}
