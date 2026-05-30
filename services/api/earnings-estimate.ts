import type { ArtisanEarningsEstimate } from "@/types/domain";
import {
  getDefaultEarningsEstimate,
  mapArtisanEarningsEstimate,
} from "@/lib/api/map-earnings-estimate";

export async function fetchArtisanEarningsEstimate(params?: {
  city?: string;
  trade?: string;
}): Promise<{
  estimate: ArtisanEarningsEstimate;
  fallback: boolean;
}> {
  const q = new URLSearchParams({ trade: params?.trade ?? "plomberie" });
  if (params?.city?.trim()) q.set("city", params.city.trim());

  try {
    const response = await fetch(
      `/api/public/artisan-earnings-estimate?${q}`,
      { cache: "no-store" },
    );
    const payload = await response.json().catch(() => ({}));
    const estimate = mapArtisanEarningsEstimate(payload);
    const fallback =
      (payload as { fallback?: boolean }).fallback === true ||
      estimate.dataSource === "default";
    return { estimate, fallback };
  } catch {
    return { estimate: getDefaultEarningsEstimate(), fallback: true };
  }
}
