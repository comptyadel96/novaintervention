import type { AnalyzePhotoMeta, AnalyzePhotoResult } from "@/types";
import { mapAnalyzePhotoResult } from "@/lib/ai/map-analysis";
import { parseAnalyzePhotoMeta } from "@/lib/ai/analysis-meta";
import { ApiError } from "@/lib/api/errors";

export type AnalyzePhotoInput = {
  /** Data URL base64 (jpeg/png) */
  image?: string;
  /** URL Cloudinary ou publique après upload */
  imageUrl?: string;
  /** Contexte texte optionnel (symptômes, pièce, etc.) */
  context?: string;
};

export type AnalyzePhotoResponse = {
  analysis: AnalyzePhotoResult;
  meta: AnalyzePhotoMeta;
  /** Présent si le BFF front a simulé un mock (backend injoignable + AI_ANALYZE_ALLOW_MOCK) */
  warning?: string;
};

export async function analyzePhoto(
  input: AnalyzePhotoInput,
): Promise<AnalyzePhotoResponse> {
  if (!input.image && !input.imageUrl) {
    throw new Error("Aucune image à analyser.");
  }

  const response = await fetch("/api/ai/analyze-photo", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      image: input.image,
      imageUrl: input.imageUrl,
      context: input.context,
    }),
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const body = payload as { message?: string; code?: string };
    throw new ApiError(
      body.message ??
        "L'analyse photo par IA a échoué. Vérifiez que le backend et OpenAI sont configurés.",
      response.status,
      body.code,
    );
  }

  const analysis = mapAnalyzePhotoResult(payload);
  const meta = parseAnalyzePhotoMeta(payload);
  const warning = (payload as { _warning?: string })._warning;

  return { analysis, meta, warning };
}
