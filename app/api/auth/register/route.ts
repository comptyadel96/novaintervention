import { NextResponse } from "next/server";
import { apiRequest } from "@/lib/api/client";
import { ApiError } from "@/lib/api/errors";
import { setAuthCookies } from "@/lib/auth/server-actions";
import { mapSessionFromApi } from "@/lib/api/mappers";
import type { RegisterInput } from "@/types/domain";

type RegisterResponse = {
  accessToken: string;
  refreshToken?: string;
  user: unknown;
  profile?: unknown;
  message?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RegisterInput;
    const data = await apiRequest<RegisterResponse>("/auth/register", {
      method: "POST",
      body: {
        email: body.email,
        password: body.password,
        firstName: body.firstName,
        lastName: body.lastName,
        phone: body.phone,
        role: body.role ?? "client",
      },
    });

    if (data.accessToken) {
      await setAuthCookies(data.accessToken, data.refreshToken);
    }

    const session = mapSessionFromApi({
      user: data.user,
      profile: data.profile,
    });

    return NextResponse.json({
      message: data.message ?? "Compte créé avec succès.",
      user: session.user,
      profile: session.profile,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Inscription impossible.";
    const status = error instanceof ApiError ? error.status : 500;
    const code = error instanceof ApiError ? error.code : undefined;
    return NextResponse.json({ message, code }, { status });
  }
}
