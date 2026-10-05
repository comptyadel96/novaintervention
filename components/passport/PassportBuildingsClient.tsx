"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Building2, Plus } from "lucide-react";

import { BuildingForm } from "@/components/passport/BuildingForm";
import { HealthBadge } from "@/components/passport/HealthBadge";
import { PassportBackendNotice } from "@/components/passport/PassportBackendNotice";
import { getErrorMessage } from "@/lib/api/errors";
import { BUILDING_KIND_LABELS } from "@/lib/passport/labels";
import { passportApi } from "@/services/api/passport";
import type { Building, BuildingInput } from "@/types/passport";

export function PassportBuildingsClient() {
  const router = useRouter();
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [backendReady, setBackendReady] = useState(true);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    passportApi
      .listBuildings()
      .then((data) => {
        setBuildings(data.items);
        setBackendReady(data.backendReady);
      })
      .catch((err) =>
        setError(getErrorMessage(err, "Impossible de charger vos passeports.")),
      )
      .finally(() => setLoading(false));
  }, []);

  const handleCreate = async (data: BuildingInput) => {
    const created = await passportApi.createBuilding(data);
    setBuildings((current) => [...current, created]);
    setCreating(false);
    router.push(`/dashboard/passeport/${created.id}`);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <p className="text-primary font-bold uppercase tracking-widest text-xs mb-2">
            Espace Client • Mémoire du bâtiment
          </p>
          <h1 className="page-title mb-2">Passeport Nova</h1>
          <p className="text-text-muted max-w-2xl">
            Vos biens, leurs équipements, leurs documents et tout ce qui a été
            fait dessus. Gratuit, et rempli automatiquement à chaque
            intervention Nova.
          </p>
        </div>

        {backendReady && !creating && (
          <button
            type="button"
            onClick={() => setCreating(true)}
            className="btn btn-primary flex items-center gap-2 shrink-0"
          >
            <Plus size={18} />
            Ajouter un bien
          </button>
        )}
      </header>

      {error && <p className="form-banner-error">{error}</p>}
      {!loading && !backendReady && <PassportBackendNotice />}

      {creating && (
        <section className="card p-8 bg-white border border-border rounded-[2rem] shadow-sm">
          <h2 className="page-h2 mb-6">Nouveau passeport</h2>
          <BuildingForm
            onSubmit={handleCreate}
            onCancel={() => setCreating(false)}
          />
        </section>
      )}

      {loading ? (
        <p className="text-sm text-text-muted">Chargement…</p>
      ) : buildings.length === 0 && backendReady && !creating ? (
        <section className="card p-10 bg-white border border-border rounded-[2.5rem] shadow-sm text-center">
          <div className="w-14 h-14 rounded-2xl bg-primary/5 text-primary flex items-center justify-center mx-auto mb-5">
            <Building2 size={26} />
          </div>
          <h2 className="page-h2 mb-2">Créez le passeport de votre logement</h2>
          <p className="text-text-muted max-w-lg mx-auto mb-6">
            Deux minutes suffisent : l&apos;adresse, le type de bien, et vos
            équipements principaux. Ensuite, chaque intervention vient l&apos;
            enrichir toute seule.
          </p>
          <button
            type="button"
            onClick={() => setCreating(true)}
            className="btn btn-primary"
          >
            Créer mon passeport
          </button>
        </section>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {buildings.map((building) => (
            <li key={building.id}>
              <Link
                href={`/dashboard/passeport/${building.id}`}
                className="block card p-7 bg-white border border-border rounded-[2rem] shadow-sm h-full"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1">
                      {BUILDING_KIND_LABELS[building.kind]}
                      {building.role === "viewer" ? " • Lecture seule" : ""}
                    </p>
                    <h2 className="page-h3 mb-1 truncate">{building.label}</h2>
                    <p className="text-sm text-text-muted line-clamp-2">
                      {building.address}
                    </p>
                  </div>
                  <HealthBadge health={building.health ?? "up_to_date"} />
                </div>

                <div className="flex flex-wrap gap-4 text-xs font-bold uppercase tracking-wider text-text-muted">
                  <span>{building.equipmentsCount ?? 0} équipements</span>
                  <span>{building.documentsCount ?? 0} documents</span>
                  <span>{building.eventsCount ?? 0} interventions</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
