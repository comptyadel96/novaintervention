export type AnalyzePhotoSource = "openai" | "mock";

export type AnalyzePhotoMeta = {
  source: AnalyzePhotoSource;
  model?: string;
};

/** meta.source === "mock" → bandeau mode démonstration (spec backend). */
export function parseAnalyzePhotoMeta(payload: unknown): AnalyzePhotoMeta {
  const root = (payload ?? {}) as Record<string, unknown>;
  const meta = (root.meta ?? {}) as Record<string, unknown>;

  const rawSource = String(
    meta.source ?? root.source ?? "openai",
  ).toLowerCase();

  if (rawSource === "mock") {
    return {
      source: "mock",
      model: meta.model ? String(meta.model) : undefined,
    };
  }

  return {
    source: "openai",
    model: meta.model ? String(meta.model) : undefined,
  };
}
