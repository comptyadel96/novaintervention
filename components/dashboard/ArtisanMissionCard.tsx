"use client";

import { useState } from "react";
import {
  MapPin,
  Phone,
  Navigation,
  Play,
  Camera,
  CheckCircle2,
  Truck,
} from "lucide-react";
import type { Mission } from "@/types/domain";
import { MissionPhoto, OptimizedImage } from "@/components/ui/OptimizedImage";
import {
  clientMissionsApi,
  clientUploadsApi,
} from "@/services/api/client";
import {
  MISSION_STATUS_LABELS,
  missionStatusClass,
} from "@/lib/missions/labels";
import DownloadInvoiceButton from "@/components/dashboard/DownloadInvoiceButton";
import { MissionCommissionBreakdown } from "@/components/missions/MissionCommissionBreakdown";

type Props = {
  mission: Mission;
  onUpdated?: () => void;
};

export function ArtisanMissionCard({ mission, onUpdated }: Props) {
  const [loading, setLoading] = useState<string | null>(null);
  const [priceFinal, setPriceFinal] = useState(
    String(mission.price ?? ""),
  );
  const [afterFile, setAfterFile] = useState<File | null>(null);
  const [afterPreview, setAfterPreview] = useState<string | null>(null);
  const [enRouteSent, setEnRouteSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = () => {
    onUpdated?.();
    if (typeof window !== "undefined") window.location.reload();
  };

  const run = async (key: string, fn: () => Promise<void>) => {
    setError(null);
    setLoading(key);
    try {
      await fn();
      refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur");
    } finally {
      setLoading(null);
    }
  };

  const mapsUrl =
    mission.lat != null && mission.lng != null
      ? `https://www.google.com/maps/search/?api=1&query=${mission.lat},${mission.lng}`
      : null;

  return (
    <div className="rounded-4xl bg-white border border-border p-6 shadow-sm hover:border-primary/20 transition-colors space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span
              className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider ${missionStatusClass(mission.status)}`}
            >
              {MISSION_STATUS_LABELS[mission.status]}
            </span>
            {mission.created_at && (
              <span className="text-xs text-text-muted">
                {new Date(mission.created_at).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            )}
          </div>
          <h2 className="text-xl font-bold text-primary-dk">{mission.title}</h2>
          <p className="text-sm text-text-muted mt-1">{mission.description}</p>
          <div className="flex flex-wrap gap-4 mt-3 text-sm font-medium text-text-muted">
            {mission.customer_name && (
              <span>{mission.customer_name}</span>
            )}
            {mission.customer_phone && (
              <a
                href={`tel:${mission.customer_phone}`}
                className="flex items-center gap-1 text-primary hover:underline"
              >
                <Phone size={14} />
                {mission.customer_phone}
              </a>
            )}
            {mission.location && (
              <span className="flex items-center gap-1">
                <MapPin size={14} className="text-primary" />
                {mission.location}
              </span>
            )}
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-black text-primary-dk">
            {mission.price_final ?? mission.price ?? "—"} €
          </p>
          <MissionCommissionBreakdown mission={mission} variant="compact" />
        </div>
      </div>

      <MissionCommissionBreakdown mission={mission} />

      {(mission.photo_url || mission.photo_before) && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-[10px] font-black uppercase text-text-muted mb-2 tracking-widest">
              Avant
            </p>
            <MissionPhoto
              src={mission.photo_before || mission.photo_url}
              alt="Avant"
              heightClass="h-28"
              className="rounded-2xl border border-border"
            />
          </div>
          {mission.photo_after && (
            <div>
              <p className="text-[10px] font-black uppercase text-text-muted mb-2 tracking-widest">
                Après
              </p>
              <MissionPhoto
                src={mission.photo_after}
                alt="Après"
                heightClass="h-28"
                className="rounded-2xl border border-green-200"
              />
            </div>
          )}
        </div>
      )}

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-2">
          {error}
        </p>
      )}

      <div className="flex flex-wrap gap-3">
        {mapsUrl && mission.status !== "pending" && (
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline btn-sm flex items-center gap-2"
          >
            <Navigation size={16} />
            Itinéraire
          </a>
        )}

        {mission.status === "confirmed" && (
          <>
            {!enRouteSent && (
              <button
                type="button"
                disabled={!!loading}
                onClick={() =>
                  run("enroute", async () => {
                    await clientMissionsApi.enRoute(mission.id);
                    setEnRouteSent(true);
                  })
                }
                className="btn btn-outline btn-sm flex items-center gap-2"
              >
                <Truck size={16} />
                {loading === "enroute" ? "Envoi..." : "Je suis en route"}
              </button>
            )}
            <button
              type="button"
              disabled={!!loading}
              onClick={() =>
                run("start", async () => {
                  await clientMissionsApi.start(mission.id);
                })
              }
              className="btn btn-primary btn-sm flex items-center gap-2"
            >
              <Play size={16} />
              {loading === "start"
                ? "Démarrage..."
                : "Arrivé — démarrer l'intervention"}
            </button>
          </>
        )}

        {mission.status === "in_progress" && (
          <div className="w-full space-y-3 border-t border-border pt-4">
            <p className="text-sm font-bold text-primary-dk flex items-center gap-2">
              <Camera size={18} />
              Clôturer — photo après travaux
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  setAfterFile(f ?? null);
                  if (f) {
                    const reader = new FileReader();
                    reader.onloadend = () =>
                      setAfterPreview(reader.result as string);
                    reader.readAsDataURL(f);
                  }
                }}
                className="text-sm"
              />
              <input
                type="number"
                min={0}
                value={priceFinal}
                onChange={(e) => setPriceFinal(e.target.value)}
                placeholder="Prix final €"
                className="form-input w-full sm:w-32"
              />
            </div>
            {afterPreview && (
              <OptimizedImage
                src={afterPreview}
                alt="Aperçu après"
                width={160}
                height={96}
                className="h-24 w-auto rounded-xl object-cover"
              />
            )}
            <button
              type="button"
              disabled={!!loading || !afterFile}
              onClick={() =>
                run("complete", async () => {
                  if (!afterFile) return;
                  const { url } =
                    await clientUploadsApi.uploadInterventionPhoto(afterFile);
                  await clientMissionsApi.completeWork(mission.id, {
                    photoAfterUrl: url,
                    priceFinal: Number(priceFinal) || undefined,
                  });
                })
              }
              className="btn btn-primary w-full sm:w-auto flex items-center justify-center gap-2"
            >
              <CheckCircle2 size={18} />
              {loading === "complete"
                ? "Envoi..."
                : "Terminer et envoyer au client"}
            </button>
          </div>
        )}

        {mission.status === "waiting_confirmation" && (
          <div className="w-full rounded-2xl bg-orange-50 border border-orange-200 p-4 space-y-3">
            <p className="text-sm text-orange-900 font-medium">
              En attente de validation du client. Vous pourrez confirmer de
              votre côté une fois le client d&apos;accord.
            </p>
            <button
              type="button"
              disabled={!!loading}
              onClick={() =>
                run("confirm", async () => {
                  await clientMissionsApi.confirmArtisan(mission.id);
                })
              }
              className="btn btn-primary w-full sm:w-auto"
            >
              {loading === "confirm"
                ? "Confirmation..."
                : "Confirmer ma part (artisan)"}
            </button>
          </div>
        )}

        {mission.status === "completed" && (
          <DownloadInvoiceButton
            mission={mission}
            className="btn btn-outline btn-sm"
          />
        )}
      </div>
    </div>
  );
}
