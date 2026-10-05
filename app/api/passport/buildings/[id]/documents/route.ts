import { mapDocument } from "@/lib/api/map-passport";
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
        `/buildings/${id}/documents`,
        { method: "POST", body },
      );
      return mapDocument(
        (data.document ?? data) as Record<string, unknown>,
        id,
      );
    },
    { fallback: "Ajout du document impossible." },
  );
}
