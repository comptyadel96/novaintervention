import { NextResponse } from "next/server";

import { apiRequestWithAuth } from "@/lib/auth/refresh";

import { apiErrorJson } from "@/lib/api/errors";



export async function GET(request: Request) {

  const q = new URL(request.url).searchParams.toString();

  try {

    const data = await apiRequestWithAuth<unknown>(

      `/admin/accounting${q ? `?${q}` : ""}`,

    );

    return NextResponse.json(data);

  } catch (error) {

    const { message, status, code } = apiErrorJson(

      error,

      "Comptabilité admin inaccessible.",

    );

    return NextResponse.json({ message, code }, { status });

  }

}

