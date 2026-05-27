import { NextResponse } from "next/server";

import { apiRequestWithAuth } from "@/lib/auth/refresh";

import { apiErrorJson } from "@/lib/api/errors";



export async function GET() {

  try {

    const data = await apiRequestWithAuth<{ totalSpent?: number }>(

      "/clients/me/stats",

    );

    return NextResponse.json({

      totalSpent: data.totalSpent ?? 0,

      missionsCount: (data as { missionsCount?: number }).missionsCount,

      activeMissions: (data as { activeMissions?: number }).activeMissions,

    });

  } catch (error) {

    const { message, status, code } = apiErrorJson(

      error,

      "Statistiques client inaccessibles.",

    );

    return NextResponse.json({ message, code }, { status });

  }

}

