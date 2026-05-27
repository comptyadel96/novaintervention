import { NextResponse } from "next/server";

import { mapMissionsFromApi } from "@/lib/api/mappers";

import { apiRequestWithAuth } from "@/lib/auth/refresh";

import { apiErrorJson } from "@/lib/api/errors";



export async function GET(request: Request) {

  const q = new URL(request.url).searchParams.toString();

  try {

    const data = await apiRequestWithAuth<unknown>(

      `/admin/missions${q ? `?${q}` : ""}`,

    );

    const items = Array.isArray(data)

      ? data

      : (data as { items?: unknown[] })?.items ?? [];

    return NextResponse.json(mapMissionsFromApi(items));

  } catch (error) {

    const { message, status, code } = apiErrorJson(error, "Missions admin inaccessibles.");

    return NextResponse.json({ message, code }, { status });

  }

}

