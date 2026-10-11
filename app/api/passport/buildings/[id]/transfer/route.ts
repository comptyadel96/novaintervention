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
      const data = await passportRequest<Record<string, unknown>>(
        `/buildings/${id}/transfer`,
        { method: "POST", body },
      );
      const owner = (data.newOwner ?? data.new_owner ?? {}) as Record<
        string,
        unknown
      >;
      return {
        message: String(data.message ?? "Passeport transféré."),
        transferredAt:
          (data.transferredAt as string | null) ??
          (data.transferred_at as string | null) ??
          null,
        keepAccess:
          data.keepAccess === true || data.keep_access === true,
        newOwner: {
          email: (owner.email as string | null) ?? null,
          firstName:
            (owner.firstName as string | null) ??
            (owner.first_name as string | null) ??
            null,
          lastName:
            (owner.lastName as string | null) ??
            (owner.last_name as string | null) ??
            null,
        },
      } satisfies PassportTransferResult;
    },
    { fallback: "Transfert du passeport impossible." },
  );
}
