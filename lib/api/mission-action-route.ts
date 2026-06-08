import { NextResponse } from "next/server";
import { mapMissionFromApiSingle } from "@/lib/api/mappers";
import { apiRequestWithAuth } from "@/lib/auth/refresh";
import { apiErrorJson } from "@/lib/api/errors";

export async function proxyMissionAction(
  missionId: string,
  action: string,
  body?: unknown,
) {
  try {
    const data = await apiRequestWithAuth<unknown>(
      `/missions/${missionId}/${action}`,
      {
        method: "POST",
        body,
      },
    );
    return NextResponse.json(mapMissionFromApiSingle(data));
  } catch (error) {
    const { message, status, code } = apiErrorJson(
      error,
      "Action impossible.",
    );
    return NextResponse.json({ message, code }, { status });
  }
}
