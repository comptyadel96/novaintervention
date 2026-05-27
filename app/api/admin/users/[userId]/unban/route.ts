import { NextResponse } from "next/server";

import { apiRequestWithAuth } from "@/lib/auth/refresh";

import { apiErrorJson } from "@/lib/api/errors";



type Params = { params: Promise<{ userId: string }> };



export async function PATCH(_request: Request, { params }: Params) {

  const { userId } = await params;

  try {

    const data = await apiRequestWithAuth<unknown>(

      `/admin/users/${userId}/unban`,

      { method: "PATCH" },

    );

    return NextResponse.json(data);

  } catch (error) {

    const { message, status, code } = apiErrorJson(error, "Débannissement impossible.");

    return NextResponse.json({ message, code }, { status });

  }

}

