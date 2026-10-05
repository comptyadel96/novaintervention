import Link from "next/link";

import {
  RECOMMENDATION_KIND_LABELS,
  RECOMMENDATION_PRIORITY_LABELS,
  RECOMMENDATION_PRIORITY_STYLES,
} from "@/lib/passport/labels";
import type { PassportRecommendation } from "@/types/passport";

function formatDue(value?: string | null): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
}

export function PassportRecommendations({
  recommendations,
}: {
  recommendations: PassportRecommendation[];
}) {
  return (
    <section className="card p-8 bg-white border border-border rounded-[2rem] shadow-sm">
      <div className="mb-6">
        <h2 className="page-h3 mb-1">Prochaines actions utiles</h2>
        <p className="text-sm text-text-muted">
          Entretien, contrôle, remplacement à anticiper.
        </p>
      </div>

      {recommendations.length === 0 ? (
        <p className="text-sm text-text-muted italic">
          Rien à signaler. Les recommandations apparaissent à mesure que le
          passeport se remplit.
        </p>
      ) : (
        <ul className="space-y-3">
          {recommendations.map((recommendation) => {
            const due = formatDue(recommendation.dueAt);
            return (
              <li
                key={recommendation.id}
                className="flex flex-wrap items-center justify-between gap-4 p-5 border border-border rounded-2xl"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-primary uppercase tracking-wider">
                      {RECOMMENDATION_KIND_LABELS[recommendation.kind]}
                    </span>
                    <span
                      className={`px-2.5 py-1 rounded-full border text-[10px] font-black uppercase tracking-wider ${RECOMMENDATION_PRIORITY_STYLES[recommendation.priority]}`}
                    >
                      {RECOMMENDATION_PRIORITY_LABELS[recommendation.priority]}
                    </span>
                  </div>
                  <p className="page-h4 mb-1">{recommendation.title}</p>
                  {recommendation.description && (
                    <p className="text-sm text-text-muted leading-relaxed">
                      {recommendation.description}
                    </p>
                  )}
                  {due && (
                    <p className="text-xs text-text-muted mt-1">
                      À prévoir : {due}
                    </p>
                  )}
                </div>

                <Link
                  href={`/demander?service=${encodeURIComponent(
                    recommendation.suggestedService ?? recommendation.kind,
                  )}`}
                  className="btn btn-outline btn-sm shrink-0"
                >
                  Planifier
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
