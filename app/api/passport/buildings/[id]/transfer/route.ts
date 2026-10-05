import { passportJson, passportRequest } from "@/lib/api/passport-route";
import type { PassportTransferResult } from "@/types/passport";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json();

  return passportJson(
    async () => {
      return passportRequest<PassportTransferResult>(
        `/buildings/${id}/transfer`,
        { method: "POST", body },
      );
    },
    { fallback: "Transfert du passeport impossible." },
  );
}
