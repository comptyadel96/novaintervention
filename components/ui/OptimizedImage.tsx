"use client";

import Image from "next/image";

type OptimizedImageProps = {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
  referrerPolicy?: React.ImgHTMLAttributes<HTMLImageElement>["referrerPolicy"];
  onError?: () => void;
};

function isBlobOrDataUrl(src: string) {
  return src.startsWith("data:") || src.startsWith("blob:");
}

/** next/image pour URLs http(s) ; <img> natif pour data:/blob: (aperçus locaux). */
export function OptimizedImage({
  src,
  alt,
  className,
  width = 640,
  height = 480,
  fill,
  sizes,
  priority,
  referrerPolicy,
  onError,
}: OptimizedImageProps) {
  if (!src) return null;

  if (isBlobOrDataUrl(src)) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        className={className}
        referrerPolicy={referrerPolicy}
        onError={onError}
      />
    );
  }

  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        className={className}
        sizes={sizes ?? "(max-width: 768px) 100vw, 50vw"}
        priority={priority}
        referrerPolicy={referrerPolicy}
        onError={onError}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      sizes={sizes}
      priority={priority}
      referrerPolicy={referrerPolicy}
      onError={onError}
    />
  );
}

type MissionPhotoProps = {
  src?: string | null;
  alt: string;
  className?: string;
  heightClass?: string;
};

/** Photo mission Cloudinary — conteneur ratio fixe + lazy load. */
export function MissionPhoto({
  src,
  alt,
  className = "",
  heightClass = "h-32",
}: MissionPhotoProps) {
  if (!src) return null;

  return (
    <div
      className={`relative w-full overflow-hidden ${heightClass} ${className}`}
    >
      <OptimizedImage
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 50vw, 240px"
      />
    </div>
  );
}
