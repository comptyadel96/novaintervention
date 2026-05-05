import type { AnalyzePhotoRequest, AnalyzePhotoResult } from "@/types";

/**
 * Service to call the GPT-4o Vision endpoint to analyze the intervention photo.
 */
export async function analyzePhoto(data: AnalyzePhotoRequest): Promise<AnalyzePhotoResult> {
  const response = await fetch("/api/analyze-photo", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("L'analyse photo par IA a échoué. Veuillez réessayer.");
  }

  return response.json();
}
