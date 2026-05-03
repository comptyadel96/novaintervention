export type InterventionType =
  | "services__emergency"
  | "services__residential"
  | "services__commercial"
  | "services__debouchage_conduites";

export type UrgencyLevel = "urgent" | "standard" | "planifiable";

export interface AnalyzePhotoResult {
  type_intervention: InterventionType;
  description_probleme: string;
  niveau_urgence: UrgencyLevel;
  estimation_prix_min: number;
  estimation_prix_max: number;
  pieces_recommandees: string[];
  duree_estimee_minutes: number;
  confidence: number;
}
