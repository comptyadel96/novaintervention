import { NextResponse } from "next/server";
import { apiRequest } from "@/lib/api/client";
import { apiErrorJson } from "@/lib/api/errors";

export async function GET() {
  try {
    const data = await apiRequest<{ enabled: boolean; clientId?: string }>(
      "/auth/google/status",
    );
    return NextResponse.json(data);
  } catch (error) {
    const { message, status, code } = apiErrorJson(
      error,
      "Statut Google indisponible.",
    );
    return NextResponse.json({ enabled: false, message, code }, { status });
  }
}
