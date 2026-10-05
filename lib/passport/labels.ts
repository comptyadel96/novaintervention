import type {
  BuildingKind,
  BuildingMemberRole,
  DataConfidence,
  EquipmentCategory,
  PassportDocumentKind,
  PassportEventKind,
  PassportHealth,
  RecommendationKind,
  RecommendationPriority,
} from "@/types/passport";

export const BUILDING_KIND_LABELS: Record<BuildingKind, string> = {
  apartment: "Appartement",
  house: "Maison",
  building: "Immeuble",
  commercial: "Local professionnel",
  other: "Autre",
};

export const MEMBER_ROLE_LABELS: Record<BuildingMemberRole, string> = {
  owner: "Propriétaire",
  occupant: "Occupant",
  viewer: "Lecture seule",
};

export const EQUIPMENT_CATEGORY_LABELS: Record<EquipmentCategory, string> = {
  heating: "Chaudière / chauffage",
  water_heater: "Chauffe-eau",
  air_conditioning: "Climatisation",
  ventilation: "VMC / ventilation",
  roof: "Toiture",
  plumbing: "Plomberie",
  electrical: "Électricité",
  other: "Autre équipement",
};

export const DOCUMENT_KIND_LABELS: Record<PassportDocumentKind, string> = {
  invoice: "Facture",
  warranty: "Garantie",
  manual: "Notice",
  diagnostic: "Diagnostic",
  photo: "Photo",
  other: "Document",
};

export const EVENT_KIND_LABELS: Record<PassportEventKind, string> = {
  intervention: "Intervention",
  maintenance: "Entretien",
  works: "Travaux",
  note: "Note",
};

export const HEALTH_LABELS: Record<PassportHealth, string> = {
  up_to_date: "À jour",
  watch: "À surveiller",
  action_required: "Action recommandée",
};

/** Classes Tailwind du badge d'état (jamais anxiogène : pas de rouge vif). */
export const HEALTH_STYLES: Record<PassportHealth, string> = {
  up_to_date: "bg-green-50 text-green-700 border-green-200",
  watch: "bg-amber-50 text-amber-700 border-amber-200",
  action_required: "bg-orange-50 text-orange-700 border-orange-200",
};

export const CONFIDENCE_LABELS: Record<DataConfidence, string> = {
  declared: "Déclaré",
  confirmed: "Confirmé par un pro",
  proven: "Justifié",
  reinforced: "Confiance renforcée",
};

export const CONFIDENCE_HINTS: Record<DataConfidence, string> = {
  declared: "Information saisie par vous, non vérifiée.",
  confirmed: "Donnée confirmée par un artisan Nova lors d'une intervention.",
  proven: "Appuyée par une facture, une photo ou un document.",
  reinforced: "Cohérente avec plusieurs événements du passeport.",
};

export const CONFIDENCE_STYLES: Record<DataConfidence, string> = {
  declared: "bg-bg-alt text-text-muted border-border",
  confirmed: "bg-blue-50 text-blue-700 border-blue-200",
  proven: "bg-primary/10 text-primary border-primary/20",
  reinforced: "bg-green-50 text-green-700 border-green-200",
};

export const RECOMMENDATION_KIND_LABELS: Record<RecommendationKind, string> = {
  maintenance: "Entretien",
  check: "Contrôle",
  replacement: "Remplacement à prévoir",
};

export const RECOMMENDATION_PRIORITY_LABELS: Record<
  RecommendationPriority,
  string
> = {
  low: "Quand vous voulez",
  medium: "À planifier",
  high: "Prioritaire",
};

export const RECOMMENDATION_PRIORITY_STYLES: Record<
  RecommendationPriority,
  string
> = {
  low: "bg-bg-alt text-text-muted border-border",
  medium: "bg-amber-50 text-amber-700 border-amber-200",
  high: "bg-orange-50 text-orange-700 border-orange-200",
};
