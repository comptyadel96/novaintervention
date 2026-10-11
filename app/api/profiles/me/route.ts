import { NextResponse } from "next/server";
import { mapProfileFromApi, mapProfileToPatch } from "@/lib/api/mappers";
import { apiErrorJson } from "@/lib/api/errors";
import { apiRequestWithAuth } from "@/lib/auth/refresh";

export async function GET() {
  try {
    const data = await apiRequestWithAuth<Record<string, unknown>>(
      "/profiles/me",
    );
    return NextResponse.json(mapProfileFromApi(data));
  } catch (error) {
    const { message, status, code } = apiErrorJson(
      error,
      "Profil inaccessible.",
    );
    return NextResponse.json({ message, code }, { status });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const data = await apiRequestWithAuth<Record<string, unknown>>(
      "/profiles/me",
      {
        method: "PATCH",
        body: mapProfileToPatch(body),
      },
    );
    return NextResponse.json(mapProfileFromApi(data));
  } catch (error) {
    const { message, status, code } = apiErrorJson(
      error,
      "Mise à jour impossible.",
    );
    return NextResponse.json({ message, code }, { status });
  }
}
