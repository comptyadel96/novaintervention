import type { AuthUser, Profile } from "@/types/domain";

type RawUser = AuthUser & {
  picture?: string;
  avatarUrl?: string;
};

/** URL affichable pour la photo de profil (Cloudinary, Google, etc.). */
export function resolveAvatarUrl(
  user: AuthUser,
  profile?: Profile | null,
): string | undefined {
  const u = user as RawUser;
  const candidates = [
    profile?.avatar_url,
    u.avatarUrl,
    u.picture,
  ];
  for (const url of candidates) {
    if (typeof url === "string" && url.trim().length > 0) {
      return url.trim();
    }
  }
  return undefined;
}

export function avatarInitials(
  user: AuthUser,
  profile?: Profile | null,
): string {
  const first =
    profile?.first_name?.charAt(0) ??
    user.firstName?.charAt(0) ??
    user.email?.charAt(0) ??
    "?";
  const last =
    profile?.last_name?.charAt(0) ?? user.lastName?.charAt(0) ?? "";
  return (first + last).toUpperCase();
}
