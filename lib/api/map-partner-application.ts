import type { PartnerApplication, PartnerApplicationStatus } from "@/types/domain";

type Raw = Record<string, unknown>;

const STATUSES: PartnerApplicationStatus[] = [
  "pending",
  "contacted",
  "approved",
  "rejected",
];

function str(v: unknown): string | undefined {
  return typeof v === "string" ? v : undefined;
}

export function mapPartnerApplication(raw: Raw): PartnerApplication {
  const statusRaw = String(raw.status ?? "pending").toLowerCase();
  const status = STATUSES.includes(statusRaw as PartnerApplicationStatus)
    ? (statusRaw as PartnerApplicationStatus)
    : "pending";

  return {
    id: String(raw.id),
    firstName: str(raw.firstName) ?? str(raw.first_name) ?? "",
    lastName: str(raw.lastName) ?? str(raw.last_name) ?? "",
    phone: str(raw.phone) ?? "",
    email: str(raw.email) ?? null,
    city: str(raw.city) ?? "",
    trade: str(raw.trade) ?? str(raw.specialty) ?? "plomberie",
    status,
    adminNote: str(raw.adminNote) ?? str(raw.admin_note) ?? null,
    createdAt: str(raw.createdAt) ?? str(raw.created_at) ?? "",
    updatedAt: str(raw.updatedAt) ?? str(raw.updated_at),
  };
}

export function mapPartnerApplications(data: unknown): PartnerApplication[] {
  if (Array.isArray(data)) {
    return data.map((item) => mapPartnerApplication(item as Raw));
  }
  const root = data as Raw;
  const items = root.items ?? root.applications ?? root.data;
  if (Array.isArray(items)) {
    return items.map((item) => mapPartnerApplication(item as Raw));
  }
  return [];
}
