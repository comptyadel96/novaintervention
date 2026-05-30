import type { AuthUser, Profile } from "@/types/domain";
import { resolveRole } from "@/lib/auth/display";
import { isProfileComplete } from "@/lib/auth/profile-completion";

/** Admin : pas de GPS obligatoire. Client / artisan : téléphone + position. */
export function needsProfileCompletion(
  user: AuthUser,
  profile?: Profile | null,
): boolean {
  if (resolveRole(user, profile) === "admin") return false;
  return !isProfileComplete(user, profile);
}
