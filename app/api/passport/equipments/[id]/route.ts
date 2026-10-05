import { NextResponse } from "next/server";

import { mapEquipment } from "@/lib/api/map-passport";
import { passportJson, passportRequest } from "@/lib/api/passport-route";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json();

  return passportJson(
    async () => {
      const data = await passportRequest<Record<string, unknown>>(
        `/equipments/${id}`,
        { method: "PATCH", body },
      );
      return mapEquipment((data.equipment ?? data) as Record<string, unknown>);
    },
    { fallback: "Mise à jour de l'équipement impossible." },
  );
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    await passportRequest<void>(`/equipments/${id}`, { method: "DELETE" });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Suppression impossible.";
    return NextResponse.json({ message }, { status: 500 });
  }
}
