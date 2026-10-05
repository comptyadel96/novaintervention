import {
  CONFIDENCE_HINTS,
  CONFIDENCE_LABELS,
  CONFIDENCE_STYLES,
} from "@/lib/passport/labels";
import type { DataConfidence } from "@/types/passport";

export function ConfidenceBadge({
  level,
  className = "",
}: {
  level: DataConfidence;
  className?: string;
}) {
  return (
    <span
      title={CONFIDENCE_HINTS[level]}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-black uppercase tracking-wider ${CONFIDENCE_STYLES[level]} ${className}`}
    >
      {CONFIDENCE_LABELS[level]}
    </span>
  );
}
