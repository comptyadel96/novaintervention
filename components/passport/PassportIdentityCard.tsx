import { Calendar, Home, MapPin, Ruler } from "lucide-react";

import { HealthBadge } from "@/components/passport/HealthBadge";
import { BUILDING_KIND_LABELS, MEMBER_ROLE_LABELS } from "@/lib/passport/labels";
import type { Building, PassportHealth } from "@/types/passport";

export function PassportIdentityCard({
  building,
  health,
  completeness,
  readOnly = false,
}: {
  building: Building;
  health: PassportHealth;
  completeness: number;
  readOnly?: boolean;
}) {
  const facts = [
    { icon: Home, label: BUILDING_KIND_LABELS[building.kind] },
    { icon: MapPin, label: building.address },
    building.constructionYear
      ? { icon: Calendar, label: `Construit en ${building.constructionYear}` }
      : null,
    building.surfaceM2
      ? { icon: Ruler, label: `${building.surfaceM2} m²` }
      : null,
  ].filter(Boolean) as { icon: typeof Home; label: string }[];

  return (
    <section className="card p-8 bg-primary text-white rounded-[2.5rem] shadow-xl shadow-primary/20 relative overflow-hidden">
      <div className="relative z-10">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div>
            <p className="text-white/70 font-bold uppercase tracking-widest text-xs mb-2">
              Passeport Nova
              {building.role
                ? ` • ${MEMBER_ROLE_LABELS[building.role]}`
                : ""}
            </p>
            <h1 className="page-title text-white mb-0">{building.label}</h1>
            {readOnly && (
              <p className="mt-2 text-sm text-white/80">
                Accès en lecture seule : vous consultez ce passeport, sans le
                modifier.
              </p>
            )}
          </div>
          <HealthBadge health={health} className="bg-white/15 border-white/25 text-white" />
        </div>

        <ul className="flex flex-wrap gap-x-6 gap-y-3 mb-8">
          {facts.map((fact) => (
            <li
              key={fact.label}
              className="flex items-center gap-2 text-sm font-medium text-white/85"
            >
              <fact.icon size={16} className="shrink-0" />
              <span>{fact.label}</span>
            </li>
          ))}
        </ul>

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black uppercase tracking-widest text-white/70">
              Passeport complété
            </span>
            <span className="text-sm font-black">{completeness} %</span>
          </div>
          <div className="h-2 rounded-full bg-white/20 overflow-hidden">
            <div
              className="h-full rounded-full bg-white transition-all duration-700"
              style={{ width: `${completeness}%` }}
            />
          </div>
        </div>
      </div>

      <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
    </section>
  );
}
