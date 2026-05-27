import { NextResponse } from "next/server";

import { apiRequest } from "@/lib/api/client";

import { apiErrorJson } from "@/lib/api/errors";

import { normalizePhone } from "@/lib/auth/phone";



export async function POST(request: Request) {

  try {

    const { phone } = (await request.json()) as { phone: string };

    const data = await apiRequest<{ message?: string }>("/auth/sms/send-code", {

      method: "POST",

      body: { phone: normalizePhone(phone) },

    });

    return NextResponse.json(data);

  } catch (error) {

    const { message, status, code } = apiErrorJson(

      error,

      "Envoi du code impossible.",

    );

    return NextResponse.json({ message, code }, { status });

  }

}

