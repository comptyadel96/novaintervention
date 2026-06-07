import { NextResponse } from "next/server";
import { apiRequest } from "@/lib/api/client";
import { apiErrorJson } from "@/lib/api/errors";

export async function GET() {
  try {
    const data = await apiRequest<{ enabled?: boolean; model?: string }>(
      "/ai/status",
    );
    return NextResponse.json({
      enabled: data.enabled === true,
      model: data.model,
      textFallbackAvailable:
        (data as { textFallbackAvailable?: boolean }).textFallbackAvailable !==
        false,
    });
  } catch (error) {
    const { message, status } = apiErrorJson(
      error,
      "Impossible de récupérer le statut IA",
    );
    return NextResponse.json({ enabled: false, message }, { status });
  }
}
