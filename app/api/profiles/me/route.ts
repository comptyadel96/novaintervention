import { NextResponse } from "next/server";
import { mapProfileFromApi, mapProfileToPatch } from "@/lib/api/mappers";
import { apiRequestWithAuth } from "@/lib/auth/refresh";

export async function GET() {
  try {
    const data = await apiRequestWithAuth<Record<string, unknown>>(
      "/profiles/me",
    );
    return NextResponse.json(mapProfileFromApi(data));
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Profil inaccessible.";
    return NextResponse.json({ message }, { status: 500 });
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
    const message =
      error instanceof Error ? error.message : "Mise à jour impossible.";
    return NextResponse.json({ message }, { status: 500 });
  }
}
