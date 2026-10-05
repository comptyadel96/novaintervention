import type {
  Building,
  BuildingKind,
  BuildingMemberRole,
  DataConfidence,
  EquipmentCategory,
  PassportDocument,
  PassportDocumentKind,
  PassportEquipment,
  PassportEvent,
  PassportEventKind,
  PassportHealth,
  PassportOverview,
  PassportRecommendation,
  RecommendationKind,
  RecommendationPriority,
} from "@/types/passport";

type RawRecord = Record<string, unknown>;

function str(v: unknown): string | undefined {
  return typeof v === "string" && v.length > 0 ? v : undefined;
}

function num(v: unknown): number | undefined {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string" && v.trim() !== "") {
    const parsed = Number(v);
    if (Number.isFinite(parsed)) return parsed;
  }
  return undefined;
}

function bool(v: unknown): boolean | undefined {
  return typeof v === "boolean" ? v : undefined;
}

function pick<T extends string>(
  value: unknown,
  allowed: readonly T[],
  fallback: T,
): T {
  return allowed.includes(value as T) ? (value as T) : fallback;
}

const MEMBER_ROLES = [
  "owner",
  "occupant",
  "viewer",
] as const satisfies readonly BuildingMemberRole[];

const BUILDING_KINDS = [
  "apartment",
  "house",
  "building",
  "commercial",
  "other",
] as const satisfies readonly BuildingKind[];

const HEALTHS = [
  "up_to_date",
  "watch",
  "action_required",
] as const satisfies readonly PassportHealth[];

const CONFIDENCES = [
  "declared",
  "confirmed",
  "proven",
  "reinforced",
] as const satisfies readonly DataConfidence[];

const EQUIPMENT_CATEGORIES = [
  "heating",
  "water_heater",
  "air_conditioning",
  "ventilation",
  "roof",
  "plumbing",
  "electrical",
  "other",
] as const satisfies readonly EquipmentCategory[];

const DOCUMENT_KINDS = [
  "invoice",
  "warranty",
  "manual",
  "diagnostic",
  "photo",
  "other",
] as const satisfies readonly PassportDocumentKind[];

const EVENT_KINDS = [
  "intervention",
  "maintenance",
  "works",
  "note",
] as const satisfies readonly PassportEventKind[];

const RECOMMENDATION_KINDS = [
  "maintenance",
  "check",
  "replacement",
] as const satisfies readonly RecommendationKind[];

const PRIORITIES = [
  "low",
  "medium",
  "high",
] as const satisfies readonly RecommendationPriority[];

export function mapBuilding(raw: RawRecord): Building {
  return {
    id: String(raw.id ?? ""),
    label:
      str(raw.label) ??
      str(raw.name) ??
      str(raw.title) ??
      "Mon bâtiment",
    address: str(raw.address) ?? str(raw.location) ?? "",
    city: str(raw.city) ?? null,
    postalCode: str(raw.postalCode) ?? str(raw.postal_code) ?? null,
    kind: pick(
      raw.kind ?? raw.type ?? raw.buildingType,
      BUILDING_KINDS,
      "apartment",
    ),
    constructionYear:
      num(raw.constructionYear) ?? num(raw.construction_year) ?? num(raw.year) ?? null,
    surfaceM2: num(raw.surfaceM2) ?? num(raw.surface_m2) ?? num(raw.surface) ?? null,
    lat: num(raw.latitude) ?? num(raw.lat) ?? null,
    lng: num(raw.longitude) ?? num(raw.lng) ?? null,
    photoUrl: str(raw.photoUrl) ?? str(raw.photo_url) ?? null,
    isPrimary: bool(raw.isPrimary) ?? bool(raw.is_primary) ?? false,
    role:
      raw.role == null
        ? null
        : pick(raw.role, MEMBER_ROLES, "owner"),
    completeness: num(raw.completeness),
    health: pick(raw.health ?? raw.state ?? raw.status, HEALTHS, "up_to_date"),
    equipmentsCount: num(raw.equipmentsCount) ?? num(raw.equipments_count),
    documentsCount: num(raw.documentsCount) ?? num(raw.documents_count),
    eventsCount: num(raw.eventsCount) ?? num(raw.events_count),
    createdAt: str(raw.createdAt) ?? str(raw.created_at),
    updatedAt: str(raw.updatedAt) ?? str(raw.updated_at),
  };
}

export function mapEquipment(raw: RawRecord, buildingId = ""): PassportEquipment {
  return {
    id: String(raw.id ?? ""),
    buildingId:
      str(raw.buildingId) ?? str(raw.building_id) ?? buildingId,
    category: pick(
      raw.category ?? raw.type,
      EQUIPMENT_CATEGORIES,
      "other",
    ),
    name: str(raw.name) ?? str(raw.label) ?? "Équipement",
    brand: str(raw.brand) ?? null,
    model: str(raw.model) ?? null,
    installedAt: str(raw.installedAt) ?? str(raw.installed_at) ?? null,
    lastServiceAt: str(raw.lastServiceAt) ?? str(raw.last_service_at) ?? null,
    nextServiceAt: str(raw.nextServiceAt) ?? str(raw.next_service_at) ?? null,
    warrantyUntil: str(raw.warrantyUntil) ?? str(raw.warranty_until) ?? null,
    health: pick(raw.health ?? raw.state, HEALTHS, "up_to_date"),
    confidence: pick(
      raw.confidence ?? raw.confidenceLevel ?? raw.confidence_level,
      CONFIDENCES,
      "declared",
    ),
    notes: str(raw.notes) ?? null,
    createdAt: str(raw.createdAt) ?? str(raw.created_at),
  };
}

