import { NextResponse } from "next/server";
import { apiRequest } from "@/lib/api/client";
import { setAuthCookies } from "@/lib/auth/server-actions";
import { mapSessionFromApi } from "@/lib/api/mappers";
import { apiErrorJson } from "@/lib/api/errors";
import type { UserRole } from "@/types/domain";

type GoogleBody = {
  idToken: string;
  role?: UserRole;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as GoogleBody;
    const data = await apiRequest<Record<string, unknown>>("/auth/google", {
      method: "POST",
      body: {
        idToken: body.idToken,
        ...(body.role ? { role: body.role } : {}),
      },
    });

    await setAuthCookies(
      data.accessToken as string,
      data.refreshToken as string | undefined,
    );

    const session = mapSessionFromApi({
      user: data.user,
      profile: data.profile,
    });

    return NextResponse.json(session);
  } catch (error) {
    const { message, status, code } = apiErrorJson(
      error,
      "Connexion Google impossible.",
    );
    return NextResponse.json({ message, code }, { status });
  }
}
