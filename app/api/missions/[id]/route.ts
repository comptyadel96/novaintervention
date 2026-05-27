import { NextResponse } from "next/server";
import { mapMissionFromApiSingle } from "@/lib/api/mappers";
import { apiRequestWithAuth } from "@/lib/auth/refresh";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const body = await request.json();
    const data = await apiRequestWithAuth<unknown>(`/missions/${id}`, {
      method: "PATCH",
      body,
    });
    return NextResponse.json(mapMissionFromApiSingle(data));
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Mise à jour impossible.";
    return NextResponse.json({ message }, { status: 500 });
  }
}
