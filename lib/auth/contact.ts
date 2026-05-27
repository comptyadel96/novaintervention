import type { AuthUser } from "@/types/domain";

/** Email vérifié OU téléphone vérifié (règle métier backend). */
export function hasVerifiedContact(user: AuthUser): boolean {
  return user.emailVerified === true || user.phoneVerified === true;
}
