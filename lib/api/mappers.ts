import type { Mission, MissionStatus, Profile, AuthUser } from "@/types/domain";

type RawRecord = Record<string, unknown>;

function str(v: unknown): string | undefined {
  return typeof v === "string" ? v : undefined;
}

function num(v: unknown): number | undefined {
  return typeof v === "number" ? v : undefined;
}

export function mapMissionFromApi(raw: RawRecord): Mission {
  const artisanRaw = raw.artisan as RawRecord | undefined;
  return {
    id: String(raw.id),
    title: String(raw.title ?? ""),
    status: (raw.status as MissionStatus) ?? "pending",
    customer_id: str(raw.customerId) ?? str(raw.customer_id),
    artisan_id: (str(raw.artisanId) ?? str(raw.artisan_id) ?? null) as
      | string
      | null
      | undefined,
    customer_name:
      str(raw.customerName) ??
      str(raw.customer_name) ??
      str(raw.clientName),
    customer_phone: str(raw.customerPhone) ?? str(raw.customer_phone),
    location:
      str(raw.location) ??
      str(raw.address) ??
      ([str(raw.city), str(raw.postalCode)].filter(Boolean).join(" ") ||
        undefined),
    description: str(raw.description),
    price:
      num(raw.priceFinal) ??
      num(raw.price) ??
      (raw.price as number | string | null | undefined),
    price_final: num(raw.priceFinal) ?? num(raw.price_final),
    price_estimate: num(raw.priceEstimate) ?? num(raw.price_estimate),
    platform_fee: num(raw.platformFee) ?? num(raw.platform_fee),
    artisan_payout: num(raw.artisanPayout) ?? num(raw.artisan_payout),
    photo_url:
      str(raw.photoBeforeUrl) ??
      str(raw.photo_url) ??
      str(raw.photo_before),
    photo_before:
      str(raw.photoBeforeUrl) ??
      str(raw.photo_before) ??
      str(raw.photo_url),
    photo_after: str(raw.photoAfterUrl) ?? str(raw.photo_after),
    lat: num(raw.latitude) ?? num(raw.lat),
    lng: num(raw.longitude) ?? num(raw.lng),
    urgency: str(raw.urgency) ?? str(raw.niveau_urgence),
    scheduled_at:
      str(raw.scheduledAt) ??
      str(raw.scheduled_at) ??
      null,
    created_at: str(raw.createdAt) ?? str(raw.created_at),
    completed_at: str(raw.completedAt) ?? str(raw.completed_at),
    artisan: artisanRaw
      ? {
          first_name:
            str(artisanRaw.firstName) ?? str(artisanRaw.first_name),
          last_name:
            str(artisanRaw.lastName) ?? str(artisanRaw.last_name),
        }
      : undefined,
  };
}

export function mapMissionsFromApi(data: unknown): Mission[] {
  if (!Array.isArray(data)) return [];
  return data.map((item) => mapMissionFromApi(item as RawRecord));
}

export function mapMissionFromApiSingle(data: unknown): Mission {
  if (data && typeof data === "object" && "mission" in (data as RawRecord)) {
    return mapMissionFromApi((data as RawRecord).mission as RawRecord);
  }
  return mapMissionFromApi(data as RawRecord);
}

export function mapProfileFromApi(
  raw: RawRecord,
  fallbackRole?: Profile["role"],
): Profile {
  const userNested = raw.user as RawRecord | undefined;
  const verified =
    raw.is_verified === true ||
    raw.isVerified === true ||
    raw.verificationStatus === "approved" ||
    raw.verification_status === "approved";

  const role =
    (raw.role as Profile["role"] | undefined) ??
    (userNested?.role as Profile["role"] | undefined) ??
    fallbackRole ??
    "client";

  return {
    id: String(raw.id ?? raw.userId ?? raw.user_id),
    email: String(raw.email ?? userNested?.email ?? ""),
    first_name: str(raw.firstName) ?? str(raw.first_name),
    last_name: str(raw.lastName) ?? str(raw.last_name),
    phone:
      str(raw.phone) ??
      str(userNested?.phone) ??
      str(raw.phoneNumber) ??
      str(raw.phone_number) ??
      str(raw.mobile),
    role,
    city: str(raw.city),
    address:
      str(raw.address) ??
      str(raw.addressLine) ??
      str(raw.address_line) ??
      str(raw.location),
    specialty:
      str(raw.trade) ?? str(raw.specialty) ?? str(raw.category),
    is_verified: verified,
    avatar_url: str(raw.avatarUrl) ?? str(raw.avatar_url),
    latitude: num(raw.latitude) ?? num(raw.lat),
    longitude: num(raw.longitude) ?? num(raw.lng),
    created_at: str(raw.createdAt) ?? str(raw.created_at),
  };
}