export function mapDocument(raw: RawRecord, buildingId = ""): PassportDocument {
  return {
    id: String(raw.id ?? ""),
    buildingId: str(raw.buildingId) ?? str(raw.building_id) ?? buildingId,
    equipmentId: str(raw.equipmentId) ?? str(raw.equipment_id) ?? null,
    missionId: str(raw.missionId) ?? str(raw.mission_id) ?? null,
    kind: pick(raw.kind ?? raw.type, DOCUMENT_KINDS, "other"),
    name: str(raw.name) ?? str(raw.fileName) ?? "Document",
    url: str(raw.url) ?? str(raw.fileUrl) ?? str(raw.file_url) ?? "",
    issuedAt: str(raw.issuedAt) ?? str(raw.issued_at) ?? null,
    confidence: pick(raw.confidence, CONFIDENCES, "proven"),
    createdAt: str(raw.createdAt) ?? str(raw.created_at),
  };
}

export function mapEvent(raw: RawRecord, buildingId = ""): PassportEvent {
  return {
    id: String(raw.id ?? ""),
    buildingId: str(raw.buildingId) ?? str(raw.building_id) ?? buildingId,
    equipmentId: str(raw.equipmentId) ?? str(raw.equipment_id) ?? null,
    missionId: str(raw.missionId) ?? str(raw.mission_id) ?? null,
    kind: pick(raw.kind ?? raw.type, EVENT_KINDS, "intervention"),
    title: str(raw.title) ?? "Intervention",
    description: str(raw.description) ?? null,
    occurredAt:
      str(raw.occurredAt) ??
      str(raw.occurred_at) ??
      str(raw.createdAt) ??
      str(raw.created_at) ??
      new Date().toISOString(),
    professionalName:
      str(raw.professionalName) ??
      str(raw.professional_name) ??
      str(raw.artisanName) ??
      null,
    price: num(raw.price) ?? num(raw.priceFinal) ?? null,
    photoBeforeUrl:
      str(raw.photoBeforeUrl) ?? str(raw.photo_before_url) ?? null,
    photoAfterUrl: str(raw.photoAfterUrl) ?? str(raw.photo_after_url) ?? null,
    confidence: pick(raw.confidence, CONFIDENCES, "confirmed"),
  };
}

export function mapRecommendation(
  raw: RawRecord,
  buildingId = "",
): PassportRecommendation {
  return {
    id: String(raw.id ?? ""),
    buildingId: str(raw.buildingId) ?? str(raw.building_id) ?? buildingId,
    equipmentId: str(raw.equipmentId) ?? str(raw.equipment_id) ?? null,
    kind: pick(raw.kind ?? raw.type, RECOMMENDATION_KINDS, "maintenance"),
    title: str(raw.title) ?? "Action recommandée",
    description: str(raw.description) ?? null,
    dueAt: str(raw.dueAt) ?? str(raw.due_at) ?? null,
    priority: pick(raw.priority, PRIORITIES, "medium"),
    suggestedService:
      str(raw.suggestedService) ?? str(raw.suggested_service) ?? null,
  };
}

function asArray(value: unknown): RawRecord[] {
  if (Array.isArray(value)) return value as RawRecord[];
  if (value && typeof value === "object") {
    const items = (value as RawRecord).items;
    if (Array.isArray(items)) return items as RawRecord[];
  }
  return [];
}

export function mapBuildingList(data: unknown): Building[] {
  return asArray(data).map(mapBuilding);
}

/** Accepte aussi bien `{ building, equipments… }` qu'un bâtiment à plat. */
export function mapPassportOverview(data: unknown): PassportOverview {
  const raw = (data ?? {}) as RawRecord;
  const buildingRaw = (raw.building ?? raw) as RawRecord;
  const building = mapBuilding(buildingRaw);

  return {
    building,
    equipments: asArray(raw.equipments ?? buildingRaw.equipments).map((item) =>
      mapEquipment(item, building.id),
    ),
    documents: asArray(raw.documents ?? buildingRaw.documents).map((item) =>
      mapDocument(item, building.id),
    ),
    events: asArray(raw.events ?? raw.history ?? buildingRaw.events).map(
      (item) => mapEvent(item, building.id),
    ),
    recommendations: asArray(
      raw.recommendations ?? buildingRaw.recommendations,
    ).map((item) => mapRecommendation(item, building.id)),
  };
}
