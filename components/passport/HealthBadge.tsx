import { CheckCircle2, Eye, Wrench } from "lucide-react";

import { HEALTH_LABELS, HEALTH_STYLES } from "@/lib/passport/labels";
import type { PassportHealth } from "@/types/passport";

const ICONS = {
  up_to_date: CheckCircle2,
  watch: Eye,
  action_required: Wrench,
} as const;

export function HealthBadge({
  health,
  className = "",
}: {
  health: PassportHealth;
  className?: string;
}) {
  const Icon = ICONS[health];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[11px] font-black uppercase tracking-wider ${HEALTH_STYLES[health]} ${className}`}
    >
      <Icon size={13} />
      {HEALTH_LABELS[health]}
    </span>
  );
}
