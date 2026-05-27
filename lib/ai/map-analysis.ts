import {
  AI_PLUMBING_INTERVENTION_TYPES,
  type AiPlumbingInterventionType,
  isAiPlumbingInterventionType,
} from "@/lib/ai/intervention-labels";
import type { AnalyzePhotoResult, UrgencyLevel } from "@/types";

const URGENCY_LEVELS: UrgencyLevel[] = ["urgent", "standard", "planifiable"];

function normalizeType(raw: unknown): AiPlumbingInterventionType {
  const s = String(raw ?? "services__emergency");
  if (isAiPlumbingInterventionType(s)) return s;
  if (s.includes("debouch")) return "services__debouchage_conduites";
  if (s.includes("fuite")) return "services__fuite_eau";
  if (s.includes("robinet")) return "services__robinetterie";
  if (s.includes("chauffe")) return "services__chauffe_eau";
  if (s.includes("wc") || s.includes("sanitaire")) {
    return "services__wc_sanitaires";
  }
  if (s.includes("general") || s.includes("plomb")) {
    return "services__general_plomberie";
  }
  return "services__emergency";
}

function normalizeUrgency(raw: unknown): UrgencyLevel {
  const s = String(raw ?? "standard").toLowerCase();
  if (URGENCY_LEVELS.includes(s as UrgencyLevel)) return s as UrgencyLevel;
  if (s.includes("urgent")) return "urgent";
  if (s.includes("plan")) return "planifiable";
  return "standard";
}

function normalizeStringList(raw: unknown): string[] {
  if (Array.isArray(raw)) {
    return raw.map((p) => String(p)).filter(Boolean);
  }
  if (typeof raw === "string" && raw.trim()) {
    return [raw];
  }
  return [];
}

/** Normalise la réponse backend `{ analysis, meta }` vers le format front. */
export function mapAnalyzePhotoResult(data: unknown): AnalyzePhotoResult {
  const root = (data ?? {}) as Record<string, unknown>;
  const a = (root.analysis as Record<string, unknown> | undefined) ?? root;

  const min =
    Number(a.estimation_prix_min ?? a.priceMin ?? a.estimatedMin) || 100;
  const max =
    Number(a.estimation_prix_max ?? a.priceMax ?? a.estimatedMax) || min + 80;

  const type = normalizeType(
    a.type_intervention ?? a.typeIntervention ?? a.category,
  );

  if (!(AI_PLUMBING_INTERVENTION_TYPES as readonly string[]).includes(type)) {
    // garde-fou TypeScript — normalizeType retourne toujours une valeur IA valide
  }

  return {
    type_intervention: type,
    description_probleme: String(
      a.description_probleme ??
        a.description ??
        a.summary ??
        a.probableIssue ??
        "Diagnostic en cours de validation.",
    ),
    niveau_urgence: normalizeUrgency(
      a.niveau_urgence ?? a.urgency ?? a.urgence,
    ),
    estimation_prix_min: Math.min(min, max),
    estimation_prix_max: Math.max(min, max),
    pieces_recommandees: normalizeStringList(
      a.pieces_recommandees ??
        a.recommendedParts ??
        a.suggestedActions ??
        a.parts,
    ),
    conseils_client: normalizeStringList(
      a.conseils_client ?? a.clientTips ?? a.tips ?? a.advice,
    ),
    duree_estimee_minutes:
      Number(a.duree_estimee_minutes ?? a.durationMinutes ?? a.duration) || 60,
    confidence: Math.min(
      1,
      Math.max(0, Number(a.confidence ?? a.confidenceScore ?? 0.75)),
    ),
  };
}
