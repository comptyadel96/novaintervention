import { getBrowserApiBaseUrl } from "@/lib/api/config";
import { ApiError } from "@/lib/api/errors";
import { bffFetch } from "@/lib/api/bff-client";
import { compressImageForUpload } from "@/lib/images/compress-for-upload";

const BFF_FALLBACK_MAX_BYTES = 1_400_000;

export type UploadedInterventionFile = {
  url: string;
  publicId?: string;
};

function isImageFile(file: File): boolean {
  return file.type.startsWith("image/") && file.type !== "image/gif";
}

async function postMultipart(
  url: string,
  file: File,
): Promise<UploadedInterventionFile> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(url, {
    method: "POST",
    body: formData,
  });

  const payload = (await response.json().catch(() => ({}))) as {
    url?: string;
    publicId?: string;
    message?: string;
    error?: string;
    code?: string;
  };

  if (!response.ok || !payload.url) {
    throw new ApiError(
      payload.message ?? payload.error ?? "Envoi de la photo impossible.",
      response.status || 502,
      payload.code,
    );
  }

  return { url: payload.url, publicId: payload.publicId };
}

/** Upload direct vers l'API Hetzner — le fichier ne transite pas par Vercel. */
async function uploadDirectToApi(
  file: File,
): Promise<UploadedInterventionFile> {
  return postMultipart(
    `${getBrowserApiBaseUrl()}/uploads/interventions`,
    file,
  );
}

async function uploadViaBff(file: File): Promise<UploadedInterventionFile> {
  return bffFetch<UploadedInterventionFile>("/api/uploads/interventions", {
    method: "POST",
    body: (() => {
      const formData = new FormData();
      formData.append("file", file);
      return formData;
    })(),
  });
}

/**
 * Point unique pour toutes les photos (demande, artisan, passeport).
 * Compresse, envoie à l'API, et n'utilise le BFF Vercel que pour un petit fichier.
 */
export async function uploadInterventionFile(
  file: File,
): Promise<UploadedInterventionFile> {
  const prepared = isImageFile(file) ? await compressImageForUpload(file) : file;

  try {
    return await uploadDirectToApi(prepared);
  } catch (directError) {
    if (prepared.size <= BFF_FALLBACK_MAX_BYTES) {
      try {
        return await uploadViaBff(prepared);
      } catch {
        throw directError;
      }
    }
    throw directError;
  }
}
