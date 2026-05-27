"use client";

import { useEffect, useState } from "react";
import { resolveAvatarUrl, avatarInitials } from "@/lib/auth/avatar";
import type { AuthUser, Profile } from "@/types/domain";

type Props = {
  user: AuthUser;
  profile?: Profile | null;
  size?: "sm" | "md" | "lg";
  className?: string;
  /** Force le rechargement de l'image (ex. après upload). */
  cacheBust?: string | number;
};

const sizeClasses = {
  sm: "w-10 h-10 text-sm",
  md: "w-14 h-14 text-base",
  lg: "w-24 h-24 text-2xl",
};

/** Avatar utilisateur (Cloudinary, Google picture, initiales). */
function withCacheBust(url: string, cacheBust?: string | number) {
  if (cacheBust == null || cacheBust === "") return url;
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}v=${encodeURIComponent(String(cacheBust))}`;
}

export function UserAvatar({
  user,
  profile = null,
  size = "md",
  className = "",
  cacheBust,
}: Props) {
  const [imgFailed, setImgFailed] = useState(false);
  const baseUrl = resolveAvatarUrl(user, profile);
  const url = baseUrl ? withCacheBust(baseUrl, cacheBust) : undefined;
  const showImage = Boolean(url) && !imgFailed;
  const initials = avatarInitials(user, profile);

  useEffect(() => {
    setImgFailed(false);
  }, [url, cacheBust]);

  return (
    <div
      className={`relative rounded-full overflow-hidden bg-bg-alt border-2 border-border shrink-0 flex items-center justify-center font-bold text-primary-dk ${sizeClasses[size]} ${className}`}
    >
      {showImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={url}
          alt=""
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
          onError={() => setImgFailed(true)}
        />
      ) : (
        <span aria-hidden>{initials}</span>
      )}
    </div>
  );
}
