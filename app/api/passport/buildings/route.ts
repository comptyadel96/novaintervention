import { mapBuilding, mapBuildingList } from "@/lib/api/map-passport";
import { passportJson, passportRequest } from "@/lib/api/passport-route";

export async function GET() {
  return passportJson(
    async () => {
      const data = await passportRequest<unknown>("/buildings");
      return { items: mapBuildingList(data), backendReady: true };
    },
    {
      fallback: "Impossible de charger vos passeports.",
      whenMissing: { items: [], backendReady: false },
    },
  );
}

export async function POST(request: Request) {
  const body = await request.json();

  return passportJson(
    async () => {
      const data = await passportRequest<Record<string, unknown>>("/buildings", {
        method: "POST",
        body,
      });
      return mapBuilding((data.building ?? data) as Record<string, unknown>);
    },
    { fallback: "Création du passeport impossible." },
  );
}
