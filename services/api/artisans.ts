import { apiRequest } from "@/lib/api/client";
import type { ArtisanAccounting, AccountingPeriod } from "@/types/domain";

type RawAccountingItem = {
  bucket: string;
  missions?: number;
  revenue?: number;
  gmv?: number;
};

export const artisansApi = {
  async getStats(token: string | null) {
    return apiRequest<{
      totalRevenue?: number;
      totalGmv?: number;
      monthlyRevenue?: number;
      weeklyMissionsCount?: number;
      activeClients?: number;
    }>("/artisans/me/stats", { token });
  },

  async getAccounting(
    token: string | null,
    params: {
      period: AccountingPeriod;
      from?: string;
      to?: string;
    },
  ): Promise<ArtisanAccounting> {
    const q = new URLSearchParams({ period: params.period });
    if (params.from) q.set("from", params.from);
    if (params.to) q.set("to", params.to);

    const data = await apiRequest<{
      period?: AccountingPeriod;
      items?: RawAccountingItem[];
      totalRevenue?: number;
    }>(`/artisans/me/accounting?${q}`, { token });

    return {
      period: data.period ?? params.period,
      totalRevenue: data.totalRevenue,
      totalGmv: data.totalGmv,
      items: (data.items ?? []).map((item) => ({
        bucket: item.bucket,
        missions: item.missions ?? 0,
        revenue: item.revenue ?? 0,
        gmv: item.gmv,
      })),
    };
  },
};
