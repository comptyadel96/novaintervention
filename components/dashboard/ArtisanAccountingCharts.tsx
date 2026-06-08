"use client";

import { useCallback, useEffect, useState } from "react";
import type { AccountingPeriod, ArtisanAccounting } from "@/types/domain";
import { bffFetch } from "@/lib/api/bff-client";

const PERIODS: { value: AccountingPeriod; label: string }[] = [
  { value: "day", label: "Jour" },
  { value: "week", label: "Semaine" },
  { value: "month", label: "Mois" },
  { value: "year", label: "Année" },
];

function defaultRange(period: AccountingPeriod): { from: string; to: string } {
  const to = new Date();
  const from = new Date();
  if (period === "day") from.setDate(to.getDate() - 30);
  else if (period === "week") from.setDate(to.getDate() - 7 * 12);
  else if (period === "month") from.setMonth(to.getMonth() - 6);
  else from.setFullYear(to.getFullYear() - 1);
  return {
    from: from.toISOString().slice(0, 10),
    to: to.toISOString().slice(0, 10),
  };
}

function formatBucket(bucket: string, period: AccountingPeriod): string {
  const d = new Date(bucket);
  if (Number.isNaN(d.getTime())) return bucket;
  if (period === "day")
    return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
  if (period === "week")
    return `S. ${d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}`;
  if (period === "month")
    return d.toLocaleDateString("fr-FR", { month: "short", year: "2-digit" });
  return d.getFullYear().toString();
}

export function ArtisanAccountingCharts({
  pendingRevenue,
}: {
  pendingRevenue?: number;
} = {}) {
  const [period, setPeriod] = useState<AccountingPeriod>("month");
  const [data, setData] = useState<ArtisanAccounting | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { from, to } = defaultRange(period);
    const q = new URLSearchParams({ period, from, to });
    try {
      const json = await bffFetch<ArtisanAccounting>(
        `/api/artisans/me/accounting?${q}`,
      );
      setData({
        period: json.period ?? period,
        totalRevenue: json.totalRevenue,
        items: json.items ?? [],
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur de chargement.");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    load();
  }, [load]);

  const items = data?.items ?? [];
  const maxRevenue = Math.max(...items.map((i) => i.revenue), 1);

  return (
    <section className="card p-8 bg-white border border-border rounded-4xl shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h2 className="text-xl font-extrabold text-primary-dk">
            Chiffre d&apos;affaires
          </h2>
          <p className="text-sm text-text-muted mt-1">
            Missions terminées — net artisan (revenue) · barres = net, GMV en info-bulle
          </p>
        </div>
        <div className="flex gap-2 p-1 bg-bg-alt/50 rounded-xl">
          {PERIODS.map((p) => (
            <button
              key={p.value}
              type="button"
              onClick={() => setPeriod(p.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                period === p.value
                  ? "bg-white text-primary-dk shadow-sm"
                  : "text-text-muted"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {data?.totalRevenue != null && (
        <p className="text-3xl font-black text-primary-dk mb-6">
          {data.totalRevenue.toLocaleString("fr-FR")} €
          <span className="text-sm font-normal text-text-muted ml-2">
            sur la période
          </span>
        </p>
      )}

      {loading && (
        <div className="h-40 rounded-3xl bg-bg-alt animate-pulse" />
      )}
      {error && !loading && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
          {error}
        </p>
      )}
      {!loading && !error && items.length === 0 && (
        <div className="text-sm text-text-muted text-center py-8 space-y-2">
          <p>Aucune mission terminée sur cette période.</p>
          {pendingRevenue != null && pendingRevenue > 0 && (
            <p className="text-primary-dk font-semibold">
              Net estimé en cours : {pendingRevenue.toLocaleString("fr-FR")} €
            </p>
          )}
        </div>
      )}
      {!loading && !error && items.length > 0 && pendingRevenue != null && pendingRevenue > 0 && (
        <p className="text-xs text-text-muted mb-4">
          Net estimé sur missions actives :{" "}
          <span className="font-bold text-primary-dk">
            {pendingRevenue.toLocaleString("fr-FR")} €
          </span>{" "}
          (non inclus dans le graphique — missions non terminées)
        </p>
      )}
      {!loading && !error && items.length > 0 && (
        <div className="flex items-end gap-1.5 h-44 overflow-x-auto pb-2">
          {items.map((item) => (
            <div
              key={item.bucket}
              className="flex flex-col items-center gap-2 min-w-[2.5rem] flex-1"
              title={`Net ${item.revenue} € · GMV ${item.gmv ?? "—"} € · ${item.missions} mission(s)`}
            >
              <div
                className="w-full max-w-12 rounded-t-2xl bg-primary transition-all"
                style={{
                  height: `${Math.max(8, (item.revenue / maxRevenue) * 100)}%`,
                  minHeight: "8px",
                }}
              />
              <span className="text-[10px] text-text-muted text-center leading-tight">
                {formatBucket(item.bucket, period)}
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
