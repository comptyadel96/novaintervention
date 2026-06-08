import { NextResponse } from "next/server";
import { mapMissionFromApiSingle } from "@/lib/api/mappers";
import { apiRequestWithAuth } from "@/lib/auth/refresh";
import { apiErrorJson } from "@/lib/api/errors";

type Params = { params: Promise<{ id: string }> };

export async function POST(_request: Request, { params }: Params) {
  const { id } = await params;

  try {
    const data = await apiRequestWithAuth<Record<string, unknown>>(
      `/missions/${id}/en-route`,
      { method: "POST" },
    );

    const missionRaw = (data.mission ?? data) as Record<string, unknown>;

    return NextResponse.json({
      message: data.message as string | undefined,
      clientNotified:
        data.clientNotified === true || data.client_notified === true,
      mission: mapMissionFromApiSingle(missionRaw),
    });
  } catch (error) {
    const { message, status, code } = apiErrorJson(
      error,
      "Notification client impossible.",
    );
    return NextResponse.json({ message, code }, { status });
  }
}
