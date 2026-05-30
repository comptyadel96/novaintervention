import type { ArtisanEarningsEstimate } from "@/types/domain";

type Raw = Record<string, unknown>;

function num(v: unknown, fallback: number): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

const DEFAULT: ArtisanEarningsEstimate = {
  trade: "plomberie",
  averageBasket: 220,
  commissionRate: 0.2,
  avgMissionsPerWeek: 10,
  minMissionsPerWeek: 1,
  maxMissionsPerWeek: 40,
  sampleSize: 0,
  dataSource: "default",
  periodLabel: "estimation plateforme",
};

/** Normalise GET /public/artisan-earnings-estimate */
export function mapArtisanEarningsEstimate(data: unknown): ArtisanEarningsEstimate {
  const root = (data ?? {}) as Raw;
  const e = (root.estimate as Raw | undefined) ?? root;

  const commissionRate = num(
    e.commissionRate ?? e.commission_rate ?? e.platformCommissionRate,
    DEFAULT.commissionRate,
  );

  const out: ArtisanEarningsEstimate = {
    trade: String(e.trade ?? e.specialty ?? DEFAULT.trade),
    averageBasket: num(
      e.averageBasket ??
        e.average_basket ??
        e.avgArtisanPayout ??
        e.avg_artisan_payout ??
        e.averagePayout,
      DEFAULT.averageBasket,
    ),
    commissionRate: commissionRate > 1 ? commissionRate / 100 : commissionRate,
    avgMissionsPerWeek: num(
      e.avgMissionsPerWeek ??
        e.avg_missions_per_week ??
        e.averageMissionsPerWeek,
      DEFAULT.avgMissionsPerWeek,
    ),
    minMissionsPerWeek: num(
      e.minMissionsPerWeek ?? e.min_missions_per_week,
      DEFAULT.minMissionsPerWeek,
    ),
    maxMissionsPerWeek: num(
      e.maxMissionsPerWeek ?? e.max_missions_per_week,
      DEFAULT.maxMissionsPerWeek,
    ),
    sampleSize: num(e.sampleSize ?? e.sample_size ?? e.completedMissions, 0),
    city: typeof e.city === "string" ? e.city : undefined,
    dataSource:
      e.dataSource === "live" || e.data_source === "live" ? "live" : "default",
    periodLabel: String(
      e.periodLabel ?? e.period_label ?? DEFAULT.periodLabel,
    ),
  };

  const medianRaw = num(
    e.medianBasket ?? e.median_basket ?? e.medianPayout,
    NaN,
  );
  if (Number.isFinite(medianRaw)) {
    out.medianBasket = medianRaw;
  }

  const avgWeekly = num(
    e.avgWeeklyMissionsPlatform ?? e.avg_weekly_missions_platform,
    NaN,
  );
  if (Number.isFinite(avgWeekly)) {
    out.avgWeeklyMissionsPlatform = avgWeekly;
  }

  return out;
}

export function getDefaultEarningsEstimate(): ArtisanEarningsEstimate {
  return { ...DEFAULT };
}
