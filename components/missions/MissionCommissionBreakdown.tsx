import { missionFeesFromMission } from "@/lib/missions/commission";
import type { Mission } from "@/types/domain";

export function MissionCommissionBreakdown({
  mission,
  variant = "default",
}: {
  mission: Mission;
  variant?: "default" | "compact";
}) {
  const fees = missionFeesFromMission(mission);
  if (!fees) return null;

  if (variant === "compact") {
    return (
      <p className="text-xs text-text-muted">
        {fees.isEstimate ? "Estimation" : "Clôturé"} — GMV{" "}
        {fees.priceFinal.toLocaleString("fr-FR")} € · Net artisan{" "}
        {fees.artisanPayout.toLocaleString("fr-FR")} €
      </p>
    );
  }

  return (
    <div className="rounded-2xl bg-bg-alt border border-border p-4 text-sm space-y-2">
      <p className="font-bold text-primary-dk">
        {fees.isEstimate ? "Estimation financière" : "Répartition (mission terminée)"}
      </p>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-text-muted font-bold">
            Client (GMV)
          </p>
          <p className="text-lg font-black text-primary-dk">
            {fees.priceFinal.toLocaleString("fr-FR")} €
          </p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-text-muted font-bold">
            Commission Nova (20 %)
          </p>
          <p className="text-lg font-black text-orange-600">
            {fees.platformFee.toLocaleString("fr-FR")} €
          </p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-text-muted font-bold">
            Net artisan (80 %)
          </p>
          <p className="text-lg font-black text-green-700">
            {fees.artisanPayout.toLocaleString("fr-FR")} €
          </p>
        </div>
      </div>
      {fees.isEstimate && (
        <p className="text-xs text-text-muted">
          Montants définitifs calculés à la clôture (status completed).
        </p>
      )}
    </div>
  );
}
