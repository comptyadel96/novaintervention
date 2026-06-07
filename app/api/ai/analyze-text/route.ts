import { NextResponse } from "next/server";
import { ApiError } from "@/lib/api/errors";
import { apiRequestPublicFirst } from "@/lib/api/public-or-auth";
import { mapAnalyzePhotoResult } from "@/lib/ai/map-analysis";
import { parseAnalyzePhotoMeta } from "@/lib/ai/analysis-meta";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      description?: string;
      category?: string;
    };

    if (!body?.description?.trim() || body.description.trim().length < 10) {
      return NextResponse.json(
        {
          message: "Décrivez le problème en au moins 10 caractères.",
          code: "VALIDATION_ERROR",
        },
        { status: 400 },
      );
    }

    const backendBody = {
      description: body.description.trim(),
      category: body.category?.trim() || "plomberie",
    };

    const data = await apiRequestPublicFirst<Record<string, unknown>>(
      "/ai/analyze-text",
      { method: "POST", body: backendBody },
    );

    const analysis = mapAnalyzePhotoResult(data);
    const meta = parseAnalyzePhotoMeta(data);

    return NextResponse.json({ analysis, meta });
  } catch (error) {
    const message =
      error instanceof ApiError
        ? error.message
        : error instanceof Error
          ? error.message
          : "Analyse texte impossible.";
    const status = error instanceof ApiError ? error.status : 500;
    const code = error instanceof ApiError ? error.code : undefined;
    return NextResponse.json({ message, code }, { status });
  }
}
