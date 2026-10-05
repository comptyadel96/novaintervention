import { mapEquipment } from "@/lib/api/map-passport";
import { passportJson, passportRequest } from "@/lib/api/passport-route";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json();

  return passportJson(
    async () => {
      const data = await passportRequest<Record<string, unknown>>(
        `/buildings/${id}/equipments`,
        { method: "POST", body },
      );
      return mapEquipment(
        (data.equipment ?? data) as Record<string, unknown>,
        id,
      );
    },
    { fallback: "Ajout de l'équipement impossible." },
  );
}
