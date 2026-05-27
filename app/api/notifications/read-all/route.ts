import { NextResponse } from "next/server";
import { apiRequestWithAuth } from "@/lib/auth/refresh";

export async function PATCH() {
  try {
    await apiRequestWithAuth<void>("/notifications/read-all", {
      method: "PATCH",
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Erreur.";
    return NextResponse.json({ message }, { status: 500 });
  }
}
