"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AlertTriangle, ArrowRight, CalendarCheck, Hammer, Siren } from "lucide-react";

import { HealthBadge } from "@/components/passport/HealthBadge";
import { passportApi } from "@/services/api/passport";
import type { Building } from "@/types/passport";
import type { Mission } from "@/types/domain";

/** Trois portes d'entrée du blueprint : urgence, entretien, projet. */
const ACTIONS = [
  {
    href: "/demander?intent=urgence",
    icon: Siren,
    title: "J'ai un problème",
    desc: "Fuite, panne, urgence — intervention rapide.",
    primary: true,
  },
  {
    href: "/demander?intent=entretien",
    icon: CalendarCheck,
    title: "Entretien",
    desc: "Contrôle annuel, révision d'équipement.",
    primary: false,
  },
  {
    href: "/demander?intent=projet",
    icon: Hammer,
    title: "Projet / installation",
    desc: "Remplacement, installation, travaux.",
    primary: false,
  },
] as const;

function formatDate(value?: string | null): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function ClientHomeActions({ missions }: { missions: Mission[] }) {
  const [buildings, setBuildings] = useState<Building[]>([]);

  useEffect(() => {
    passportApi
      .listBuildings()
      .then((data) => setBuildings(data.items))
      .catch(() => setBuildings([]));
  }, []);

  const lastMission = [...missions]
    .filter((mission) => mission.created_at)
    .sort(
      (a, b) =>
        new Date(b.created_at as string).getTime() -
        new Date(a.created_at as string).getTime(),
    )[0];

  const primaryBuilding =
    buildings.find((building) => building.isPrimary) ?? buildings[0] ?? null;

  const watchList = buildings.filter(
    (building) => building.health && building.health !== "up_to_date",
  );

  return (
    <section className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {ACTIONS.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className={`group flex flex-col gap-3 p-6 rounded-[2rem] border transition-all duration-300 hover:-translate-y-1 ${
              action.primary
                ? "bg-primary text-white border-primary shadow-xl shadow-primary/20"
                : "bg-white text-primary-dk border-border shadow-sm hover:shadow-md"
            }`}
          >
            <span
              className={`w-11 h-11 rounded-2xl flex items-center justify-center ${
                action.primary
                  ? "bg-white/15 text-white"
                  : "bg-primary/5 text-primary"
              }`}
            >
              <action.icon size={20} />
            </span>
            <span className="page-h3 mb-0" style={{ color: "inherit" }}>
              {action.title}
            </span>
            <span
              className={`text-sm leading-relaxed ${
                action.primary ? "text-white/80" : "text-text-muted"
              }`}
            >
              {action.desc}
            </span>
            <span className="mt-auto pt-2 inline-flex items-center gap-1 text-xs font-black uppercase tracking-widest">
              Continuer
              <ArrowRight
                size={14}
                className="transition-transform group-hover:translate-x-1"
              />
            </span>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card p-6 bg-white border border-border rounded-[2rem] shadow-sm">
          <p className="text-xs font-black uppercase tracking-widest text-text-muted mb-3">
            Dernière intervention
          </p>
          {lastMission ? (
            <>
              <p className="page-h4 mb-1">{lastMission.title}</p>
              <p className="text-sm text-text-muted">
                {formatDate(lastMission.created_at) ?? "Date inconnue"}
                {lastMission.location ? ` • ${lastMission.location}` : ""}
              </p>
              <Link
                href="/dashboard/requests"
                className="inline-flex items-center gap-1 mt-4 text-xs font-black uppercase tracking-widest text-primary"
              >
                Voir le suivi
                <ArrowRight size={14} />
              </Link>
            </>
          ) : (
            <p className="text-sm text-text-muted italic">
              Aucune intervention pour l&apos;instant.
            </p>
          )}
        </div>

        <div className="card p-6 bg-white border border-border rounded-[2rem] shadow-sm">
          <div className="flex items-center justify-between gap-3 mb-3">
            <p className="text-xs font-black uppercase tracking-widest text-text-muted">
              Passeport Nova
            </p>
            {primaryBuilding?.health && (
              <HealthBadge health={primaryBuilding.health} />
            )}
          </div>

          {primaryBuilding ? (
            <>
              <p className="page-h4 mb-1">{primaryBuilding.label}</p>
              <p className="text-sm text-text-muted line-clamp-1">
                {primaryBuilding.address}
              </p>
              {watchList.length > 0 && (
                <p className="flex items-center gap-2 mt-3 text-sm text-amber-700">
                  <AlertTriangle size={15} className="shrink-0" />
                  {watchList.length} bien
                  {watchList.length > 1 ? "s" : ""} à surveiller
                </p>
              )}
              <Link
                href={`/dashboard/passeport/${primaryBuilding.id}`}
                className="inline-flex items-center gap-1 mt-4 text-xs font-black uppercase tracking-widest text-primary"
              >
                Ouvrir le passeport
                <ArrowRight size={14} />
              </Link>
            </>
          ) : (
            <>
              <p className="text-sm text-text-muted mb-4">
                Créez gratuitement le passeport de votre logement : équipements,
                factures, garanties et historique au même endroit.
              </p>
              <Link
                href="/dashboard/passeport"
                className="btn btn-outline btn-sm"
              >
                Créer mon passeport
              </Link>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
