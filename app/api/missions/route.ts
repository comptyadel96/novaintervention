import { NextResponse } from "next/server";
import {
  mapMissionToCreate,
  mapMissionsFromApi,
  mapMissionFromApiSingle,
} from "@/lib/api/mappers";
import { apiRequestWithAuth } from "@/lib/auth/refresh";
import { apiErrorJson } from "@/lib/api/errors";
import type { MissionStatus } from "@/types/domain";

function parseFilters(searchParams: URLSearchParams) {
  return {
    customerId: searchParams.get("customer_id") ?? undefined,
    artisanId: searchParams.get("artisan_id") ?? undefined,
    role: searchParams.get("role") ?? undefined,
    status: (searchParams.get("status") as MissionStatus) ?? undefined,
    unassigned: searchParams.get("unassigned") === "true" ? "true" : undefined,
    nearLat: searchParams.get("near_lat") ?? undefined,
    nearLng: searchParams.get("near_lng") ?? undefined,
    radiusKm: searchParams.get("radius_km") ?? undefined,
    page: searchParams.get("page") ?? undefined,
    limit: searchParams.get("limit") ?? undefined,
  };
}

function buildQuery(filters: ReturnType<typeof parseFilters>) {
  const params = new URLSearchParams();
  if (filters.customerId) params.set("customerId", filters.customerId);
  if (filters.artisanId) params.set("artisanId", filters.artisanId);
  if (filters.role) params.set("role", filters.role);
  if (filters.status) params.set("status", filters.status);
  if (filters.unassigned) params.set("unassigned", filters.unassigned);
  if (filters.nearLat) params.set("nearLat", filters.nearLat);
  if (filters.nearLng) params.set("nearLng", filters.nearLng);
  if (filters.radiusKm) params.set("radiusKm", filters.radiusKm);
  if (filters.page) params.set("page", filters.page);
  if (filters.limit) params.set("limit", filters.limit);
  const q = params.toString();
  return q ? `?${q}` : "";
}

export async function GET(request: Request) {
  const filters = parseFilters(new URL(request.url).searchParams);

  try {
    const data = await apiRequestWithAuth<unknown>(
      `/missions${buildQuery(filters)}`,
    );
    const items = Array.isArray(data)
      ? data
      : (data as { items?: unknown[] })?.items ?? [];
    return NextResponse.json(mapMissionsFromApi(items));
  } catch (error) {
    const { message, status, code } = apiErrorJson(
      error,
      "Missions inaccessibles.",
    );
    return NextResponse.json({ message, code }, { status });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payload = mapMissionToCreate(body);
    const data = await apiRequestWithAuth<unknown>("/missions", {
      method: "POST",
      body: payload,
    });
    return NextResponse.json(mapMissionFromApiSingle(data), { status: 201 });
  } catch (error) {
    const { message, status, code } = apiErrorJson(
      error,
      "Création impossible.",
    );
    return NextResponse.json({ message, code }, { status });
  }
}
