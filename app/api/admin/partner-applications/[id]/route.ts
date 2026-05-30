import { NextResponse } from "next/server";
import { apiRequestWithAuth } from "@/lib/auth/refresh";
import { apiErrorJson } from "@/lib/api/errors";
import { mapPartnerApplication } from "@/lib/api/map-partner-application";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = (await request.json()) as {
      status?: string;
      adminNote?: string;
    };

    const data = await apiRequestWithAuth<Record<string, unknown>>(
      `/admin/partner-applications/${id}`,
      {
        method: "PATCH",
        body,
      },
    );

    return NextResponse.json({
      application: mapPartnerApplication(data),
    });
  } catch (error) {
    const { message, status, code } = apiErrorJson(
      error,
      "Mise à jour impossible.",
    );
    return NextResponse.json({ message, code }, { status });
  }
}
