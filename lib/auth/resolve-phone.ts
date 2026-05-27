import type { AuthUser, Profile } from "@/types/domain";

/** Numéro exploitable pour l'UI (profil, user, champs API alternatifs). */
export function resolveProfilePhone(
  user: AuthUser,
  profile?: Profile | null,
): string {
  const fromProfile = profile?.phone?.trim();
  if (fromProfile) return fromProfile;
  return user.phone?.trim() ?? "";
}
