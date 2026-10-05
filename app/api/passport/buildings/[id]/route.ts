import { NextResponse } from "next/server";

import { mapBuilding, mapPassportOverview } from "@/lib/api/map-passport";
import { apiErrorJson } from "@/lib/api/errors";
import { passportJson, passportRequest } from "@/lib/api/passport-route";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  return passportJson(
    async () => {
      const data = await passportRequest<unknown>(`/buildings/${id}`);
      return { ...mapPassportOverview(data), backendReady: true };
    },
    {
      fallback: "Passeport introuvable.",
      whenMissing: { backendReady: false },
    },
  );
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json();

  return passportJson(
    async () => {
      const data = await passportRequest<Record<string, unknown>>(
        `/buildings/${id}`,
        { method: "PATCH", body },
      );
      return mapBuilding((data.building ?? data) as Record<string, unknown>);
    },
    { fallback: "Mise à jour du passeport impossible." },
  );
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    await passportRequest<void>(`/buildings/${id}`, { method: "DELETE" });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    const { message, status, code } = apiErrorJson(
      error,
      "Suppression impossible.",
    );
    return NextResponse.json({ message, code }, { status });
  }
}
