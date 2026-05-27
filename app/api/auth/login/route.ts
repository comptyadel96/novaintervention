import { NextResponse } from "next/server";
import { apiRequest } from "@/lib/api/client";
import { ApiError } from "@/lib/api/errors";
import { setAuthCookies } from "@/lib/auth/server-actions";
import { mapSessionFromApi } from "@/lib/api/mappers";

type LoginBody = { email: string; password: string };

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as LoginBody;
    const data = await apiRequest<Record<string, unknown>>("/auth/login", {
      method: "POST",
      body,
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
    const message =
      error instanceof Error ? error.message : "Connexion impossible.";
    const status = error instanceof ApiError ? error.status : 500;
    const code = error instanceof ApiError ? error.code : undefined;
    return NextResponse.json({ message, code }, { status });
  }
}
