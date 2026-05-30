"use client";

import { useEffect, useMemo, useState } from "react";
import { fetchArtisanEarningsEstimate } from "@/services/api/earnings-estimate";
import type { ArtisanEarningsEstimate } from "@/types/domain";

const WEEKS_PER_MONTH = 4.33;

type Props = {
  /** Ville saisie dans le formulaire candidature — recharge les stats si renseignée */
  cityHint?: string;
};

export function PartnerEarningsSimulator({ cityHint }: Props) {
  const [estimate, setEstimate] = useState<ArtisanEarningsEstimate | null>(
    null,
  );
  const [fallback, setFallback] = useState(false);
  const [loading, setLoading] = useState(true);
  const [missionsPerWeek, setMissionsPerWeek] = useState(10);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    fetchArtisanEarningsEstimate({
      city: cityHint?.trim() || undefined,
      trade: "plomberie",
    }).then(({ estimate: e, fallback: fb }) => {
      if (cancelled) return;
      setEstimate(e);
      setFallback(fb);
      setMissionsPerWeek(e.avgMissionsPerWeek);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [cityHint]);

  const commissionRate = estimate?.commissionRate ?? 0.2;
  const averageBasket = estimate?.averageBasket ?? 220;
  const minM = estimate?.minMissionsPerWeek ?? 1;
  const maxM = estimate?.maxMissionsPerWeek ?? 40;

  const { monthlyGross, monthlyNet, monthlyCommission } = useMemo(() => {
    const gross = missionsPerWeek * averageBasket * WEEKS_PER_MONTH;
    const commission = gross * commissionRate;
    return {
      monthlyGross: Math.round(gross),
      monthlyNet: Math.round(gross - commission),
      monthlyCommission: Math.round(commission),
    };
  }, [missionsPerWeek, averageBasket, commissionRate]);

  const commissionPct = Math.round(commissionRate * 100);

  return (
    <section className="mb-24">
      <div className="bg-primary-dk rounded-[2.5rem] p-8 md:p-14 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary opacity-20 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-lt opacity-10 blur-[80px] rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2
              className="text-3xl md:text-4xl font-extrabold mb-6"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Simulez vos revenus mensuels
            </h2>
            <p className="text-white/70 text-lg mb-6 leading-relaxed">
              Estimation basée sur les{" "}
              <span className="text-white font-bold">missions plomberie</span>{" "}
              terminées sur Nova
              {estimate?.city ? ` (${estimate.city})` : ""}.
            </p>

            {loading ? (
              <p className="text-white/50 text-sm animate-pulse">
                Chargement des données plateforme…
              </p>
            ) : (
              <div className="mb-8 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm">
                {fallback || estimate?.dataSource === "default" ? (
                  <p className="text-amber-200">
                    Données par défaut — le backend n&apos;a pas encore assez de
                    missions ou l&apos;endpoint public n&apos;est pas actif.
                  </p>
                ) : (
                  <p className="text-white/80">
                    <strong className="text-white">
                      {estimate?.sampleSize ?? 0} missions
                    </strong>{" "}
                    analysées · panier moyen artisan{" "}
                    <strong className="text-white">
                      {averageBasket.toLocaleString("fr-FR")} €
                    </strong>
                    {estimate?.medianBasket != null && (
                      <>
                        {" "}
                        (médiane {estimate.medianBasket.toLocaleString("fr-FR")}{" "}
                        €)
                      </>
                    )}
                    {estimate?.periodLabel && (
                      <> · {estimate.periodLabel}</>
                    )}
                  </p>
                )}
              </div>
            )}

            <div className="space-y-10">
              <div>
                <label className="block text-sm font-bold uppercase tracking-wider text-white/50 mb-4">
                  Métier
                </label>
                <div className="inline-flex items-center gap-2 px-4 py-3 rounded-xl border bg-white text-primary-dk border-white font-bold text-sm">
                  <span>🚰</span> Plomberie
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-4">
                  <label className="block text-sm font-bold uppercase tracking-wider text-white/50">
                    Missions par semaine
                  </label>
                  <span className="text-3xl font-black text-white">
                    {missionsPerWeek}
                  </span>
                </div>
                <input
                  type="range"
                  min={minM}
                  max={maxM}
                  value={missionsPerWeek}
                  onChange={(e) =>
                    setMissionsPerWeek(parseInt(e.target.value, 10))
                  }
                  disabled={loading}
                  className="w-full h-3 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white disabled:opacity-50"
                />
                <div className="flex justify-between text-xs text-white/40 mt-2 font-bold px-1">
                  <span>{minM}</span>
                  <span>{Math.round((minM + maxM) / 2)}</span>
                  <span>{maxM}</span>
                </div>
                {estimate?.avgWeeklyMissionsPlatform != null && (
                  <p className="text-xs text-white/50 mt-2">
                    Moyenne plateforme :{" "}
                    {estimate.avgWeeklyMissionsPlatform.toFixed(1)} missions /
                    semaine
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-[2rem] p-10 flex flex-col items-center justify-center text-center backdrop-blur-sm shadow-[0_20px_50px_rgba(0,0,0,0.2)]">
            <p className="text-white/60 font-bold uppercase tracking-widest text-sm mb-4">
              Estimation de vos revenus nets
            </p>
            <div className="flex items-baseline gap-2 mb-2">
              <span
                className="text-6xl md:text-7xl font-black text-white"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {loading ? "—" : monthlyNet.toLocaleString("fr-FR")}
              </span>
              <span className="text-3xl font-bold text-white/80">€</span>
            </div>
            <p className="text-white/40 font-medium">
              Par mois (net après commission {commissionPct} %)
            </p>

            <div className="w-full h-px bg-white/10 my-8" />

            <div className="grid grid-cols-2 w-full gap-4 text-left">
              <div>
                <p className="text-white/50 text-xs font-bold uppercase mb-1">
                  CA brut estimé
                </p>
                <p className="text-white text-lg font-bold">
                  {loading ? "—" : `${monthlyGross.toLocaleString("fr-FR")} €`}
                </p>
              </div>
              <div className="text-right">
                <p className="text-white/50 text-xs font-bold uppercase mb-1">
                  Commission Nova
                </p>
                <p className="text-white text-lg font-bold">
                  {loading
                    ? "—"
                    : `${monthlyCommission.toLocaleString("fr-FR")} €`}
                </p>
              </div>
            </div>

            <p className="text-white/40 text-xs mt-6 w-full">
              Formule : {missionsPerWeek} missions × {averageBasket} € ×{" "}
              {WEEKS_PER_MONTH} sem. − {commissionPct} %
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