export function mapSessionFromApi(data: RawRecord): {
  user: AuthUser;
  profile: Profile | null;
} {
  const userRaw = (data.user ?? data) as RawRecord;
  const profileRaw = data.profile as RawRecord | undefined;

  const emailVerified =
    userRaw.emailVerified === true ||
    userRaw.email_verified === true;

  const user: AuthUser = {
    id: String(userRaw.id),
    email: String(userRaw.email),
    firstName: str(userRaw.firstName) ?? str(userRaw.first_name),
    lastName: str(userRaw.lastName) ?? str(userRaw.last_name),
    phone:
      str(userRaw.phone) ??
      str(userRaw.phoneNumber) ??
      str(userRaw.phone_number) ??
      str(userRaw.mobile),
    role: (userRaw.role as AuthUser["role"]) ?? "client",
    emailVerified:
      userRaw.emailVerified === false || userRaw.email_verified === false
        ? false
        : emailVerified || undefined,
    emailVerifiedAt:
      str(userRaw.emailVerifiedAt) ?? str(userRaw.email_verified_at) ?? null,
    phoneVerified:
      userRaw.phoneVerified === true || userRaw.phone_verified === true
        ? true
        : userRaw.phoneVerified === false || userRaw.phone_verified === false
          ? false
          : undefined,
    isBanned:
      userRaw.isBanned === true ||
      userRaw.is_banned === true ||
      userRaw.banned === true,
    authProvider: str(userRaw.authProvider) ?? str(userRaw.auth_provider),
    hasPassword:
      userRaw.hasPassword === true || userRaw.has_password === true
        ? true
        : userRaw.hasPassword === false || userRaw.has_password === false
          ? false
          : undefined,
    hasGoogle:
      userRaw.hasGoogle === true || userRaw.has_google === true
        ? true
        : userRaw.hasGoogle === false || userRaw.has_google === false
          ? false
          : undefined,
    avatarUrl: str(userRaw.avatarUrl) ?? str(userRaw.avatar_url),
    picture: str(userRaw.picture) ?? str(userRaw.photoURL),
    city: str(userRaw.city),
    availability: str(userRaw.availability),
    settings: userRaw.settings as AuthUser["settings"],
  };

  if (!userRaw.role && profileRaw?.user) {
    const nested = profileRaw.user as RawRecord;
    if (nested.role) {
      user.role = nested.role as AuthUser["role"];
    }
  }

  let profile = profileRaw
    ? mapProfileFromApi(profileRaw, user.role)
    : null;

  if (profile && !profile.phone?.trim() && user.phone?.trim()) {
    profile = { ...profile, phone: user.phone };
  }

  return { user, profile };
}

export type CreateMissionBackendPayload = {
  title: string;
  description?: string;
  category?: string;
  latitude?: number;
  longitude?: number;
  city?: string;
  photoBeforeUrl?: string;
  customerName?: string;
  customerPhone?: string;
  priceFinal?: number;
  urgency?: string;
  status?: string;
};

export function mapMissionToCreate(
  input: Record<string, unknown>,
): CreateMissionBackendPayload {
  const typeIntervention = str(input.type_intervention);
  const category =
    typeIntervention?.replace("services__", "").replace(/_/g, " ") ??
    "plomberie";

  return {
    title: String(input.title ?? category),
    description: str(input.description),
    category,
    latitude: num(input.lat) ?? num(input.latitude),
    longitude: num(input.lng) ?? num(input.longitude),
    city: str(input.location) ?? str(input.city),
    photoBeforeUrl:
      str(input.photoBeforeUrl) ??
      str(input.photo_url) ??
      str(input.photo_before),
    customerName: str(input.customer_name) ?? str(input.customerName),
    customerPhone: str(input.customer_phone) ?? str(input.customerPhone),
    priceFinal: num(input.price) ?? num(input.priceFinal),
    urgency: str(input.niveau_urgence) ?? str(input.urgency),
    status: str(input.status) ?? "pending",
  };
}

export function mapProfileToPatch(
  input: Record<string, unknown>,
): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  if (input.first_name !== undefined) out.firstName = input.first_name;
  if (input.firstName !== undefined) out.firstName = input.firstName;
  if (input.last_name !== undefined) out.lastName = input.last_name;
  if (input.lastName !== undefined) out.lastName = input.lastName;
  if (input.phone !== undefined) out.phone = input.phone;
  if (input.city !== undefined) out.city = input.city;
  if (input.address !== undefined) out.address = input.address;
  if (input.specialty !== undefined) out.trade = input.specialty;
  if (input.trade !== undefined) out.trade = input.trade;
  if (input.availability !== undefined) out.availability = input.availability;
  if (input.latitude !== undefined) out.latitude = input.latitude;
  if (input.longitude !== undefined) out.longitude = input.longitude;
  if (input.lat !== undefined) out.latitude = input.lat;
  if (input.lng !== undefined) out.longitude = input.lng;
  if (input.last_name !== undefined && !out.lastName)
    out.lastName = input.last_name;
  if (input.settings !== undefined) out.settings = input.settings;
  return out;
}
