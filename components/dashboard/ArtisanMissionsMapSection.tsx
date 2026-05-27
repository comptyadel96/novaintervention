"use client";

import dynamic from "next/dynamic";
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

export function ArtisanMissionsMapSection({
  activeMissions,
}: {
  activeMissions: Mission[];
}) {
  return (
    <section className="card p-2 bg-white border border-border rounded-4xl shadow-sm overflow-hidden mb-8">
      <div className="px-6 pt-6 pb-2">
        <h2 className="text-lg font-extrabold text-primary-dk">
          Carte des interventions
        </h2>
        <p className="text-sm text-text-muted mt-1">
          Itinéraire et position client pour vos missions en cours.
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
