import { NextResponse } from "next/server";
import { apiErrorJson } from "@/lib/api/errors";
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
    const { message, status, code } = apiErrorJson(error, "Erreur.");
    return NextResponse.json({ message, code }, { status });
  }
}
