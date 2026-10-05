"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";

import { PassportActions } from "@/components/passport/PassportActions";
import { PassportBackendNotice } from "@/components/passport/PassportBackendNotice";
import { PassportDocuments } from "@/components/passport/PassportDocuments";
import { PassportEquipments } from "@/components/passport/PassportEquipments";
import { PassportHistory } from "@/components/passport/PassportHistory";
import { PassportIdentityCard } from "@/components/passport/PassportIdentityCard";
import { PassportRecommendations } from "@/components/passport/PassportRecommendations";
import { getErrorMessage } from "@/lib/api/errors";
import {
  computeBuildingHealth,
  computeCompleteness,
} from "@/lib/passport/health";
import { passportApi } from "@/services/api/passport";
import type {
  Building,
  PassportDocument,
  PassportEquipment,
  PassportEvent,
  PassportRecommendation,
} from "@/types/passport";

export function PassportDetailClient({ buildingId }: { buildingId: string }) {
  const [building, setBuilding] = useState<Building | null>(null);
  const [equipments, setEquipments] = useState<PassportEquipment[]>([]);
  const [documents, setDocuments] = useState<PassportDocument[]>([]);
  const [events, setEvents] = useState<PassportEvent[]>([]);
  const [recommendations, setRecommendations] = useState<
    PassportRecommendation[]
  >([]);
  const [backendReady, setBackendReady] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(
    async (silent = false) => {
      if (!silent) setLoading(true);
      try {
        const data = await passportApi.getBuilding(buildingId);
        setBackendReady(data.backendReady);
        setBuilding(data.building ?? null);
        setEquipments(data.equipments ?? []);
        setDocuments(data.documents ?? []);
        setEvents(data.events ?? []);
        setRecommendations(data.recommendations ?? []);
        setError(null);
      } catch (err) {
        setError(getErrorMessage(err, "Passeport introuvable."));
      } finally {
        if (!silent) setLoading(false);
      }
    },
    [buildingId],
  );

  useEffect(() => {
    void load();
  }, [load]);

  const refreshInsights = useCallback(() => {
    void load(true);
  }, [load]);

  if (loading) {
    return <p className="text-sm text-text-muted">Chargement du passeport…</p>;
  }

  if (!backendReady) {
    return (
      <div className="space-y-6">
        <Link
          href="/dashboard/passeport"
          className="inline-flex items-center gap-2 text-sm font-bold text-primary"
        >
          <ArrowLeft size={16} />
          Retour aux passeports
        </Link>
        <PassportBackendNotice />
      </div>
    );
  }

  if (!building) {
    return (
      <div className="space-y-6">
        <Link
          href="/dashboard/passeport"
          className="inline-flex items-center gap-2 text-sm font-bold text-primary"
        >
          <ArrowLeft size={16} />
          Retour aux passeports
        </Link>
        <p className="form-banner-error">
          {error ?? "Passeport introuvable."}
        </p>
      </div>
    );
  }

  const readOnly = building.role === "viewer";
  const health = building.health ?? computeBuildingHealth(equipments);
  const completeness = computeCompleteness(
    building,
    equipments,
    documents,
    events,
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Link
        href="/dashboard/passeport"
        className="inline-flex items-center gap-2 text-sm font-bold text-primary"
      >
        <ArrowLeft size={16} />
        Retour aux passeports
      </Link>

      {error && <p className="form-banner-error">{error}</p>}

      <PassportIdentityCard
        building={building}
        health={health}
        completeness={completeness}
        readOnly={readOnly}
      />

      <PassportRecommendations recommendations={recommendations} />

      <PassportEquipments
        buildingId={building.id}
        equipments={equipments}
        readOnly={readOnly}
        onChange={setEquipments}
        onMutated={refreshInsights}
      />

      <PassportDocuments
        buildingId={building.id}
        documents={documents}
        readOnly={readOnly}
        onChange={setDocuments}
        onMutated={refreshInsights}
      />

      <PassportHistory
        buildingId={building.id}
        events={events}
        readOnly={readOnly}
        onChange={setEvents}
        onMutated={refreshInsights}
      />

      <PassportActions
        buildingId={building.id}
        readOnly={readOnly}
        onTransferred={refreshInsights}
      />
    </div>
  );
}
