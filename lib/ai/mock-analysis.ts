import type { AnalyzePhotoResult } from "@/types";

/** Données de démo — uniquement si AI_ANALYZE_ALLOW_MOCK=true */
export function getMockAnalyzePhotoResult(): AnalyzePhotoResult {
  return {
    type_intervention: "services__emergency",
    description_probleme:
      "Fuite probable au niveau du siphon ou du joint sous évier (mode démo — configurez OpenAI sur le backend).",
    niveau_urgence: "urgent",
    estimation_prix_min: 150,
    estimation_prix_max: 250,
    pieces_recommandees: ["Joint de siphon 40 mm", "Flexible d'évacuation"],
    conseils_client: [
      "Coupez l'arrivée d'eau sous l'évier si possible.",
      "Placez un récipient sous la fuite.",
    ],
    duree_estimee_minutes: 45,
    confidence: 0.55,
  };
}
