import { NextResponse } from "next/server";

import { apiRequest } from "@/lib/api/client";

import { setAuthCookies } from "@/lib/auth/server-actions";

import { mapSessionFromApi } from "@/lib/api/mappers";

import { apiErrorJson } from "@/lib/api/errors";

import { normalizePhone } from "@/lib/auth/phone";

import type { UserRole } from "@/types/domain";



type VerifyBody = {

  phone: string;

  code: string;

  role?: UserRole;

  firstName?: string;

  lastName?: string;

  email?: string;

};



export async function POST(request: Request) {

  try {

    const body = (await request.json()) as VerifyBody;

    const payload: Record<string, string> = {

      phone: normalizePhone(body.phone),

      code: body.code.trim(),

    };

    if (body.role) payload.role = body.role;

    if (body.firstName) payload.firstName = body.firstName;

    if (body.lastName) payload.lastName = body.lastName;

    if (body.email) payload.email = body.email;



    const data = await apiRequest<Record<string, unknown>>("/auth/sms/verify", {

      method: "POST",

      body: payload,

    });



    await setAuthCookies(

      data.accessToken as string,

      data.refreshToken as string | undefined,

    );



    const session = mapSessionFromApi({

      user: data.user,

      profile: data.profile,

    });



    return NextResponse.json(session);

  } catch (error) {

    const { message, status, code } = apiErrorJson(

      error,

      "Vérification impossible.",

    );

    return NextResponse.json({ message, code }, { status });

  }

}

