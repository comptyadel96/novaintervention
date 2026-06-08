"use client";

import { useCallback, useEffect, useState } from "react";
import { clientMissionsApi } from "@/services/api/client";
import type { Mission } from "@/types/domain";
import { ArtisanMissionCard } from "@/components/dashboard/ArtisanMissionCard";

export function ArtisanMissionsList({ artisanId }: { artisanId: string }) {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await clientMissionsApi.list({
        role: "artisan",
        assignedOnly: true,
        limit: 100,
      });
      setMissions(
        [...data].sort(
          (a, b) =>
            new Date(b.created_at || 0).getTime() -
            new Date(a.created_at || 0).getTime(),
        ),
      );
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Impossible de charger les missions.",
      );
    } finally {
      setLoading(false);
    }
  }, [artisanId]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return (
      <div className="rounded-4xl bg-bg-alt p-8 text-center text-text-muted animate-pulse">
        Chargement des missions...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-4xl bg-red-50 border border-red-200 p-6 text-red-700">
        {error} Vérifiez que le backend est démarré.
      </div>
    );
  }

  if (missions.length === 0) {
    return (
      <div className="rounded-4xl bg-bg-alt p-8 text-center text-text-muted">
        Aucune mission pour le moment. Acceptez une demande sur le radar de la
        page d&apos;accueil.
      </div>
    );
  }

  const active = missions.filter((m) =>
    ["confirmed", "in_progress", "waiting_confirmation"].includes(m.status),
  );

  return (
    <div className="space-y-8">
      {active.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-extrabold text-primary-dk">
            Missions actives ({active.length})
          </h2>
          {active.map((m) => (
            <ArtisanMissionCard key={m.id} mission={m} onUpdated={load} />
          ))}
        </div>
      )}

      <div className="space-y-4">
        <h2 className="text-lg font-extrabold text-primary-dk">
          Historique ({missions.length})
        </h2>
        {missions.map((m) => (
          <ArtisanMissionCard key={m.id} mission={m} onUpdated={load} />
        ))}
      </div>
    </div>
  );
}
