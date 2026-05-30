import { NextResponse } from "next/server";
import { apiRequest } from "@/lib/api/client";
import { apiErrorJson } from "@/lib/api/errors";
import {
  getDefaultEarningsEstimate,
  mapArtisanEarningsEstimate,
} from "@/lib/api/map-earnings-estimate";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city")?.trim();
  const trade = searchParams.get("trade")?.trim() ?? "plomberie";

  const q = new URLSearchParams({ trade });
  if (city) q.set("city", city);

  try {
    const data = await apiRequest<unknown>(
      `/public/artisan-earnings-estimate?${q}`,
    );
    const estimate = mapArtisanEarningsEstimate(data);
    return NextResponse.json({ estimate });
  } catch (error) {
    const { message, status } = apiErrorJson(
      error,
      "Estimation indisponible",
    );
    return NextResponse.json(
      {
        estimate: getDefaultEarningsEstimate(),
        fallback: true,
        message,
      },
      { status: status >= 500 ? 200 : status },
    );
  }
}
