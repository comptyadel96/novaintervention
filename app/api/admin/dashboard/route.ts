import { NextResponse } from "next/server";

import { apiRequestWithAuth } from "@/lib/auth/refresh";

import { apiErrorJson } from "@/lib/api/errors";



export async function GET() {

  try {

    const data = await apiRequestWithAuth<unknown>("/admin/dashboard");

    return NextResponse.json(data);

  } catch (error) {

    const { message, status, code } = apiErrorJson(

      error,

      "Dashboard admin inaccessible.",

    );

    return NextResponse.json({ message, code }, { status });

  }

}

