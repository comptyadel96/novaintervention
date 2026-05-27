import type { MissionStatus } from "@/types/domain";

export const MISSION_STATUS_LABELS: Record<MissionStatus, string> = {
  pending: "En attente",
  confirmed: "Confirmée",
  in_progress: "En cours",
  waiting_confirmation: "Validation client",
  completed: "Terminée",
  cancelled: "Annulée",
};

export function missionStatusClass(status: MissionStatus): string {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-700";
    case "confirmed":
    case "in_progress":
      return "bg-blue-100 text-blue-700";
    case "waiting_confirmation":
      return "bg-orange-100 text-orange-700";
    case "cancelled":
      return "bg-gray-100 text-gray-700";
    default:
      return "bg-orange-100 text-orange-700";
  }
}
