"use client";

import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { clientMissionsApi } from "@/services/api/client";
import type { Mission } from "@/types/domain";

const ArtisanRadarMap = dynamic(
  () => import("@/components/maps/ArtisanRadarMap"),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-[360px] rounded-3xl bg-bg-alt animate-pulse" />
    ),
  },
);

export function ArtisanMissionsMapSection() {
  const [activeMissions, setActiveMissions] = useState<Mission[]>([]);

  const load = useCallback(async () => {
    try {
      const data = await clientMissionsApi.list({
        role: "artisan",
        assignedOnly: true,
        limit: 50,
      });
      setActiveMissions(
        data.filter((m) =>
          ["confirmed", "in_progress", "waiting_confirmation"].includes(
            m.status,
          ),
        ),
      );
    } catch {
      setActiveMissions([]);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <section className="card p-2 bg-white border border-border rounded-4xl shadow-sm overflow-hidden mb-8">
      <div className="px-6 pt-6 pb-2">
        <h2 className="text-lg font-extrabold text-primary-dk">
          Carte des interventions
        </h2>
        <p className="text-sm text-text-muted mt-1">
          Itinéraire et position client pour vos missions assignées en cours.
        </p>
      </div>
      <ArtisanRadarMap
        initialOffers={[]}
        initialActive={activeMissions}
        defaultMode="active"
        minHeight={380}
      />
    </section>
  );
}
