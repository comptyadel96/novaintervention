import { NextResponse } from "next/server";
import { apiRequestWithAuth } from "@/lib/auth/refresh";

export async function PATCH(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    await apiRequestWithAuth<void>(`/notifications/${id}/read`, {
      method: "PATCH",
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Erreur.";
    return NextResponse.json({ message }, { status: 500 });
  }
}
