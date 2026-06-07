import { apiRequest } from "@/lib/api/client";
import { apiRequestWithAuth } from "@/lib/auth/refresh";
import { ApiError } from "@/lib/api/errors";
import type { ApiRequestOptions } from "@/lib/api/client";

/** Appel public d'abord ; retry authentifié si un token existe et que la route l'exige encore. */
export async function apiRequestPublicFirst<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  try {
    return await apiRequest<T>(path, options);
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      return apiRequestWithAuth<T>(path, options);
    }
    throw error;
  }
}
