"use client";

import {
  BarChart3,
  CheckCircle2,
  MapPin,
  PieChart,
  ShieldCheck,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import type { ArtisanStats, AuthUser, Profile } from "@/types/domain";
import { displayFirstName } from "@/lib/auth/display";
import dynamic from "next/dynamic";
import { ArtisanActiveMissions } from "@/components/dashboard/ArtisanActiveMissions";
import { ArtisanAccountingCharts } from "@/components/dashboard/ArtisanAccountingCharts";

const ArtisanRadarMap = dynamic(
  () => import("@/components/maps/ArtisanRadarMap"),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-[480px] rounded-[2.5rem] bg-bg-alt animate-pulse" />
    ),
  },
);

export function ArtisanView({
  user,
  profile,
  stats,
}: {
  user: AuthUser;
  profile?: Profile | null;
  stats?: ArtisanStats | null;
}) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col gap-6 lg:flex-row lg:justify-between lg:items-end">
        <div>
          <p className="text-primary font-bold uppercase tracking-widest text-xs mb-2">
            Tableau de bord Artisan
          </p>
            <h1
              className="page-title mb-0"
            >
              Bonjour, {displayFirstName(user, profile)}
            </h1>
          <p className="mt-3 text-sm text-text-muted max-w-2xl">
            Votre tableau de bord vous permet de suivre vos interventions, vos
            clients et vos revenus en un coup d'œil.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-1">
          <div className="rounded-3xl bg-white border border-border p-4 shadow-sm flex flex-col gap-3">
            <div className="flex items-center gap-3 text-green-600">
              <Wallet size={20} />
              <span className="text-xs uppercase tracking-[0.25em] font-bold text-text-muted">
                Portefeuille
              </span>
            </div>
            <p className="text-3xl font-extrabold text-primary-dk">
              {stats?.weeklyMissionsCount ?? 0}
            </p>
            <p className="text-sm text-text-muted">
              Interventions cette semaine
            </p>
          </div>
          <div className="rounded-3xl bg-white border border-border p-4 shadow-sm flex flex-col gap-3">
            <div className="flex items-center gap-3 text-primary">
              <Users size={20} />
              <span className="text-xs uppercase tracking-[0.25em] font-bold text-text-muted">
                Clients
              </span>
            </div>
            <p className="text-3xl font-extrabold text-primary-dk">
              {stats?.activeClients ?? 0}
            </p>
            <p className="text-sm text-text-muted">Clients distincts</p>
          </div>
          <div className="rounded-3xl bg-white border border-border p-4 shadow-sm flex flex-col gap-3">
            <div className="flex items-center gap-3 text-orange-500">
              <PieChart size={20} />
              <span className="text-xs uppercase tracking-[0.25em] font-bold text-text-muted">
                Net artisan
              </span>
            </div>
            <p className="text-3xl font-extrabold text-primary-dk">
              {(stats?.totalRevenue ?? 0).toLocaleString("fr-FR")} €
            </p>
            <p className="text-sm text-text-muted">Après commission 20 %</p>
          </div>
        </div>
      </header>

      <section className="card p-2 sm:p-4 bg-white border border-border rounded-[2.5rem] shadow-sm overflow-hidden">
        <ArtisanRadarMap
          initialOffers={stats?.availableMissions ?? []}
          initialActive={stats?.confirmedMissions ?? []}
          minHeight={520}
        />
      </section>

      {stats && (
        <ArtisanActiveMissions
          missions={Array.from(
            new Map(
              [
                ...(stats.confirmedMissions ?? []),
                ...(stats.recentMissions ?? []),
              ].map((m) => [m.id, m]),
            ).values(),
          )}
        />
      )}

      <div className="grid grid-cols-1 xl:grid-cols-[1.3fr_0.9fr] gap-8">
        <section className="card p-8 bg-white border border-border rounded-[2.5rem] shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-extrabold text-primary-dk">
                Portefeuille et performance
              </h2>
              <p className="text-sm text-text-muted mt-2">
                Visualisez votre activité et vos revenus sur les derniers
                cycles.
              </p>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full bg-bg-alt px-4 py-2 text-sm font-bold text-primary-dk">
              <BarChart3 size={16} /> Suivi multi-périodes
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="rounded-4xl bg-bg-alt p-5 border border-border">
              <p className="text-xs uppercase tracking-[0.25em] font-bold text-text-muted mb-3">
                Revenus ce mois
              </p>
              <p className="text-3xl font-black text-primary-dk">
                {(stats?.monthlyRevenue ?? 0).toLocaleString("fr-FR")} €
              </p>
              <p className="text-sm text-text-muted mt-2">
                Missions terminées ce mois-ci.
              </p>
            </div>
            <div className="rounded-4xl bg-bg-alt p-5 border border-border">
              <p className="text-xs uppercase tracking-[0.25em] font-bold text-text-muted mb-3">
                Clients cette semaine
              </p>
              <p className="text-3xl font-black text-primary-dk">
                {stats?.confirmedMissions?.length ?? 0}
              </p>
              <p className="text-sm text-text-muted mt-2">
                Missions en cours ou à confirmer.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="rounded-4xl bg-white border border-border p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-bold text-primary-dk">
                  Offres disponibles
                </p>
                <span className="text-xs uppercase tracking-[0.25em] text-text-muted">
                  Radar
                </span>
              </div>
              <p className="text-3xl font-black text-primary-dk">
                {stats?.availableMissions?.length ?? 0}
              </p>
              <p className="text-sm text-text-muted mt-2">
                Missions en attente dans votre zone.
              </p>
            </div>
          </div>
        </section>

        <aside className="space-y-6">
          <section className="card p-8 bg-white border border-border rounded-[2.5rem] shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-extrabold text-primary-dk">
                Comptabilité rapide
              </h2>
              <span className="text-xs uppercase tracking-[0.25em] text-text-muted">
                Bilan
              </span>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {[
                { label: "Total facturé", value: `${(stats?.totalRevenue ?? 0).toLocaleString("fr-FR")} €`, icon: Wallet },
                {
                  label: "Ce mois",
                  value: `${(stats?.monthlyRevenue ?? 0).toLocaleString("fr-FR")} €`,
                  icon: CheckCircle2,
                },
                {
                  label: "Missions actives",
                  value: String(stats?.confirmedMissions?.length ?? 0),
                  icon: ShieldCheck,
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-3xl bg-bg-alt p-4 border border-border flex items-center gap-4"
                >
                  <div className="w-12 h-12 rounded-3xl bg-white border border-border flex items-center justify-center text-primary">
                    <item.icon size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-primary-dk">
                      {item.label}
                    </p>
                    <p className="text-xl font-black text-primary-dk">
                      {item.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-6 text-sm text-text-muted">
              Suivi rapide des factures et des encaissements. Idéal pour garder
              une vue globale sans gestion comptable poussée.
            </p>
          </section>

          <section className="card p-8 bg-white border border-border rounded-[2.5rem] shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-extrabold text-primary-dk">
                Clients récents
              </h2>
              <span className="text-xs uppercase tracking-[0.25em] text-text-muted">
                7 jours
              </span>
            </div>
            <div className="space-y-4">
              {(stats?.recentMissions ?? []).slice(0, 3).map((m) => (
                <div
                  key={m.id}
                  className="rounded-3xl bg-bg-alt p-4 border border-border"
                >
                  <p className="font-bold text-primary-dk">
                    {m.customer_name ?? "Client"}
                  </p>
                  <p className="text-sm text-text-muted">{m.title}</p>
                  <p className="text-sm font-bold text-primary-dk mt-2">
                    {m.price != null ? `${m.price} €` : "—"}
                  </p>
                </div>
              ))}
              {(stats?.recentMissions?.length ?? 0) === 0 && (
                <p className="text-sm text-text-muted">Aucune mission récente.</p>
              )}
            </div>
          </section>
        </aside>
      </div>

      <ArtisanAccountingCharts pendingRevenue={stats?.pendingRevenue} />
    </div>
  );
}
