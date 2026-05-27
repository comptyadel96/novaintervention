import type { AuthUser, Profile } from "@/types/domain";
import { validatePhone } from "@/lib/forms/validate";
import { resolveProfilePhone } from "@/lib/auth/resolve-phone";

export function hasProfilePhone(
  user: AuthUser,
  profile?: Profile | null,
): boolean {
  return validatePhone(resolveProfilePhone(user, profile)).valid;
}

export function hasProfileLocation(profile?: Profile | null): boolean {
  if (!profile) return false;
  const { latitude, longitude } = profile;
  return (
    latitude != null &&
    longitude != null &&
    Number.isFinite(latitude) &&
    Number.isFinite(longitude)
  );
}

export function isProfileComplete(
  user: AuthUser,
  profile?: Profile | null,
): boolean {
  return hasProfilePhone(user, profile) && hasProfileLocation(profile);
}

export type ProfileCompletionField = "phone" | "location";

export function missingProfileFields(
  user: AuthUser,
  profile?: Profile | null,
): ProfileCompletionField[] {
  const missing: ProfileCompletionField[] = [];
  if (!hasProfilePhone(user, profile)) missing.push("phone");
  if (!hasProfileLocation(profile)) missing.push("location");
  return missing;
}
