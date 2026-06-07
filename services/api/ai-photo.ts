export type AiPhotoStatus = {
  enabled: boolean;
  model?: string;
  textFallbackAvailable?: boolean;
};

export async function fetchAiPhotoStatus(): Promise<AiPhotoStatus> {
  const response = await fetch("/api/ai/status", {
    credentials: "include",
    cache: "no-store",
  });

  const payload = (await response.json().catch(() => ({}))) as {
    enabled?: boolean;
    model?: string;
    textFallbackAvailable?: boolean;
  };

  if (!response.ok) {
    return { enabled: false, textFallbackAvailable: true };
  }

  return {
    enabled: payload.enabled === true,
    model: payload.model,
    textFallbackAvailable: payload.textFallbackAvailable !== false,
  };
}
