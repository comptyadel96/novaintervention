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
  PartnerApplication,
  PartnerApplicationStatus,
} from "@/types/domain";
import { bffFetch } from "@/lib/api/bff-client";

export const clientProfilesApi = {
  list() {
    return bffFetch<Profile[]>("/api/profiles");
  },

  updateMe(data: UpdateProfileInput) {
    return bffFetch<Profile>("/api/profiles/me", {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  setVerification(profileId: string, status: "approved" | "rejected") {
    return bffFetch<Profile>(`/api/profiles/${profileId}/verification`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },

  uploadAvatar(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    return bffFetch<Profile>("/api/profiles/me/avatar", {
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
    return bffFetch<Mission[]>(`/api/missions${missionQuery(filters)}`);
  },

  create(data: CreateMissionInput & Record<string, unknown>) {
    return bffFetch<Mission>("/api/missions", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update(id: string, data: Partial<Mission>) {
    return bffFetch<Mission>(`/api/missions/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  accept(id: string) {
    return bffFetch<Mission>(`/api/missions/${id}/accept`, {
      method: "POST",
    });
  },

  start(id: string) {
    return bffFetch<Mission>(`/api/missions/${id}/start`, {
      method: "POST",
    });
  },

  enRoute(id: string) {
    return bffFetch<Mission>(`/api/missions/${id}/en-route`, {
      method: "POST",
    });
  },

  completeWork(
    id: string,
    payload: { photoAfterUrl: string; priceFinal?: number },
  ) {
    return bffFetch<Mission>(`/api/missions/${id}/complete-work`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  confirmClient(id: string) {
    return bffFetch<Mission>(`/api/missions/${id}/confirm-client`, {
      method: "POST",
    });
  },

  confirmArtisan(id: string) {
    return bffFetch<Mission>(`/api/missions/${id}/confirm-artisan`, {
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
    return bffFetch<{ url: string; publicId?: string }>(
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
    return bffFetch<{
      items: AppNotification[];
      unreadCount: number;
      total: number;
    }>(`/api/notifications${query ? `?${query}` : ""}`);
  },

  unreadCount() {
    return bffFetch<{ unreadCount: number }>(
      "/api/notifications/unread-count",
    );
  },

  markRead(id: string) {
    return bffFetch<void>(`/api/notifications/${id}/read`, {
      method: "PATCH",
    });
  },

  markAllRead() {
    return bffFetch<void>("/api/notifications/read-all", {
      method: "PATCH",
    });
  },
};

export const clientClientsApi = {
  getStats() {
    return bffFetch<ClientStats>("/api/clients/me/stats");
  },
};

export const clientAdminApi = {
  getDashboard() {
    return bffFetch<AdminDashboard>("/api/admin/dashboard");
  },

  getAccounting(params: {
    period: AccountingPeriod;
    from?: string;
    to?: string;
  }) {
    const q = new URLSearchParams({ period: params.period });
    if (params.from) q.set("from", params.from);
    if (params.to) q.set("to", params.to);
    return bffFetch<AdminAccounting>(`/api/admin/accounting?${q}`);
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
    return bffFetch<{ items: AdminUser[]; total?: number }>(
      `/api/admin/users${query ? `?${query}` : ""}`,
    );
  },

  banUser(userId: string, reason: string) {
    return bffFetch<void>(`/api/admin/users/${userId}/ban`, {
      method: "PATCH",
      body: JSON.stringify({ reason }),
    });
  },

  unbanUser(userId: string) {
    return bffFetch<void>(`/api/admin/users/${userId}/unban`, {
      method: "PATCH",
    });
  },

  listMissions(params?: { status?: MissionStatus; page?: number; limit?: number }) {
    const q = new URLSearchParams();
    if (params?.status) q.set("status", params.status);
    if (params?.page) q.set("page", String(params.page));
    if (params?.limit) q.set("limit", String(params.limit));
    const query = q.toString();
    return bffFetch<Mission[]>(`/api/admin/missions${query ? `?${query}` : ""}`);
  },

  listPartnerApplications(params?: { status?: PartnerApplicationStatus }) {
    const q = new URLSearchParams();
    if (params?.status) q.set("status", params.status);
    const query = q.toString();
    return bffFetch<{ items: PartnerApplication[] }>(
      `/api/admin/partner-applications${query ? `?${query}` : ""}`,
    );
  },

  updatePartnerApplication(
    id: string,
    data: { status: PartnerApplicationStatus; adminNote?: string },
  ) {
    return bffFetch<{ application: PartnerApplication }>(
      `/api/admin/partner-applications/${id}`,
      {
        method: "PATCH",
        body: JSON.stringify(data),
      },
    );
  },
};
