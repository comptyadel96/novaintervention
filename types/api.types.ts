import type { AiPlumbingInterventionType } from "@/lib/ai/intervention-labels";

/** Pages services / navigation (hors analyse IA). */
export type InterventionType =
  | AiPlumbingInterventionType
  | "services__residential"
  | "services__commercial"
  | "plomberie"
  | "electricite"
  | "chauffage"
  | "clim"
  | "serrurerie"
  | "vitrerie";

export type UrgencyLevel = "urgent" | "standard" | "planifiable";

export interface AnalyzePhotoResult {
  type_intervention: AiPlumbingInterventionType;
  description_probleme: string;
  niveau_urgence: UrgencyLevel;
  estimation_prix_min: number;
  estimation_prix_max: number;
  pieces_recommandees: string[];
  conseils_client: string[];
  duree_estimee_minutes: number;
  confidence: number;
}

export interface AnalyzePhotoMeta {
  source: "openai" | "mock" | "fallback" | "manual";
  model?: string;
  fallbackReason?: string;
}

export interface AnalyzePhotoRequest {
  /** Data URL base64 */
  image?: string;
  /** URL publique (Cloudinary) — préféré si disponible */
  imageUrl?: string;
  context?: string;
}
