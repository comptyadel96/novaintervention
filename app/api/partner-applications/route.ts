import { NextResponse } from "next/server";
import { apiRequest } from "@/lib/api/client";
import { apiErrorJson } from "@/lib/api/errors";
import { mapPartnerApplication } from "@/lib/api/map-partner-application";
import type { CreatePartnerApplicationInput } from "@/types/domain";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CreatePartnerApplicationInput;

    if (
      !body?.firstName?.trim() ||
      !body?.lastName?.trim() ||
      !body?.phone?.trim() ||
      !body?.email?.trim() ||
      !body?.password ||
      !body?.city?.trim()
    ) {
      return NextResponse.json(
        {
          message: "Tous les champs sont obligatoires.",
          code: "VALIDATION_ERROR",
        },
        { status: 400 },
      );
    }

    if (body.password.length < 8) {
      return NextResponse.json(
        {
          message: "Le mot de passe doit contenir au moins 8 caractères.",
          code: "VALIDATION_ERROR",
        },
        { status: 400 },
      );
    }

    const data = await apiRequest<Record<string, unknown>>(
      "/partner-applications",
      {
        method: "POST",
        body: {
          firstName: body.firstName.trim(),
          lastName: body.lastName.trim(),
          phone: body.phone.trim(),
          email: body.email.trim(),
          password: body.password,
          city: body.city.trim(),
          trade: "plomberie",
        },
      },
    );

    return NextResponse.json(
      {
        application: mapPartnerApplication(data),
        id: data.id,
        userId: data.userId ?? data.user_id,
        message: data.message,
        accountCreated: data.accountCreated ?? data.account_created,
        emailSent: data.emailSent ?? data.email_sent,
      },
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
