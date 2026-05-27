"use client";

import Link from "next/link";
import { ArtisanMissionCard } from "@/components/dashboard/ArtisanMissionCard";
import type { Mission } from "@/types/domain";

export function ArtisanActiveMissions({ missions }: { missions: Mission[] }) {
  const active = missions.filter((m) =>
    ["confirmed", "in_progress", "waiting_confirmation"].includes(m.status),
  );

  if (active.length === 0) return null;

  return (
    <section className="card p-8 bg-white border border-border rounded-[2.5rem] shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-extrabold text-primary-dk">
          Missions en cours ({active.length})
        </h2>
        <Link
          href="/dashboard/missions"
          className="text-xs font-bold text-primary uppercase tracking-widest hover:underline"
        >
          Voir tout
        </Link>
      </div>
      <div className="space-y-4">
        {active.slice(0, 2).map((m) => (
          <ArtisanMissionCard key={m.id} mission={m} />
        ))}
      </div>
    </section>
  );
}
