import { mapEvent } from "@/lib/api/map-passport";
import { passportJson, passportRequest } from "@/lib/api/passport-route";

/** Ajoute une ligne d'historique déclarée par le client (ex. travaux réalisés hors Nova). */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json();

  return passportJson(
    async () => {
      const data = await passportRequest<Record<string, unknown>>(
        `/buildings/${id}/events`,
        { method: "POST", body },
      );
      return mapEvent((data.event ?? data) as Record<string, unknown>, id);
    },
    { fallback: "Ajout à l'historique impossible." },
  );
}
