import type { AnalyzePhotoMeta, AnalyzePhotoResult } from "@/types";
import { mapAnalyzePhotoResult } from "@/lib/ai/map-analysis";
import { parseAnalyzePhotoMeta } from "@/lib/ai/analysis-meta";
import { bffFetch } from "@/lib/api/bff-client";

export type AnalyzePhotoInput = {
  /** Data URL base64 (jpeg/png) */
  image?: string;
  /** URL Cloudinary ou publique après upload */
  imageUrl?: string;
  /** Contexte texte optionnel (symptômes, pièce, etc.) */
  context?: string;
};

export type AnalyzeTextInput = {
  description: string;
  category?: string;
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
  if (!input.image && !input.imageUrl && !input.context?.trim()) {
    throw new Error("Aucune image ou description à analyser.");
  }

  const payload = await bffFetch<Record<string, unknown>>(
    "/api/ai/analyze-photo",
    {
      method: "POST",
      body: JSON.stringify({
        image: input.image,
        imageUrl: input.imageUrl,
        context: input.context,
      }),
    },
  );

  const analysis = mapAnalyzePhotoResult(payload);
  const meta = parseAnalyzePhotoMeta(payload);
  const warning = (payload as { _warning?: string })._warning;

  return { analysis, meta, warning };
}

export async function analyzeText(
  input: AnalyzeTextInput,
): Promise<AnalyzePhotoResponse> {
  const payload = await bffFetch<Record<string, unknown>>(
    "/api/ai/analyze-text",
    {
      method: "POST",
      body: JSON.stringify({
        description: input.description,
        category: input.category ?? "plomberie",
      }),
    },
  );

  const analysis = mapAnalyzePhotoResult(payload);
  const meta = parseAnalyzePhotoMeta(payload);

  return { analysis, meta };
}
