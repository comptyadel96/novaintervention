import { NextResponse } from "next/server";
import { apiErrorJson } from "@/lib/api/errors";
import { apiRequestWithAuth } from "@/lib/auth/refresh";

export async function PATCH() {
  try {
    await apiRequestWithAuth<void>("/notifications/read-all", {
      method: "PATCH",
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    const { message, status, code } = apiErrorJson(error, "Erreur.");
    return NextResponse.json({ message, code }, { status });
  }
}
