import { NextResponse } from "next/server";
import { apiRequest } from "@/lib/api/client";
import { apiErrorJson } from "@/lib/api/errors";
import { resolveGoogleClientId } from "@/lib/auth/google-config";

export async function GET() {
  const envClientId = resolveGoogleClientId();

  try {
    const data = await apiRequest<{ enabled: boolean; clientId?: string }>(
      "/auth/google/status",
    );

    if (data.enabled && data.clientId) {
      return NextResponse.json(data);
    }

    if (envClientId) {
      return NextResponse.json({ enabled: true, clientId: envClientId });
    }

    return NextResponse.json(data);
  } catch (error) {
    if (envClientId) {
      return NextResponse.json({ enabled: true, clientId: envClientId });
    }

    const { message, status, code } = apiErrorJson(
      error,
      "Statut Google indisponible.",
    );
    return NextResponse.json({ enabled: false, message, code }, { status });
  }
}
