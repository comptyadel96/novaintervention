"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  ClipboardList,
  Clock,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import { clientMissionsApi } from "@/services/api/client";
import DownloadInvoiceButton from "@/components/dashboard/DownloadInvoiceButton";
import {
  MISSION_STATUS_LABELS,
  missionStatusClass,
} from "@/lib/missions/labels";
import { MissionPhoto } from "@/components/ui/OptimizedImage";
import { getErrorMessage } from "@/lib/api/errors";
import type { Mission } from "@/types/domain";

export function ClientRequestsList({ customerId }: { customerId: string }) {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await clientMissionsApi.list({ customer_id: customerId });
      setMissions(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [customerId]);

  useEffect(() => {
    load();
  }, [load]);

  const handleConfirm = async (missionId: string) => {
    try {
      await clientMissionsApi.confirmClient(missionId);
      alert(
        "Merci ! Votre validation a été enregistrée. L'artisan doit aussi confirmer pour clôturer la mission.",
      );
      load();
    } catch (err) {
      alert(
        getErrorMessage(
          err,
          "Erreur lors de la validation. L'endpoint confirm-client est peut-être absent côté backend.",
        ),
      );
    }
  };

  if (loading) {
    return (
      <div className="rounded-4xl bg-bg-alt p-12 text-center text-text-muted">
        Chargement...
      </div>
    );
  }

  if (missions.length === 0) {
    return (
      <div className="card p-16 bg-white border border-dashed border-border rounded-[3rem] text-center">
        <div className="w-20 h-20 bg-bg-alt rounded-full flex items-center justify-center mx-auto mb-6 text-text-muted">
          <ClipboardList size={40} />
        </div>
        <h2 className="text-2xl font-bold text-primary-dk mb-2">
          Aucune demande en cours
        </h2>
        <p className="text-text-muted max-w-sm mx-auto mb-8">
          Vous n&apos;avez pas encore formulé de demande d&apos;intervention.
        </p>
        <Link href="/demander" className="btn btn-primary px-8">
          Faire ma première demande
        </Link>
      </div>
    );
  }

  const waiting = missions.filter((m) => m.status === "waiting_confirmation");

  return (
    <div className="space-y-8">
      {waiting.length > 0 && (
        <section className="bg-orange-50 border-2 border-orange-200 rounded-[2.5rem] p-8">
          <div className="flex items-center gap-3 mb-6">
            <ShieldCheck className="text-orange-600" size={28} />
            <div>
              <h2 className="text-xl font-black text-orange-900">
                Validez vos travaux
              </h2>
              <p className="text-sm text-orange-800">
                Comparez les photos avant / après puis confirmez.
              </p>
            </div>
          </div>
          <div className="grid gap-6">
            {waiting.map((m) => (
              <div
                key={m.id}
                className="bg-white rounded-3xl p-6 border border-orange-200"
              >
                <h3 className="font-bold text-primary-dk mb-4">{m.title}</h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <MissionPhoto
                    src={m.photo_before || m.photo_url}
                    alt="Avant"
                    heightClass="h-32"
                    className="rounded-2xl"
                  />
                  <MissionPhoto
                    src={m.photo_after}
                    alt="Après"
                    heightClass="h-32"
                    className="rounded-2xl"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleConfirm(m.id)}
                  className="btn btn-primary w-full"
                >
                  Confirmer & clôturer (client)
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="grid gap-6">
        {missions.map((mission) => (
          <div
            key={mission.id}
            className="card p-6 bg-white border border-border rounded-3xl shadow-sm"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <ClipboardList size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-primary-dk">
                    {mission.title}
                  </h3>
                  <div className="flex flex-wrap gap-3 text-sm text-text-muted mt-1">
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      {mission.created_at &&
                        new Date(mission.created_at).toLocaleDateString(
                          "fr-FR",
                        )}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin size={14} />
                      {mission.location ?? "—"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${missionStatusClass(mission.status)}`}
                >
                  {MISSION_STATUS_LABELS[mission.status]}
                </span>
                <span className="font-black text-primary-dk">
                  {mission.price} €
                </span>
                {mission.status === "completed" && (
                  <DownloadInvoiceButton mission={mission} />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
