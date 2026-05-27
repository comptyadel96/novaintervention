import { apiRequest } from "@/lib/api/client";
import {
  mapMissionFromApiSingle,
  mapMissionsFromApi,
  mapMissionToCreate,
} from "@/lib/api/mappers";
import type { CreateMissionInput, Mission, MissionStatus } from "@/types/domain";

export type MissionFilters = {
  customer_id?: string;
  artisan_id?: string;
  role?: string;
  status?: MissionStatus;
  unassigned?: boolean;
  near_lat?: number;
  near_lng?: number;
  radius_km?: number;
  page?: number;
  limit?: number;
};

function buildQuery(filters?: MissionFilters): string {
  if (!filters) return "";
  const params = new URLSearchParams();
  if (filters.customer_id) params.set("customerId", filters.customer_id);
  if (filters.artisan_id) params.set("artisanId", filters.artisan_id);
  if (filters.role) params.set("role", filters.role);
  if (filters.status) params.set("status", filters.status);
  if (filters.unassigned) params.set("unassigned", "true");
  if (filters.near_lat != null) params.set("nearLat", String(filters.near_lat));
  if (filters.near_lng != null) params.set("nearLng", String(filters.near_lng));
  if (filters.radius_km != null)
    params.set("radiusKm", String(filters.radius_km));
  if (filters.page != null) params.set("page", String(filters.page));
  if (filters.limit != null) params.set("limit", String(filters.limit));
  const query = params.toString();
  return query ? `?${query}` : "";
}

export const missionsApi = {
  async list(token: string | null, filters?: MissionFilters) {
    const data = await apiRequest<unknown>(`/missions${buildQuery(filters)}`, {
      token,
    });
    const items = Array.isArray(data)
      ? data
      : (data as { items?: unknown[] })?.items ?? [];
    return mapMissionsFromApi(items);
  },

  async getById(token: string, id: string) {
    const data = await apiRequest<unknown>(`/missions/${id}`, { token });
    return mapMissionFromApiSingle(data);
  },

  async create(token: string | null, data: CreateMissionInput) {
    const payload = mapMissionToCreate(
      data as unknown as Record<string, unknown>,
    );
    const result = await apiRequest<unknown>("/missions", {
      method: "POST",
      token,
      body: payload,
    });
    return mapMissionFromApiSingle(result);
  },

  async update(token: string, id: string, data: Partial<Mission>) {
    const result = await apiRequest<unknown>(`/missions/${id}`, {
      method: "PATCH",
      token,
      body: data,
    });
    return mapMissionFromApiSingle(result);
  },
};
