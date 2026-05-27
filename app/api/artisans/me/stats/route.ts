import { NextResponse } from "next/server";

import { apiRequestWithAuth } from "@/lib/auth/refresh";

import { apiErrorJson } from "@/lib/api/errors";



export async function GET() {

  try {

    const data = await apiRequestWithAuth<Record<string, unknown>>(

      "/artisans/me/stats",

    );

    return NextResponse.json(data);

  } catch (error) {

    const { message, status, code } = apiErrorJson(

      error,

      "Statistiques inaccessibles.",

    );

    return NextResponse.json({ message, code }, { status });

  }

}

