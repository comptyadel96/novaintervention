import { NextResponse } from "next/server";
import { apiRequest } from "@/lib/api/client";
import { apiErrorJson } from "@/lib/api/errors";
import { mapPartnerApplication } from "@/lib/api/map-partner-application";
import type { CreatePartnerApplicationInput } from "@/types/domain";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CreatePartnerApplicationInput;

    const data = await apiRequest<Record<string, unknown>>(
      "/partner-applications",
      {
        method: "POST",
        body: {
          firstName: body.firstName,
          lastName: body.lastName,
          phone: body.phone,
          email: body.email?.trim() || undefined,
          city: body.city,
          trade: "plomberie",
        },
      },
    );

    return NextResponse.json(
      { application: mapPartnerApplication(data) },
      { status: 201 },
    );
  } catch (error) {
    const { message, status, code } = apiErrorJson(
      error,
      "Impossible d'enregistrer la candidature.",
    );
    return NextResponse.json({ message, code }, { status });
  }
}
