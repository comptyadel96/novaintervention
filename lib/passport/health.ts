import type {
  Building,
  DataConfidence,
  PassportDocument,
  PassportEquipment,
  PassportEvent,
  PassportHealth,
} from "@/types/passport";

const HEALTH_RANK: Record<PassportHealth, number> = {
  up_to_date: 0,
  watch: 1,
  action_required: 2,
};

/**
 * Complétude du passeport en pourcentage. Le backend peut renvoyer sa propre
 * valeur (`building.completeness`) ; sinon on la calcule ici pour que la barre
 * de progression reste utile en lecture seule.
 */
export function computeCompleteness(
  building: Building,
  equipments: PassportEquipment[],
  documents: PassportDocument[],
  events: PassportEvent[],
): number {
  if (typeof building.completeness === "number") {
    return Math.max(0, Math.min(100, Math.round(building.completeness)));
  }

  const checks = [
    Boolean(building.address),
    Boolean(building.kind),
    Boolean(building.constructionYear),
    Boolean(building.surfaceM2),
    equipments.length > 0,
    equipments.length >= 3,
    documents.length > 0,
    events.length > 0,
  ];

  const done = checks.filter(Boolean).length;
  return Math.round((done / checks.length) * 100);
}

/** État global du bâtiment : le pire état parmi ses équipements. */
export function computeBuildingHealth(
  equipments: PassportEquipment[],
): PassportHealth {
  return equipments.reduce<PassportHealth>((worst, equipment) => {
    return HEALTH_RANK[equipment.health] > HEALTH_RANK[worst]
      ? equipment.health
      : worst;
  }, "up_to_date");
}

/**
 * Renforce le niveau de preuve d'un équipement : une donnée confirmée par un
 * artisan et corroborée par plusieurs événements passe en « confiance renforcée ».
 */
export function reinforceConfidence(
  base: DataConfidence,
  relatedEvents: number,
  hasDocument: boolean,
): DataConfidence {
  if (base === "reinforced") return base;
  if (base === "confirmed" && relatedEvents >= 2) return "reinforced";
  if (hasDocument && base === "declared") return "proven";
  return base;
}

/** Prochaine action utile à afficher sur l'accueil client. */
export function nextActionLabel(
  equipments: PassportEquipment[],
): string | null {
  const upcoming = equipments
    .filter((equipment) => Boolean(equipment.nextServiceAt))
    .sort(
      (a, b) =>
        new Date(a.nextServiceAt as string).getTime() -
        new Date(b.nextServiceAt as string).getTime(),
    );

  const next = upcoming[0];
  if (!next) return null;

  const date = new Date(next.nextServiceAt as string);
  return `${next.name} — entretien prévu le ${date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })}`;
}
