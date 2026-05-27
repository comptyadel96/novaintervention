import { NextResponse } from "next/server";

import { apiRequest } from "@/lib/api/client";

import { getAccessToken } from "@/lib/auth/session";

import { apiErrorJson } from "@/lib/api/errors";



export async function PATCH(request: Request) {

  const token = await getAccessToken();

  if (!token) {

    return NextResponse.json({ message: "Non authentifié" }, { status: 401 });

  }



  try {

    const body = (await request.json()) as {

      currentPassword?: string;

      newPassword?: string;

      password?: string;

    };

    const data = await apiRequest<{ message: string }>("/auth/password", {

      method: "PATCH",

      token,

      body: {

        currentPassword: body.currentPassword,

        newPassword: body.newPassword ?? body.password,

      },

    });

    return NextResponse.json(data);

  } catch (error) {

    const { message, status, code } = apiErrorJson(

      error,

      "Mise à jour impossible.",

    );

    return NextResponse.json({ message, code }, { status });

  }

}

