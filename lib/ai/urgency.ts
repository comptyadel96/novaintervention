/** Niveaux d'urgence considérés comme prioritaires (pas de friction IA). */
export function isUrgentIntervention(urgency?: string | null): boolean {
  const value = urgency?.trim().toLowerCase() ?? "";
  return (
    value === "urgent" ||
    value === "urgence" ||
    value === "haute" ||
    value === "high"
  );
}

/** Champ « plus de détails » : jamais bloquant, jamais en urgence. */
export function shouldSuggestMoreDetails(
  confidence: number,
  urgency?: string | null,
): boolean {
  if (isUrgentIntervention(urgency)) return false;
  return confidence > 0 && confidence < 0.6;
}
