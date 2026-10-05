import { NextResponse } from "next/server";

import { ApiError, apiErrorJson } from "@/lib/api/errors";
import { apiRequestWithAuth } from "@/lib/auth/refresh";

const PASSPORT_NOT_FOUND_CODES = new Set([
  "BUILDING_NOT_FOUND",
  "EQUIPMENT_NOT_FOUND",
  "DOCUMENT_NOT_FOUND",
  "TRANSFER_TARGET_NOT_FOUND",
]);

/**
 * 404 sans code métier : le backend n'expose pas encore `/passport/*`.
 * Un 404 `BUILDING_NOT_FOUND` est un vrai « introuvable », pas un service absent.
 */
export function isBackendMissing(error: unknown): boolean {
  return (
    error instanceof ApiError &&
    error.status === 404 &&
    !PASSPORT_NOT_FOUND_CODES.has(error.code ?? "")
  );
}

export async function passportRequest<T>(
  path: string,
  options: Parameters<typeof apiRequestWithAuth>[1] = {},
): Promise<T> {
  return apiRequestWithAuth<T>(`/passport${path}`, options);
}

/** Exécute un appel Passeport et normalise la réponse d'erreur du BFF. */
export async function passportJson<T>(
  handler: () => Promise<T>,
  options: {
    fallback: string;
    /** Valeur renvoyée (200) si le backend n'expose pas encore la route. */
    whenMissing?: unknown;
  },
): Promise<NextResponse> {
  try {
    const data = await handler();
    return NextResponse.json(data);
  } catch (error) {
    if (options.whenMissing !== undefined && isBackendMissing(error)) {
      return NextResponse.json(options.whenMissing);
    }
    const { message, status, code } = apiErrorJson(error, options.fallback);
    return NextResponse.json({ message, code }, { status });
  }
}
