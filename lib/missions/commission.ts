/** Aligné backend PLATFORM_COMMISSION_RATE=0.2 */
export const PLATFORM_COMMISSION_RATE = 0.2;

export type MissionFees = {
  priceFinal: number;
  platformFee: number;
  artisanPayout: number;
  isEstimate: boolean;
};

export function missionFeesFromMission(mission: {
  status: string;
  price_final?: number | null;
  price?: number | string | null;
  price_estimate?: number | null;
  platform_fee?: number | null;
  artisan_payout?: number | null;
}): MissionFees | null {
  let gmv: number | null = mission.price_final ?? null;

  if (gmv == null || gmv <= 0) {
    const fromPrice =
      typeof mission.price === "number"
        ? mission.price
        : mission.price != null && String(mission.price) !== ""
          ? Number(mission.price)
          : NaN;
    if (Number.isFinite(fromPrice) && fromPrice > 0) {
      gmv = fromPrice;
    }
  }

  if (gmv == null || gmv <= 0) {
    gmv = mission.price_estimate ?? null;
  }

  if (gmv == null || Number.isNaN(gmv) || gmv <= 0) return null;

  const completed = mission.status === "completed";

  if (completed && mission.platform_fee != null && mission.artisan_payout != null) {
    return {
      priceFinal: gmv,
      platformFee: mission.platform_fee,
      artisanPayout: mission.artisan_payout,
      isEstimate: false,
    };
  }

  const platformFee = Math.round(gmv * PLATFORM_COMMISSION_RATE * 100) / 100;
  const artisanPayout = Math.round((gmv - platformFee) * 100) / 100;

  return {
    priceFinal: gmv,
    platformFee,
    artisanPayout,
    isEstimate: !completed,
  };
}
