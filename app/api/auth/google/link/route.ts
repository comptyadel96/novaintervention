import { NextResponse } from "next/server";
import { apiRequestWithAuth } from "@/lib/auth/refresh";
import { mapSessionFromApi } from "@/lib/api/mappers";
import { apiErrorJson } from "@/lib/api/errors";

export async function POST(request: Request) {
  try {
    const { idToken } = (await request.json()) as { idToken: string };
    const data = await apiRequestWithAuth<Record<string, unknown>>(
      "/auth/google/link",
      {
        method: "POST",
        body: { idToken },
      },
    );

    const session = mapSessionFromApi({
      user: data.user,
      profile: data.profile,
    });

    return NextResponse.json(session);
  } catch (error) {
    const { message, status, code } = apiErrorJson(
      error,
      "Liaison Google impossible.",
    );
    return NextResponse.json({ message, code }, { status });
  }
}
