/** Valeurs exactes renvoyées par POST /ai/analyze-photo (backend). */
export const AI_PLUMBING_INTERVENTION_TYPES = [
  "services__emergency",
  "services__debouchage_conduites",
  "services__fuite_eau",
  "services__robinetterie",
  "services__chauffe_eau",
  "services__wc_sanitaires",
  "services__general_plomberie",
] as const;

export type AiPlumbingInterventionType =
  (typeof AI_PLUMBING_INTERVENTION_TYPES)[number];

const LABELS: Record<AiPlumbingInterventionType, string> = {
  services__emergency: "Dépannage d'urgence",
  services__debouchage_conduites: "Débouchage des conduites",
  services__fuite_eau: "Fuite d'eau",
  services__robinetterie: "Robinetterie",
  services__chauffe_eau: "Chauffe-eau",
  services__wc_sanitaires: "WC & sanitaires",
  services__general_plomberie: "Plomberie générale",
};

export function formatAiInterventionType(type: string): string {
  if (type in LABELS) {
    return LABELS[type as AiPlumbingInterventionType];
  }
  return type.replace("services__", "").replace(/_/g, " ");
}

export function isAiPlumbingInterventionType(
  value: string,
): value is AiPlumbingInterventionType {
  return (AI_PLUMBING_INTERVENTION_TYPES as readonly string[]).includes(value);
}
