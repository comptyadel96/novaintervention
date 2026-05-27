import { getApiBaseUrl, API_PREFIX } from "./config";
import { ApiError } from "./errors";

export type ApiRequestOptions = {
  method?: string;
  body?: unknown;
  token?: string | null;
  headers?: Record<string, string>;
  /** Si true, n'envoie pas de Content-Type JSON (upload multipart). */
  isFormData?: boolean;
};

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const { method = "GET", body, token, headers = {}, isFormData } = options;
  const url = `${getApiBaseUrl()}${API_PREFIX}${path}`;

  const requestHeaders: Record<string, string> = { ...headers };
  if (token) {
    requestHeaders.Authorization = `Bearer ${token}`;
  }
  if (body !== undefined && !isFormData) {
    requestHeaders["Content-Type"] = "application/json";
  }

  const response = await fetch(url, {
    method,
    headers: requestHeaders,
    body:
      body === undefined
        ? undefined
        : isFormData
          ? (body as FormData)
          : JSON.stringify(body),
    cache: "no-store",
  });

  if (!response.ok) {
    let message = `Erreur API (${response.status})`;
    let code: string | undefined;
    try {
      const payload = await response.json();
      message = payload.message ?? payload.error ?? message;
      code = payload.code;
    } catch {
      // corps non JSON
    }
    throw new ApiError(message, response.status, code);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}
