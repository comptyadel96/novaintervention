import type { AuthUser, Profile } from "@/types/domain";

export function displayFirstName(
  user: AuthUser,
  profile?: Profile | null,
): string {
  return (
    profile?.first_name ??
    user.firstName ??
    "Utilisateur"
  );
}

export function displayPhone(
  user: AuthUser,
  profile?: Profile | null,
): string {
  return profile?.phone ?? user.phone ?? "Non spécifié";
}

export function resolveRole(
  user: AuthUser,
  profile?: Profile | null,
): AuthUser["role"] {
  // Le rôle canonique est sur User (table users). Le profil Prisma n'a pas de colonne role :
  // ne pas laisser le défaut "client" du mapper écraser user.role.
  return user.role ?? profile?.role ?? "client";
}
