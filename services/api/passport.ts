import { bffDownload, bffFetch } from "@/lib/api/bff-client";
import type {
  Building,
  BuildingInput,
  BuildingsListResponse,
  EquipmentInput,
  PassportDocument,
  PassportDocumentInput,
  PassportEquipment,
  PassportEvent,
  PassportEventInput,
  PassportOverviewResponse,
  PassportTransferInput,
  PassportTransferResult,
} from "@/types/passport";

export const passportApi = {
  listBuildings() {
    return bffFetch<BuildingsListResponse>("/api/passport/buildings");
  },

  createBuilding(data: BuildingInput) {
    return bffFetch<Building>("/api/passport/buildings", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  getBuilding(id: string) {
    return bffFetch<PassportOverviewResponse>(
      `/api/passport/buildings/${id}`,
    );
  },

  updateBuilding(id: string, data: Partial<BuildingInput>) {
    return bffFetch<Building>(`/api/passport/buildings/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  deleteBuilding(id: string) {
    return bffFetch<void>(`/api/passport/buildings/${id}`, {
      method: "DELETE",
    });
  },

  addEquipment(buildingId: string, data: EquipmentInput) {
    return bffFetch<PassportEquipment>(
      `/api/passport/buildings/${buildingId}/equipments`,
      { method: "POST", body: JSON.stringify(data) },
    );
  },

  updateEquipment(equipmentId: string, data: Partial<EquipmentInput>) {
    return bffFetch<PassportEquipment>(
      `/api/passport/equipments/${equipmentId}`,
      { method: "PATCH", body: JSON.stringify(data) },
    );
  },

  deleteEquipment(equipmentId: string) {
    return bffFetch<void>(`/api/passport/equipments/${equipmentId}`, {
      method: "DELETE",
    });
  },

  addDocument(buildingId: string, data: PassportDocumentInput) {
    return bffFetch<PassportDocument>(
      `/api/passport/buildings/${buildingId}/documents`,
      { method: "POST", body: JSON.stringify(data) },
    );
  },

  deleteDocument(documentId: string) {
    return bffFetch<void>(`/api/passport/documents/${documentId}`, {
      method: "DELETE",
    });
  },

  addEvent(buildingId: string, data: PassportEventInput) {
    return bffFetch<PassportEvent>(
      `/api/passport/buildings/${buildingId}/events`,
      { method: "POST", body: JSON.stringify(data) },
    );
  },

  transferBuilding(buildingId: string, data: PassportTransferInput) {
    return bffFetch<PassportTransferResult>(
      `/api/passport/buildings/${buildingId}/transfer`,
      { method: "POST", body: JSON.stringify(data) },
    );
  },

  exportBuilding(buildingId: string, format: "json" | "pdf") {
    return bffDownload(
      `/api/passport/buildings/${buildingId}/export?format=${format}`,
      `passeport-nova.${format}`,
    );
  },
};
