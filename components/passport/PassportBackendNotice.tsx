import { Info } from "lucide-react";

/**
 * Affiché tant que le backend n'expose pas `/api/v1/passport/*`
 * (voir `docs/PASSPORT_BACKEND.md`).
 */
export function PassportBackendNotice() {
  return (
    <div className="flex gap-4 p-6 rounded-[2rem] border border-amber-200 bg-amber-50 text-amber-950">
      <Info size={22} className="shrink-0 mt-0.5" />
      <div>
        <p className="font-bold mb-1">Passeport en cours d&apos;activation</p>
        <p className="text-sm leading-relaxed">
          Votre espace Passeport est prêt côté application. Le service de
          stockage des bâtiments est en cours de déploiement : vos interventions
          continuent d&apos;être enregistrées et seront rattachées
          automatiquement dès l&apos;activation.
        </p>
      </div>
    </div>
  );
}
