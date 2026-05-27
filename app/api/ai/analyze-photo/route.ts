import { NextResponse } from "next/server";
import { apiRequest } from "@/lib/api/client";
import { apiRequestWithAuth } from "@/lib/auth/refresh";
import { getAccessToken } from "@/lib/auth/session";
import { ApiError, apiErrorJson } from "@/lib/api/errors";
import { mapAnalyzePhotoResult } from "@/lib/ai/map-analysis";
import { parseAnalyzePhotoMeta } from "@/lib/ai/analysis-meta";
import { getMockAnalyzePhotoResult } from "@/lib/ai/mock-analysis";

function allowLocalMockFallback(): boolean {
  return process.env.AI_ANALYZE_ALLOW_MOCK === "true";
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      image?: string;
      imageUrl?: string;
      context?: string;
    };

    if (!body?.image && !body?.imageUrl) {
      return NextResponse.json(
        { message: "Image requise", code: "VALIDATION_ERROR" },
        { status: 400 },
      );
    }

    const backendBody: Record<string, string> = {};
    if (body.imageUrl) {
      backendBody.imageUrl = body.imageUrl;
    } else if (body.image) {
      backendBody.image = body.image;
    }
    if (body.context?.trim()) {
      backendBody.context = body.context.trim();
    }

    const token = await getAccessToken();

    try {
      const data = token
        ? await apiRequestWithAuth<Record<string, unknown>>(
            "/ai/analyze-photo",
            { method: "POST", body: backendBody },
          )
        : await apiRequest<Record<string, unknown>>("/ai/analyze-photo", {
            method: "POST",
            body: backendBody,
          });

      const analysis = mapAnalyzePhotoResult(data);
      const meta = parseAnalyzePhotoMeta(data);

      return NextResponse.json({ analysis, meta });
    } catch (error) {
      if (error instanceof ApiError) {
        if (allowLocalMockFallback() && error.status >= 500) {
          const analysis = getMockAnalyzePhotoResult();
          return NextResponse.json({
            analysis,
            meta: { source: "mock", model: "demo" },
            _warning:
              "Backend IA indisponible — résultat de démonstration (AI_ANALYZE_ALLOW_MOCK côté front).",
          });
        }
        return NextResponse.json(
          { message: error.message, code: error.code },
          { status: error.status },
        );
      }
      throw error;
    }
  } catch (error) {
    if (allowLocalMockFallback()) {
      const analysis = getMockAnalyzePhotoResult();
      return NextResponse.json({
        analysis,
        meta: { source: "mock", model: "demo" },
      });
    }
    const { message, status } = apiErrorJson(error, "Erreur analyse photo");
    return NextResponse.json({ message }, { status });
  }
}
