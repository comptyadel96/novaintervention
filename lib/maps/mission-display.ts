import type { Mission } from "@/types/domain";

export function missionUrgencyLabel(mission: Mission): string | null {
  const raw = mission as Mission & {
    urgency?: string;
    niveau_urgence?: string;
  };
  const u = raw.urgency ?? raw.niveau_urgence;
  if (!u) return null;
  const n = u.toLowerCase();
  if (n.includes("urgent") || n === "high") return "Urgent";
  if (n.includes("normal") || n === "medium") return "Normal";
  return u;
}

export function missionPriceLabel(mission: Mission): string {
  const p =
    mission.price_final ??
    mission.price_estimate ??
    mission.price;
  if (p == null || p === "") return "—";
  return `${p} €`;
}

export function missionPhotoUrl(mission: Mission): string | undefined {
  return mission.photo_before ?? mission.photo_url;
}

export function canAcceptOnMap(mission: Mission): boolean {
  return mission.status === "pending" && !mission.artisan_id;
}
