export type AnalyzePhotoSource = "openai" | "mock" | "fallback" | "manual";

export type AnalyzePhotoMeta = {
  source: AnalyzePhotoSource;
  model?: string;
  fallbackReason?: string;
};

export function parseAnalyzePhotoMeta(payload: unknown): AnalyzePhotoMeta {
  const root = (payload ?? {}) as Record<string, unknown>;
  const meta = (root.meta ?? {}) as Record<string, unknown>;

  const rawSource = String(
    meta.source ?? root.source ?? "openai",
  ).toLowerCase();

  const source: AnalyzePhotoSource =
    rawSource === "mock" ||
    rawSource === "fallback" ||
    rawSource === "manual" ||
    rawSource === "openai"
      ? rawSource
      : "openai";

  return {
    source,
    model: meta.model ? String(meta.model) : undefined,
    fallbackReason:
      meta.fallbackReason != null
        ? String(meta.fallbackReason)
        : meta.fallback_reason != null
          ? String(meta.fallback_reason)
          : undefined,
  };
}

export function isIndicativeEstimate(meta: AnalyzePhotoMeta): boolean {
  return meta.source !== "openai" || meta.fallbackReason != null;
}
