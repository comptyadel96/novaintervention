import { NextResponse } from "next/server";
import { apiRequest } from "@/lib/api/client";
import { apiErrorJson } from "@/lib/api/errors";
import type { ContactMessageInput } from "@/types/domain";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ContactMessageInput;

    if (
      !body?.firstName?.trim() ||
      !body?.lastName?.trim() ||
      !body?.email?.trim() ||
      !body?.phone?.trim() ||
      !body?.message?.trim()
    ) {
      return NextResponse.json(
        { message: "Tous les champs sont obligatoires.", code: "VALIDATION_ERROR" },
        { status: 400 },
      );
    }

    const data = await apiRequest<{ id?: string; message?: string }>(
      "/contact-messages",
      {
        method: "POST",
        body: {
          firstName: body.firstName.trim(),
          lastName: body.lastName.trim(),
          email: body.email.trim(),
          phone: body.phone.trim(),
          message: body.message.trim(),
          source: body.source ?? "contact-page",
        },
      },
    );

    return NextResponse.json(
      {
        id: data.id,
        message: data.message ?? "Message envoyé. Nous vous répondrons sous peu.",
      },
      { status: 201 },
    );
  } catch (error) {
    const { message, status, code } = apiErrorJson(
      error,
      "Impossible d'envoyer le message.",
    );
    return NextResponse.json({ message, code }, { status });
  }
}
