/** Client ID OAuth Google (front + fallback BFF si le backend est indisponible). */
export function resolveGoogleClientId(): string | undefined {
  const id = (
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? process.env.GOOGLE_CLIENT_ID
  )?.trim();
  return id || undefined;
}

export function isGoogleAuthConfigured(): boolean {
  return Boolean(resolveGoogleClientId());
}
