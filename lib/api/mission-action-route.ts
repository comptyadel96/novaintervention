import { NextResponse } from "next/server";
import { mapMissionFromApiSingle } from "@/lib/api/mappers";
import { apiRequestWithAuth } from "@/lib/auth/refresh";
import { ApiError } from "@/lib/api/errors";

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
    const message =
      error instanceof Error ? error.message : "Action impossible.";
    const status = error instanceof ApiError ? error.status : 500;
    const code = error instanceof ApiError ? error.code : undefined;
    return NextResponse.json({ message, code }, { status });
  }
}
