import { NextResponse } from "next/server";

import { apiRequestWithAuth } from "@/lib/auth/refresh";

import { apiErrorJson } from "@/lib/api/errors";

import type { AccountingPeriod } from "@/types/domain";



export async function GET(request: Request) {

  const { searchParams } = new URL(request.url);

  const period = searchParams.get("period") as AccountingPeriod | null;

  const from = searchParams.get("from") ?? undefined;

  const to = searchParams.get("to") ?? undefined;



  if (!period) {

    return NextResponse.json(

      { message: "Paramètre period requis (day|week|month|year)" },

      { status: 400 },

    );

  }



  const q = new URLSearchParams({ period });

  if (from) q.set("from", from);

  if (to) q.set("to", to);



  try {

    const data = await apiRequestWithAuth<unknown>(

      `/artisans/me/accounting?${q}`,

    );

    return NextResponse.json(data);

  } catch (error) {

    const { message, status, code } = apiErrorJson(

      error,

      "Comptabilité inaccessible.",

    );

    return NextResponse.json({ message, code }, { status });

  }

}

