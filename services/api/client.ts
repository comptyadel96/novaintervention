import type {
  CreateMissionInput,
  Mission,
  MissionStatus,
  Profile,
  UpdateProfileInput,
  AdminDashboard,
  AdminAccounting,
  AdminUser,
  ClientStats,
  AccountingPeriod,
} from "@/types/domain";
import { ApiError } from "@/lib/api/errors";

async function tryRefreshSession(): Promise<boolean> {
  const res = await fetch("/api/auth/refresh", {
    method: "POST",
    credentials: "include",
  });
  return res.ok;
}

async function clientFetch<T>(
  path: string,
  options: RequestInit = {},
  retried = false,
): Promise<T> {
  const response = await fetch(path, {
    ...options,
    credentials: "include",
    headers: {
      ...(options.body instanceof FormData
        ? {}
        : { "Content-Type": "application/json" }),
      ...options.headers,
    },
  });

  if (response.status === 401 && !retried) {
    const refreshed = await tryRefreshSession();
    if (refreshed) {
      return clientFetch<T>(path, options, true);
    }
  }

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new ApiError(
      (payload as { message?: string }).message ??
        "Une erreur est survenue.",
      response.status,
      (payload as { code?: string }).code,
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export const clientProfilesApi = {
  list() {
    return clientFetch<Profile[]>("/api/profiles");
  },

  updateMe(data: UpdateProfileInput) {
    return clientFetch<Profile>("/api/profiles/me", {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  setVerification(profileId: string, status: "approved" | "rejected") {
    return clientFetch<Profile>(`/api/profiles/${profileId}/verification`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },

  uploadAvatar(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    return clientFetch<Profile>("/api/profiles/me/avatar", {
      method: "POST",
      body: formData,
    });
  },
};

function missionQuery(filters: {
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
}) {
  const params = new URLSearchParams();
  if (filters.customer_id) params.set("customer_id", filters.customer_id);
  if (filters.artisan_id) params.set("artisan_id", filters.artisan_id);
  if (filters.role) params.set("role", filters.role);
  if (filters.status) params.set("status", filters.status);
  if (filters.unassigned) params.set("unassigned", "true");
  if (filters.near_lat != null)
    params.set("near_lat", String(filters.near_lat));
  if (filters.near_lng != null)
    params.set("near_lng", String(filters.near_lng));
  if (filters.radius_km != null)
    params.set("radius_km", String(filters.radius_km));
  if (filters.page != null) params.set("page", String(filters.page));
  if (filters.limit != null) params.set("limit", String(filters.limit));
  const query = params.toString();
  return query ? `?${query}` : "";
}

export const clientMissionsApi = {
  list(
    filters: {
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
    } = {},
  ) {
    return clientFetch<Mission[]>(`/api/missions${missionQuery(filters)}`);
  },

  create(data: CreateMissionInput & Record<string, unknown>) {
    return clientFetch<Mission>("/api/missions", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update(id: string, data: Partial<Mission>) {
    return clientFetch<Mission>(`/api/missions/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  accept(id: string) {
    return clientFetch<Mission>(`/api/missions/${id}/accept`, {
      method: "POST",
    });
  },

  start(id: string) {
    return clientFetch<Mission>(`/api/missions/${id}/start`, {
      method: "POST",
    });
  },

  enRoute(id: string) {
    return clientFetch<Mission>(`/api/missions/${id}/en-route`, {
      method: "POST",
    });
  },

  completeWork(
    id: string,
    payload: { photoAfterUrl: string; priceFinal?: number },
  ) {
    return clientFetch<Mission>(`/api/missions/${id}/complete-work`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  confirmClient(id: string) {
    return clientFetch<Mission>(`/api/missions/${id}/confirm-client`, {
      method: "POST",
    });
  },

  confirmArtisan(id: string) {
    return clientFetch<Mission>(`/api/missions/${id}/confirm-artisan`, {
      method: "POST",
    });
  },

  invoicePdfUrl(id: string) {
    return `/api/missions/${id}/invoice`;
  },
};

export const clientUploadsApi = {
  uploadInterventionPhoto(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    return clientFetch<{ url: string; publicId?: string }>(
      "/api/uploads/interventions",
      {
        method: "POST",
        body: formData,
      },
    );
  },
};

export type AppNotification = {
  id: string;
  type: string;
  title: string;
  body: string;
  data?: Record<string, unknown>;
  read: boolean;
  createdAt: string;
};

export const clientNotificationsApi = {
  list(params?: { unreadOnly?: boolean; page?: number; limit?: number }) {
    const q = new URLSearchParams();
    if (params?.unreadOnly) q.set("unreadOnly", "true");
    if (params?.page) q.set("page", String(params.page));
    if (params?.limit) q.set("limit", String(params.limit));
    const query = q.toString();
    return clientFetch<{
      items: AppNotification[];
      unreadCount: number;
      total: number;
    }>(`/api/notifications${query ? `?${query}` : ""}`);
  },

  unreadCount() {
    return clientFetch<{ unreadCount: number }>(
      "/api/notifications/unread-count",
    );
  },

  markRead(id: string) {
    return clientFetch<void>(`/api/notifications/${id}/read`, {
      method: "PATCH",
    });
  },

  markAllRead() {
    return clientFetch<void>("/api/notifications/read-all", {
      method: "PATCH",
    });
  },
};

export const clientClientsApi = {
  getStats() {
    return clientFetch<ClientStats>("/api/clients/me/stats");
  },
};

export const clientAdminApi = {
  getDashboard() {
    return clientFetch<AdminDashboard>("/api/admin/dashboard");
  },

  getAccounting(params: {
    period: AccountingPeriod;
    from?: string;
    to?: string;
  }) {
    const q = new URLSearchParams({ period: params.period });
    if (params.from) q.set("from", params.from);
    if (params.to) q.set("to", params.to);
    return clientFetch<AdminAccounting>(`/api/admin/accounting?${q}`);
  },

  listUsers(params?: {
    role?: string;
    banned?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const q = new URLSearchParams();
    if (params?.role) q.set("role", params.role);
    if (params?.banned) q.set("banned", params.banned);
    if (params?.search) q.set("search", params.search);
    if (params?.page) q.set("page", String(params.page));
    if (params?.limit) q.set("limit", String(params.limit));
    const query = q.toString();
    return clientFetch<{ items: AdminUser[]; total?: number }>(
      `/api/admin/users${query ? `?${query}` : ""}`,
    );
  },

  banUser(userId: string, reason: string) {
    return clientFetch<void>(`/api/admin/users/${userId}/ban`, {
      method: "PATCH",
      body: JSON.stringify({ reason }),
    });
  },

  unbanUser(userId: string) {
    return clientFetch<void>(`/api/admin/users/${userId}/unban`, {
      method: "PATCH",
    });
  },

  listMissions(params?: { status?: MissionStatus; page?: number; limit?: number }) {
    const q = new URLSearchParams();
    if (params?.status) q.set("status", params.status);
    if (params?.page) q.set("page", String(params.page));
    if (params?.limit) q.set("limit", String(params.limit));
    const query = q.toString();
    return clientFetch<Mission[]>(`/api/admin/missions${query ? `?${query}` : ""}`);
  },
};
