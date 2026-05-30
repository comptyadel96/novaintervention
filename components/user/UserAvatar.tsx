"use client";

import { useEffect, useState } from "react";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { resolveAvatarUrl, avatarInitials } from "@/lib/auth/avatar";
import type { AuthUser, Profile } from "@/types/domain";

type Props = {
  user: AuthUser;
  profile?: Profile | null;
  size?: "sm" | "md" | "lg";
  className?: string;
  cacheBust?: string | number;
};

const sizePx = { sm: 40, md: 56, lg: 96 } as const;
const sizeClasses = {
  sm: "w-10 h-10 text-sm",
  md: "w-14 h-14 text-base",
  lg: "w-24 h-24 text-2xl",
};

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
  const px = sizePx[size];

  useEffect(() => {
    setImgFailed(false);
  }, [url, cacheBust]);

  const initials = avatarInitials(user, profile);

  return (
    <div
      className={`relative rounded-full overflow-hidden bg-bg-alt border-2 border-border shrink-0 flex items-center justify-center font-bold text-primary-dk ${sizeClasses[size]} ${className}`}
    >
      {showImage && url ? (
        <OptimizedImage
          src={url}
          alt=""
          width={px}
          height={px}
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
