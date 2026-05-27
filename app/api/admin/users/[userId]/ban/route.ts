import { NextResponse } from "next/server";

import { apiRequestWithAuth } from "@/lib/auth/refresh";

import { apiErrorJson } from "@/lib/api/errors";



type Params = { params: Promise<{ userId: string }> };



export async function PATCH(request: Request, { params }: Params) {

  const { userId } = await params;

  try {

    const body = await request.json();

    const data = await apiRequestWithAuth<unknown>(

      `/admin/users/${userId}/ban`,

      { method: "PATCH", body },

    );

    return NextResponse.json(data);

  } catch (error) {

    const { message, status, code } = apiErrorJson(error, "Bannissement impossible.");

    return NextResponse.json({ message, code }, { status });

  }

}

