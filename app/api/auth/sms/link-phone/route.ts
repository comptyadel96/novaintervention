import { NextResponse } from "next/server";

import { apiRequestWithAuth } from "@/lib/auth/refresh";

import { mapSessionFromApi } from "@/lib/api/mappers";

import { apiErrorJson } from "@/lib/api/errors";

import { normalizePhone } from "@/lib/auth/phone";



export async function POST(request: Request) {

  try {

    const { phone, code } = (await request.json()) as {

      phone: string;

      code: string;

    };

    const data = await apiRequestWithAuth<Record<string, unknown>>(

      "/auth/sms/link-phone",

      {

        method: "POST",

        body: {

          phone: normalizePhone(phone),

          code: code.trim(),

        },

      },

    );



    const session = mapSessionFromApi({

      user: data.user,

      profile: data.profile,

    });



    return NextResponse.json(session);

  } catch (error) {

    const { message, status, code } = apiErrorJson(

      error,

      "Liaison du numéro impossible.",

    );

    return NextResponse.json({ message, code }, { status });

  }

}

