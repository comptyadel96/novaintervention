/**
 * Passeport Nova — mémoire du bâtiment (blueprint stratégique §7).
 * Le passeport appartient fonctionnellement au bâtiment, pas au compte :
 * il doit pouvoir être transféré lors d'une vente.
 */

/** Niveau de preuve d'une donnée (blueprint §7 « principe de confiance des données »). */
export type DataConfidence =
  /** Déclarée par le client : utile mais non certifiée. */
  | "declared"
  /** Confirmée par un artisan : donnée professionnelle vérifiée. */
  | "confirmed"
  /** Appuyée par une facture / photo / document. */
  | "proven"
  /** Cohérente avec plusieurs événements. */
  | "reinforced";

export type BuildingKind =
  | "apartment"
  | "house"
  | "building"
  | "commercial"
  | "other";

/** État global d'un passeport ou d'un équipement. */
export type PassportHealth = "up_to_date" | "watch" | "action_required";

export type EquipmentCategory =
  | "heating"
  | "water_heater"
  | "air_conditioning"
  | "ventilation"
  | "roof"
  | "plumbing"
  | "electrical"
  | "other";

export type PassportDocumentKind =
  | "invoice"
  | "warranty"
  | "manual"
  | "diagnostic"
  | "photo"
  | "other";

export type PassportEventKind =
  | "intervention"
  | "maintenance"
  | "works"
  | "note";

export type RecommendationKind = "maintenance" | "check" | "replacement";

export type RecommendationPriority = "low" | "medium" | "high";

export type BuildingMemberRole = "owner" | "occupant" | "viewer";

/** Identité durable du logement / local. */
export interface Building {
  id: string;
  label: string;
  address: string;
  city?: string | null;
  postalCode?: string | null;
  kind: BuildingKind;
  constructionYear?: number | null;
  surfaceM2?: number | null;
  lat?: number | null;
  lng?: number | null;
  photoUrl?: string | null;
  isPrimary?: boolean;
  /** Rôle du membre connecté sur ce passeport. */
  role?: BuildingMemberRole | null;
  /** Complétude du passeport en pourcentage (0–100). */
  completeness?: number;
  health?: PassportHealth;
  equipmentsCount?: number;
  documentsCount?: number;
  eventsCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface PassportEquipment {
  id: string;
  buildingId: string;
  category: EquipmentCategory;
  name: string;
  brand?: string | null;
  model?: string | null;
  installedAt?: string | null;
  lastServiceAt?: string | null;
  nextServiceAt?: string | null;
  warrantyUntil?: string | null;
  health: PassportHealth;
  confidence: DataConfidence;
  notes?: string | null;
  createdAt?: string;
}

export interface PassportDocument {
  id: string;
  buildingId: string;
  equipmentId?: string | null;
  missionId?: string | null;
  kind: PassportDocumentKind;
  name: string;
  url: string;
  issuedAt?: string | null;
  confidence: DataConfidence;
  createdAt?: string;
}

/** Une ligne d'historique : intervention, entretien, travaux ou note. */
export interface PassportEvent {
  id: string;
  buildingId: string;
  equipmentId?: string | null;
  missionId?: string | null;
  kind: PassportEventKind;
  title: string;
  description?: string | null;
  occurredAt: string;
  professionalName?: string | null;
  price?: number | null;
  photoBeforeUrl?: string | null;
  photoAfterUrl?: string | null;
  confidence: DataConfidence;
}

export interface PassportRecommendation {
  id: string;
  buildingId: string;
  equipmentId?: string | null;
  kind: RecommendationKind;
  title: string;
  description?: string | null;
  dueAt?: string | null;
  priority: RecommendationPriority;
  /** Catégorie d'intervention à pré-remplir si le client passe à l'action. */
  suggestedService?: string | null;
}

/** Vue agrégée renvoyée par `GET /passport/buildings/:id`. */
export interface PassportOverview {
  building: Building;
  equipments: PassportEquipment[];
  documents: PassportDocument[];
  events: PassportEvent[];
  recommendations: PassportRecommendation[];
}

export interface BuildingInput {
  label: string;
  address: string;
  city?: string;
  postalCode?: string;
  kind: BuildingKind;
  constructionYear?: number | null;
  surfaceM2?: number | null;
  lat?: number | null;
  lng?: number | null;
  isPrimary?: boolean;
}

export interface EquipmentInput {
  category: EquipmentCategory;
  name: string;
  brand?: string;
  model?: string;
  installedAt?: string | null;
  lastServiceAt?: string | null;
  notes?: string;
}

export interface PassportDocumentInput {
  kind: PassportDocumentKind;
  name: string;
  url: string;
  equipmentId?: string | null;
  issuedAt?: string | null;
}

export interface PassportEventInput {
  kind: PassportEventKind;
  title: string;
  description?: string;
  occurredAt?: string;
  professionalName?: string;
  price?: number;
}

export interface PassportTransferInput {
  email: string;
  keepAccess?: boolean;
}

export interface PassportTransferResult {
  message: string;
  transferredAt: string | null;
  keepAccess: boolean;
  newOwner: {
    email: string | null;
    firstName: string | null;
    lastName: string | null;
  };
}

/**
 * Les endpoints Passeport peuvent ne pas encore exister côté backend.
 * Le BFF renvoie alors `backendReady: false` au lieu d'une erreur, pour que
 * l'interface reste utilisable en lecture seule.
 */
export interface BuildingsListResponse {
  items: Building[];
  backendReady: boolean;
}

export interface PassportOverviewResponse extends Partial<PassportOverview> {
  backendReady: boolean;
}
