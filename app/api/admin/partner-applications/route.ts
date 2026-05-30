import { NextResponse } from "next/server";
import { apiRequestWithAuth } from "@/lib/auth/refresh";
import { apiErrorJson } from "@/lib/api/errors";
import { mapPartnerApplications } from "@/lib/api/map-partner-application";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const q = status ? `?status=${encodeURIComponent(status)}` : "";

    const data = await apiRequestWithAuth<unknown>(
      `/admin/partner-applications${q}`,
    );

    return NextResponse.json({
      items: mapPartnerApplications(data),
    });
  } catch (error) {
    const { message, status } = apiErrorJson(
      error,
      "Impossible de charger les candidatures.",
    );
    return NextResponse.json({ message, items: [] }, { status });
  }
}
